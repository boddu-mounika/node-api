/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["DB_USERNAME","DB_PASS"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/

const querystring = require("querystring");

const aws = require("aws-sdk");
const decodeformdata = require("./decodeformdata");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
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
  let insertedId;
  //let formdata = decodeformdata.decodeformdata(decodedString);
  console.log(formdata);
  console.log(formdata.FirstName);
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["DB_USERNAME", "DB_PASS"].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();

  console.log(Parameters);

  const promise = new Promise((resolve, reject) => {
    let sql = require("mssql");

    const config = {
      user: Parameters[1].Value,
      password: Parameters[0].Value,
      server: "pocdb.cbjhfsw0n963.us-east-2.rds.amazonaws.com",
      port: 1433,
      options: {
        database: "StevePoc",
        encrypt: false,
      },
    };
    console.log("step 2");
    sql.connect(config, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("step 3");
        const request = new sql.Request();
        request.input("FirstName", sql.NVarChar, formdata.FirstName);
        request.input("LastName", sql.NVarChar, formdata.LastName);
        request.input("PhoneNumber", sql.Numeric, formdata.PhoneNumber);
        request.input("EmailId", sql.NVarChar, formdata.EmailId);
        request.input("CaseId", sql.NVarChar, formdata.CaseId);
        request.input("MiddleName", sql.NVarChar, formdata.MiddleName);
        request.input("s3BucketFileName",sql.NVarChar,formdata.s3BucketFileName)
        request.input("Status",sql.NVarChar,formdata.Status)
        request.input("LoggedInUser",sql.NVarChar,formdata.loggedinuser);
        request.input("LoggedInUserEmail",sql.NVarChar,formdata.loggedInuseremail);
        const insertionQuery =
          "INSERT INTO [Cases] (FirstName,MiddleName,LastName, PhoneNumber,EmailId, CaseId, s3BucketFileName, Status, LoggedInUser, LoggedInUserEmail, CreateTimeStamp) VALUES (@FirstName,@MiddleName, @LastName,@PhoneNumber,@EmailId, @CaseId, @s3BucketFileName, @Status, @LoggedInUser, @LoggedInUserEmail, getdate()) SELECT SCOPE_IDENTITY() as id";
        //let values = JSON.parse(req.body.insertObj);
        request.query(insertionQuery, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log("step 7");
            insertedId = result.recordset[0].id;
            console.log(result.recordset[0].id);
            resolve(insertedId.toString());
          }
        });
      }
    });
  });

  try {
    console.log("Hello");
    const result = await promise;
    console.log("Step-1");
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(result),
    };
    return response;
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(e),
    };
  }
};
