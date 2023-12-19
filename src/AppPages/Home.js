import * as React from "react";
import { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import { useLocation } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import { API, Storage } from "aws-amplify";
import { SES } from "@aws-sdk/client-ses";
import Loading from "./ReusableComponents/Loading";
import { Input } from "@mui/material";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Section,
} from "@react-pdf/renderer";

import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  CircularProgress,
  Box,
  Icon,
} from "@mui/material";
import { StadiumTwoTone } from "@mui/icons-material";

//import FileUploadComponent from "./UploadFileComponent";
//import { red } from "@mui/material/colors";
const myAPI = "api747c26ec";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function Home(props) {
  const location = useLocation();

  const { selectedRow } = location.state;
  let initialState = {
    question: "",
    phoneNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    inpFile: "",
    inpFileName: "",
    questions: [],
    isLoading: false,
    insertedQuestions: [],
    showTable: false,
    insertedId: 0,
    createCasePage: true,
    questionTable: [],
    chatInitiatedForCase: false,
    caseId: "",
    caseNumber: "",
    showResponsesDialog: false,
    showSendWebLinkDialog: false,
    standardAnswer: "",
    originalAnswer: "",
    s3bucketfileName: "",
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    console.log("CALLED>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    const { selectedRow } = location.state;
    if (
      location.state !== undefined &&
      location.state != null &&
      selectedRow !== null
    ) {
      setState({ ...state, isLoading: true });
      let path = "/getQuestions";
      let tableData = [];
      console.log(selectedRow); // output: "the-page-id"
      let questionTabledata = [];
      async function getData() {
        const formData = new FormData();
        console.log(selectedRow.Id);
        formData.append("insertedId", selectedRow.Id.toString());
        await API.get(myAPI, path + "/" + selectedRow.Id, {
          headers: {
            "Content-Type": "text/plain",
          },
        }).then(async (response) => {
          console.log(response);
          tableData = await response.recordset;
          console.log(tableData);
        });
        setState({
          ...state,
          questionTable: tableData,
          firstName: selectedRow.FirstName,
          lastName: selectedRow.LastName,
          middleName: selectedRow.MiddleName,
          phoneNumber: selectedRow.PhoneNumber,
          emailAddress: selectedRow.EmailId,
          chatInitiatedForCase: selectedRow.ChatInitiated,
          createCasePage: false,
          caseId: selectedRow.Id,
          caseNumber: selectedRow.CaseId,
          isLoading: false,
        });
      }
      getData();
    }
  }, []);

  const MyDoc = () => {
    // const formData = new FormData();
    // formData.append("caseId", state.insertedId === 0 ? state.caseId : state.insertedId);
    // let responses = [];
    // axios
    //   .post("http://localhost:5000/getDownloadContent", formData)
    //   .then((resultset) => {
    //     responses = resultset.data.recordset;
    //     console.log(responses);
    //   });
    let pdfText = "Hey";
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Case Number : {state.questionTable[0].CaseId}</Text>

            {state.questionTable.map((row) => (
              <div>
                <View style={styles.section}>
                  <Text>Question-{row.SequenceNumber}</Text>
                </View>
                <View style={styles.section}>
                  <Text>
                    Attorney Question :{"\n" + row.OriginalQuestion + "\n"}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text>
                    Layman Question : {"\n" + row.StandardQuestion + "\n"}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text>
                    Attorney Answer : {"\n" + row.OriginalAnswer + "\n"}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text>
                    Layman Answer : {"\n" + row.StandardAnswer + "\n"}
                  </Text>
                </View>
              </div>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  // const generatePdf = async () => {
  //   const docDefinition = {
  //     content: ["This is a PDF created using pdfMake "],
  //   };
  //   pdfMake.createPdf(docDefinition).download("myPdf.pdf");
  // };

  const chatGptCall = async (prompt) => {
    let resp = "";
    console.log(prompt);
    await axios
      .post(
        `https://api.openai.com/v1/completions`,
        {
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
        }
      )
      .then((res) => {
        console.log(res);
        resp = res;
      });
    console.log(resp);
    return resp.data.choices[0].text;
  };

  const viewResponse = async (questionId) => {
    const formData = new FormData();
    formData.append("questionId", questionId);
    let responses = [];
    await axios
      .post("http://localhost:5000/getResponses", formData)
      .then((resultset) => {
        responses = resultset.data.recordset;
        console.log(responses);
      });
    setState({
      ...state,
      showResponsesDialog: true,
      standardAnswer: responses[0].StandardAnswer,
      originalAnswer: responses[0].OriginalAnswer,
    });
  };

  const SendWebLink = async (CaseId) => {
    setState({ ...state, isLoading: true });
    console.log(state.caseId);
    console.log(state.caseNumber);
    const key =
      (state.caseId !== null && state.caseId !== ""
        ? state.caseId
        : state.insertedId) +
      "-" +
      state.caseNumber.split(" ").join("");

    const body = `${window.location.origin}/submit/${key}`;
    console.log(body);
    const path = "/email";
    const formData = new FormData();
    formData.append("emailAddress", state.emailAddress);
    formData.append("subject", "Submit form");
    formData.append("message", body.toString());
    const result = await API.post(myAPI, path, {
      headers: {
        "content-type": "multipart/form-data",
      },
      body: formData,
    });
    setState({
      ...state,
      showSendWebLinkDialog: true,
      isLoading: false,
    });
  };

  const refresh = async () => {
    setState({ ...state, isLoading: true });
    const formData = new FormData();
    let path = "/getQuestions";
    formData.append(
      "insertedId",
      state.insertedId === 0 ? state.caseId : state.insertedId
    );
    console.log(state.insertedId === 0 ? state.caseId : state.insertedId);
    let questions = [];
    //   .post("http://localhost:5000/getQuestions", formData)
    //   .then((resultset) => {
    //     //setState({...state,isLoading:false,insertedQuestions:resultset.data.recordset,showTable:true,insertedId:insertedId});

    //     questions = resultset.data.recordset;
    //     console.log(questions);
    //   });// await axios

    await API.get(
      myAPI,
      path + "/" + (state.insertedId === 0 ? state.caseId : state.insertedId),
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    ).then(async (response) => {
      console.log(response);
      questions = await response.recordset;
      console.log(questions);
    });
    setState({ ...state, questionTable: questions, isLoading: false });
  };

  const startConversation = async () => {
    setState({ ...state, isLoading: true });

    //Get first question
    let tableData = [];
    let UpdatedTable1 = null;
    console.log(state.insertedId);
    console.log(state.caseId);
    const formData = new FormData();
    formData.append(
      "insertedId",
      state.insertedId === 0 ? state.caseId : state.insertedId
    );
    await axios
      .post("http://localhost:5000/getFirstQuestion", formData)
      .then(async (response) => {
        console.log(response);
        let prompt =
          "Give me below interogatory question in layman language so that my client can easily answer ";
        console.log(prompt + ":" + response.data.recordset[0].OriginalQuestion);
        const chatgptreply = await chatGptCall(
          prompt + response.data.recordset[0].OriginalQuestion
        );
        console.log(chatgptreply);
        UpdatedTable1 = await sendSms(
          chatgptreply,
          response.data.recordset[0].Id,
          response.data.recordset[0].SequenceNumber
        );
        //routeChange();
        const formData = new FormData();
        formData.append(
          "insertedId",
          state.insertedId === 0 ? state.caseId : state.insertedId
        );
      });
    //setState({...state, questionTable: [], showTable:true});
    setState({
      ...state,
      chatInitiatedForCase: true,
      questionTable: UpdatedTable1,
      showTable: true,
      isLoading: false,
    });
  };

  const sendSms = async (question, Id, SNo) => {
    let Updatedtable = null;
    const formData = new FormData();
    formData.append("text", question);
    formData.append("SNo", SNo);
    formData.append("phoneNumber", "+1" + state.phoneNumber);
    formData.append(
      "insertedId",
      state.insertedId === 0 ? state.caseId : state.insertedId
    );
    await axios
      .post("http://localhost:5000/sendSms", formData)
      .then(async (response) => {
        console.log(response);
        formData.append("Id", Id);
        await axios
          .post("http://localhost:5000/updateFirstQuestion", formData)
          .then((response) => {
            console.log(response);
            Updatedtable = response.data.recordset;
          });
      });

    return Updatedtable;
  };

  // const routeChange = () =>{
  //   let path = `newPath`;
  //   navigate(path);
  // }

  const handleChange = (e) => {
    let newState = { ...state };
    newState[e.target.name] = e.target.value;
    setState(newState);
    console.log(state);
  };

  const uploadFile = async (file, filename) => {
    try {
      await Storage.put(filename, file);

      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      filename = "1701211477646-Def Interrog to Plf.pdf";
      //Storage.get
      const response = await Storage.get(filename);
      console.log(response);
      //const fileUrl = URL.createObjectURL(response);
      window.open(response); // Open the file URL in a new tab for download
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  const handleFileChange = async (event) => {
    const path = "/getfilecontent";
    const file = event.target.files[0];
    let resp;
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");

    setState({ ...state, isLoading: true });

    await uploadFile(file, filename).then(async () => {
      console.log(file);

      const response = await API.get(myAPI, path + "/" + filename, {
        headers: {
          "Content-Type": "text/plain",
        },
      }).then((response) => {
        console.log(response);
        resp = response;
        console.log(state);

        updateStateAfterFileUpload(file, filename, resp);
      });
    });
  };

  const updateStateAfterFileUpload = (file, filename, resp) => {
    let myregexp = new RegExp("\\s+[0-9]+\\.+\\s");
    const myArray = resp.split(myregexp);

    setState({
      ...state,
      isLoading: false,
      questions: myArray,
      inpFile: file,
      inpFileName: file.name,
      s3bucketfileName: filename,
    });
  };

  const handleFileChange1 = async (event) => {
    //const myAPI = "api747c26ec";
    const path = "/getfilecontent";
    const file = event.target.files[0];
    let resp;
    //console.log(file);
    const filename = Date.now() + "-" + file.name.replace(/ /g, "");
    console.log(file.name);
    //setState({ ...state, isLoading: true });
    setState({
      ...state,
      //questions: myArray,
      inpFile: file,
      inpFileName: file.name,
      s3bucketfileName: filename,
      //isLoading: false,
    });
    // await uploadFile(file, filename).then(async () => {
    //   console.log(file);

    //   const response = await API.get(myAPI, path + "/" + filename, {
    //     headers: {
    //       "Content-Type": "text/plain",
    //     },
    //   }).then((response) => {
    //     console.log(response);
    //     resp = response;
    //     console.log(state);
    //   });
    //   //});

    //   let myregexp = new RegExp("\\s+[0-9]+\\.+\\s");
    //   const myArray = resp.split(myregexp);
      
    // });
  };

  // const onSubmit = async () => {
  //   const path4 = "/Chatgptcall"
  //   API.get(myAPI,path4+"/"+34);
  // }

  const onSubmit = async () => {
    setState({ ...state, isLoading: true });
    console.log(state.questions);
    const path = "/submitcase";
    const path2 = "/insertquestions";
    const path3 = "/getQuestions";
    const path4 = "/Chatgptcall";
    const formData = new FormData();
    let insertedQuestions = [];
    let insertedId = 0;

    let CaseNumber = state.questions[0].match(
      "CASE NO+\\.\\s+[0-9]+\\-[A-Z]+\\-+[0-9]+"
    );

    console.log(CaseNumber);
    //formData.append("insertObj", JSON.stringify(insertObj));
    formData.append("FirstName", state.firstName);
    formData.append("LastName", state.lastName);
    formData.append("MiddleName", state.middleName);
    formData.append("PhoneNumber", state.phoneNumber);
    formData.append("EmailId", state.emailAddress);
    formData.append("CaseId", CaseNumber);
    formData.append("s3BucketFileName", state.s3bucketfileName);
    //console.log(state.phoneNumber);
    console.log(formData);
    let insertObj = [];
    //CaseId
    // await axios
    //   .post("http://localhost:5000/test", formData)
    const result = await API.post(myAPI, path, {
      body: formData,
    }).then(async (response) => {
      console.log(response);
      formData.append("InsertedId", response);
      insertedId = response;
      console.log(state);

      let CaseNo = new RegExp(
        "CASE NO+\\.\\s+[0-9]+\\-[A-Z]+\\-+[0-9]+\\s+[0-9]"
      );

      for (var i = 1; i < state.questions.length - 1; ++i) {
        let result = state.questions[i].replace(CaseNo, "");
        result = result.replace(/\n/g, "");
        result = result.replace(/'/g, "");
        result = result.replace(/"/g, "");
        console.log(result);
        console.log(i);
        insertObj.push([response, result, i]);
      }
      console.log(insertObj);
      formData.append("insertObj", JSON.stringify(insertObj));

      console.log(response);
      //await axios
      await API.post(myAPI, path2, { body: formData }).then(async () => {
        console.log("Succesfully.");
        formData.append("insertedId", insertedId.toString());
        //await axios

        await API.get(myAPI, path3 + "/" + insertedId, {
          headers: {
            "Content-Type": "text/plain",
          },
        }).then((resultset) => {
          //setState({...state,isLoading:false,insertedQuestions:resultset.data.recordset,showTable:true,insertedId:insertedId});
          console.log(resultset);
          insertedQuestions = resultset.recordset;
          API.get(myAPI, path4 + "/" + insertedId);
        });
      });
    });

    setState({
      ...state,
      isLoading: false,
      insertedQuestions: insertedQuestions,
      questionTable: insertedQuestions,
      showTable: true,
      insertedId: insertedId,
      caseNumber: CaseNumber[0],
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      showResponsesDialog: false,
      showSendWebLinkDialog: false,
    });
  };

  return !state.isLoading ? (
    <React.Fragment>
      <Dialog
        open={state.showResponsesDialog}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Responses"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <h4>Client Answer:</h4>
            {state.standardAnswer}
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description">
            <h4>Converted Answer:</h4>
            {state.originalAnswer}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={state.showSendWebLinkDialog}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Select communication channel"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <h4>An email hase been sent to user. </h4>
            {state.emailAddress}
          </DialogContentText>
          {/* <DialogContentText id="alert-dialog-slide-description">
            <h4>Email:</h4>
            {state.emailAddress}
            <div style={{ marginTop: "30px", float: "right" }}>
              <Button
                variant="contained"
                onClick={handleClose}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </div>
          </DialogContentText> */}
        </DialogContent>
      </Dialog>

      <Box
        //component="form"
        sx={{
          flexGrow: 1,
          "& .MuiTextField-root": {
            m: 1,
            width: "40ch",
            verticalAlign: "center",
          },
        }}
        noValidate
        autoComplete="off"
      >
        {/* <Grid>
          <Link to="/">
            <IconButton
              style={{ margin: "10px" }}
              variant="contained"
              //onClick={goToHome}
            >
              <HomeIcon />
            </IconButton>
          </Link>
        </Grid> */}
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ margin: "10px" }}>
            <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              onChange={handleChange}
              value={state.firstName}
              disabled={
                !state.createCasePage ||
                (state.showTable && state.questionTable.length > 0)
              }
            />
            <TextField
              id="middleName"
              name="middleName"
              label="Middle Name"
              variant="outlined"
              onChange={handleChange}
              value={state.middleName ? state.middleName : ""}
              disabled={
                !state.createCasePage ||
                (state.showTable && state.questionTable.length > 0)
              }
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              variant="outlined"
              onChange={handleChange}
              value={state.lastName}
              disabled={
                !state.createCasePage ||
                (state.showTable && state.questionTable.length > 0)
              }
            />
          </Grid>

          <Grid item xs={12} style={{ marginLeft: "10px" }}>
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              variant="outlined"
              onChange={handleChange}
              value={state.phoneNumber}
              disabled={
                !state.createCasePage ||
                (state.showTable && state.questionTable.length > 0)
              }
            />
            <TextField
              id="emailAddress"
              name="emailAddress"
              label="Email Address"
              variant="outlined"
              onChange={handleChange}
              value={state.emailAddress}
              disabled={
                !state.createCasePage ||
                (state.showTable && state.questionTable.length > 0)
              }
            />
          </Grid>
          <Grid item xs={12}>
            {((!state.createCasePage && state.questionTable.length > 0) ||
              (state.showTable && state.questionTable.length > 0)) && (
              // <Link to="/Case" state={{ selectedRow: selectedRow }}>
              <Button
                style={{ marginLeft: "35px", marginTop: "5px" }}
                variant="outlined"
                onClick={startConversation}
                disabled={state.chatInitiatedForCase}
              >
                Initiate Chat
              </Button>
            )}
            {state.questionTable.length > 0 && (
              <Button
                style={{ marginLeft: "35px", marginTop: "5px" }}
                variant="outlined"
                onClick={() => SendWebLink(state.CaseId)}
              >
                Send WebLink
              </Button>
            )}
            {state.questionTable.length > 0 && (
              <Button
                style={{ marginLeft: "35px", marginTop: "5px" }}
                variant="outlined"
                onClick={handleDownload}
                startIcon={<DownloadIcon />}
              >
                Download as pdf
              </Button>
              // <PDFDownloadLink document={<MyDoc />} fileName="CaseDetails.pdf">
              //   {({ blob, url, loading, error }) =>
              //     loading ? "Loading document..." : "Download now!"
              //   }

              //   <Button
              //     style={{ marginLeft: "35px", marginTop: "5px" }}
              //     variant="outlined"
              //     //onClick={MyDoc}
              //     startIcon={<DownloadIcon />}
              //   >
              //     download as pdf
              //   </Button>
              // </PDFDownloadLink>
            )}
          </Grid>
          {state.createCasePage && !state.showTable && (
            <Grid item xs={12} style={{ marginLeft: "10px" }}>
              <Input
                style={{ margin: "10px" }}
                id="inpFile"
                variant="filled"
                type="file"
                onChange={handleFileChange}
                disabled={!state.createCasePage}
                //placeholder={state.inpFileName || "No file chosen"}
              />

              <input
                accept="pdf/*"
                //className={classes.input}
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleFileChange1}
                disabled={!state.createCasePage}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  //className={classes.button}
                >
                  Upload
                </Button>
              </label>
            </Grid>
          )}
          {state.createCasePage && !state.showTable && (
            <Grid item xs={12} style={{ marginLeft: "15px" }}>
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={
                  !state.createCasePage ||
                  !(
                    state.firstName !== "" &&
                    state.lastName !== "" &&
                    state.phoneNumber !== "" &&
                    state.emailAddress !== "" &&
                    state.inpFile != ""
                  )
                }
              >
                Submit
              </Button>
            </Grid>
          )}

          {((!state.createCasePage && state.questionTable.length > 0) ||
            state.showTable) && (
            <React.Fragment>
              <Grid
                item
                xs={12}
                style={{ border: "1px", borderColor: "black" }}
              >
                <div>
                  <IconButton
                    style={{ margin: "10px", float: "right" }}
                    variant="contained"
                    onClick={refresh}
                  >
                    <RefreshIcon />
                  </IconButton>
                  <h3 style={{ marginLeft: "15px", clear: "both" }}>
                    Question List{" "}
                  </h3>
                </div>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "10%" }}>Case no</TableCell>
                        {/* <TableCell>Case no</TableCell> */}
                        <TableCell>S.No</TableCell>
                        <TableCell style={{ width: "30%" }}>
                          Original Question
                        </TableCell>
                        <TableCell style={{ width: "30%" }}>
                          Formatted Question{" "}
                        </TableCell>
                        <TableCell>User response Web</TableCell>
                        <TableCell>Message Sent</TableCell>
                        <TableCell>Message Received</TableCell>
                        <TableCell>Responses</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {state.questionTable.map((row) => (
                        <TableRow key={row.Id}>
                          <TableCell>{row.CaseId}</TableCell>
                          <TableCell>{row.SequenceNumber}</TableCell>
                          <TableCell>{row.OriginalQuestion}</TableCell>
                          <TableCell>{row.StandardQuestion}</TableCell>
                          <TableCell>{row.StandardAnswerWeb}</TableCell>
                          <TableCell>
                            {(row.MsgSent === 1 || row.MsgSent === true) && (
                              <DoneIcon fontSize="small"></DoneIcon>
                            )}
                          </TableCell>
                          <TableCell>
                            {(row.MsgReceived === 1 ||
                              row.MsgReceived === true) && (
                              <React.Fragment>
                                <DoneIcon fontSize="small"></DoneIcon>
                              </React.Fragment>
                            )}
                          </TableCell>
                          <TableCell>
                            {(row.MsgReceived === 1 ||
                              row.MsgReceived === true) && (
                              <React.Fragment>
                                <Button
                                  variant="text"
                                  onClick={() => viewResponse(row.Id)}
                                >
                                  View
                                </Button>
                              </React.Fragment>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  ) : (
    <Loading />
  );
}
