const AWS = require("aws-sdk");
const PDFParser = require("pdf-parse");
const s3 = new AWS.S3();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  try {
    const fileKey = "public/" + event.pathParameters.key; // the key used to store the file in S3, e.g., 'myFile.pdf'
    console.log(fileKey);
    const params = {
      Bucket: "pocbucket160721-staging",
      Key: fileKey,
    };

    const fileData = await s3.getObject(params).promise();
    const fileContent = fileData.Body.toString("utf-8"); // assuming the PDF contains plain text
    const pdfBuffer = Buffer.from(fileData.Body);

    const options = {}; // You can customize the options if needed
    const data = await PDFParser(pdfBuffer, options);
    const plainText = data.text; // Extract plain text from the PDF file

    //const plainText = pdf.text; // Extract plain text from the PDF file

    // Perform any necessary processing on the fileContent

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: plainText,
    };
  } catch (error) {
    console.error("Error processing file:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: error.message,
    };
  }
};
