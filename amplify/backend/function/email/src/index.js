/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const sendEmail = require('./sendEmail.js');
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
      console.log(keyValuePairs)
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
    
    const { emailAddress, subject, message } = formdata;
    const body = "Please click on below link to submit your responses "+message;
    console.log(event);
    console.log("1: "+message);

  
  
      console.log(process.env.AWS_SECRET_ACCESS_KEY);
      console.log(process.env.AWS_ACCESS_KEY_ID);
      console.log(process.env.AWS_REGION);
  
    
      const ses = new AWS.SES({ region: process.env.AWS_REGION });
    
      const params = {
        Destination: {
          ToAddresses: [emailAddress],
        },
        Message: {
          Body: {
            Text: { Data: body },
          },
          Subject: { Data: subject },
        },
        Source: 'mukkaaditya@gmail.com', 
      };
      console.log(params);
      const promise  = ses.sendEmail(params).promise();
  
    try {
      await promise;
      return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
          },
        body: JSON.stringify({ message: 'Email sent successfully' }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
          },
        body: JSON.stringify({ error: err }),
      };
    }
  };