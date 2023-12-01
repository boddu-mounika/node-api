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
  const input = Buffer.from(event.body, "base64").toString("ascii");
  //const formdata = decodeformdata(encodedBody);
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

    sql.connect(config).then((pool) => {
      const table = new sql.Table("Questions");
  
      table.create = false;
      table.columns.add("CaseId", sql.NVarChar(100), { nullable: false });
      table.columns.add("OriginalQuestion", sql.NVarChar(sql.MAX), {
        nullable: false,
      });
      table.columns.add("SequenceNumber", sql.Int, { nullable: true });
      let validstring = formdata.insertObj.replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");

      let values = JSON.parse(validstring);
      console.log(values);
      console.log(formdata.insertObj);
      
      console.log("1");          
      for (let j = 0; j < values.length; j += 1) {
        //console.log("2");
        table.rows.add(values[j][0].toString(), values[j][1], values[j][2]);
      }
  
      console.log(table.rows);
      const request = pool.request();
      //console.log(values);
      // // create Request object
      const results = request.bulk(table);
      console.log(`line 91: rows affected ${results.rowsAffected}`);
      resolve(results);
    });

    // sql.connect(config, (err) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     const table = new sql.Table("Questions");

    //     table.create = false;
    //     table.columns.add("CaseId", sql.NVarChar(100), { nullable: false });
    //     table.columns.add("OriginalQuestion", sql.NVarChar(sql.MAX), {
    //       nullable: false,
    //     });
    //     table.columns.add("SequenceNumber", sql.Int, { nullable: true });
    //     let values = JSON.parse(formdata.insertObj);
    //     console.log(values);
    //     console.log("1");
    //     for (let j = 0; j < values.length; j += 1) {
    //       //console.log("2");
    //       table.rows.add(values[j][0].toString(), values[j][1], values[j][2]);
    //     }

    //     console.log(table.rows);
    //     const request = sql.Request();
    //     //console.log(values);
    //     // // create Request object
    //     const results = request.bulk(table);
    //     resolve(results);
    //     console.log(`line 91: rows affected ${results.rowsAffected}`);
    //   }
    // });
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
