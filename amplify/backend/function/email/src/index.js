/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const sendEmail = require("./sendEmail.js");
const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const input = Buffer.from(event.body, "base64").toString("ascii");
  //const formdata = decodeformdata(decodedBody);
  const boundaryRegex = /^--([^\r\n]+)/;
  const boundaryMatch = input.match(boundaryRegex);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;
  const formdata = {};
  if (boundary) {
    // Split the string into separate key-value pairs
    const keyValuePairs = input
      .split(`${boundary}--`)[0]
      .split(`${boundary}\r\n`)
      .slice(1);

    // Extract the data for each key-value pair
    console.log(keyValuePairs);
    keyValuePairs.forEach((pair) => {
      const match = pair.match(/name="([^"]+)"\r\n\r\n(.+)\r\n/);

      if (match) {
        const name = match[1];
        const value = match[2];
        formdata[name] = value;
      }
    });

    console.log(formdata);
  }

  const { emailAddress, subject, message, usebody } = formdata;
  const body = usebody === true || usebody==="true"
    ? message
    : `
  <html>
  <body>
    <p>Hello,</p>
    <p>Your case is being looked into. We kindly request your cooperation by providing your responses.</p>
    <p>Please click on below to submit your responses. \n ${message}</p>
    <p>NOTE: THIS EMAIL WAS SENT USING AN AUTOMATED EMAIL SYSTEM. PLEASE DO NOT RESPOND TO THIS EMAIL, AS THIS EMAIL INBOX IS NOT MONITORED.</p>
    <p>Thank you.</p>
  </body>
  </html>
`;
  console.log(event);
  console.log("1: " + message);

  const ses = new AWS.SES({ region: process.env.AWS_REGION });

  const params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Html: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: "mukkaaditya@gmail.com",
  };
  console.log(params);
  const promise = ses.sendEmail(params).promise();

  try {
    await promise;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: err }),
    };
  }
};
