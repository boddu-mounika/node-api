import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { API, Storage } from "aws-amplify";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const DocumentGenerator = (props) => {
  const myAPI = "api747c26ec";
  const generateDocument = () => {
    let wordText = [];
    props.questionTable.forEach((element) => {
      wordText.push(
        new Paragraph({
          text: "Question " + element.SequenceNumber,
          heading: HeadingLevel.HEADING_1,
        })
      );
      wordText.push(
        new Paragraph({
          text: "Question " + element.StandardQuestion,
        })
      );
      wordText.push(
        new Paragraph({
          text: "Response ",
          heading: HeadingLevel.HEADING_1,
        })
      );
      wordText.push(
        new Paragraph({
          text: element.StandardAnswer,
        })
      );
    });
    if (props.responseFileName === "" || props.responseFileName === null) {
      props.changeIsLoading();
      let path = "/updateResponsePdf";
      const doc = new Document({
        sections: [
          {
            children: wordText,
          },
        ],
      });
      const filename = Date.now() + "-" + props.caseid;
      Packer.toBlob(doc).then((blob) => {
        // Upload the blob to AWS S3
        uploadToS3(blob, filename);
      });
      API.get(myAPI, path + "/" + filename).then(() => {
        props.handleDownload(filename, true);
      });
      props.changeIsLoading();
    } else {
      props.handleDownload(props.responseFileName, false);
    }
  };

  const uploadToS3 = async (blob, filename) => {
    // Use the Amplify Storage API to upload the blob to S3
    await Storage.put(filename, blob, {
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
      .then((result) => {
        console.log("File uploaded to S3:", result.key);
      })
      .catch((error) => {
        console.error("Error uploading file to S3:", error);
      });
  };

  return (
    <Button startIcon={<DownloadIcon />} onClick={generateDocument} variant="outlined" style={{ marginLeft: "20px" }}>
      Responses
    </Button>
    // <button onClick={generateDocument}>Generate .docx and Upload to S3</button>
  );
};

export default DocumentGenerator;
