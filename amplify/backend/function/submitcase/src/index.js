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

const aws = require("aws-sdk");
const decodeformdata = require("./decodeformdata");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  //const body = JSON.parse(event.body);
  const decodedString = Buffer.from(event.body, "base64").toString("ascii");
  let insertedId;
  let formdata = decodeformdata.decodeformdata(decodedString);
  console.log(formdata);
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["DB_USERNAME", "DB_PASS"].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();

  //console.log(Parameters);

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

    sql.connect(config, (err) => {
      if (err) {
        reject(err);
      } else {
        const request = new sql.Request();
        request.input("FirstName", sql.NVarChar, formdata.FirstName);
        request.input("LastName", sql.NVarChar, formdata.LastName);
        request.input("PhoneNumber", sql.Numeric, formdata.PhoneNumber);
        request.input("EmailId", sql.NVarChar, formdata.EmailId);
        request.input("CaseId", sql.NVarChar, formdata.CaseId);
        request.input("MiddleName", sql.NVarChar, formdata.MiddleName);
        const insertionQuery =
          "INSERT INTO [Cases] (FirstName,MiddleName,LastName, PhoneNumber,EmailId, CaseId) VALUES (@FirstName,@MiddleName, @LastName,@PhoneNumber,@EmailId, @CaseId) SELECT SCOPE_IDENTITY() as id";
        //let values = JSON.parse(req.body.insertObj);
        request.query(insertionQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
             insertedId = result.recordset[0].id;
        console.log(result.recordset[0].id);
            resolve(insertedId.toString());
          }
        });
      }
    });
  });

  try {
    const result = await promise;
    console.log("Step-1");
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(insertedId),
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
