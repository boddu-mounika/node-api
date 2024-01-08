// /*
// Use the following code to retrieve configured secrets from SSM:

const aws = require("aws-sdk");
//const app = express();
//const cors = require("cors");
//app.use(cors());

exports.handler = async (event) => {
  const inputParam = event.pathParameters.id;
  const id = inputParam.split("-")[1];
  const fileName = inputParam;
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
    let query = "UPDATE Cases SET ResponseFileName=@fileName WHERE Id=@id";
    
      sql.connect(config, (err) => {
        if (err) {
          reject(err);
        } else {
          const request = new sql.Request();
          request.input("fileName", sql.NVarChar, fileName);
          request.input("id", sql.Int, id);
          
          request.query(query, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
  });

  try {
    const result = await promise;
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
      body: JSON.stringify(e.message),
    };
  }
};
