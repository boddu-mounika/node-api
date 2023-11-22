// /*
// Use the following code to retrieve configured secrets from SSM:

const aws = require("aws-sdk");

// Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
// */
exports.handler = async (event) => {
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["DB_USERNAME", "DB_PASS"].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();
  console.log(Parameters);
  console.log("point-1");
  const promise = new Promise(function (resolve, reject) {
    let sql = require("mssql");

    const config = {
      user: Parameters[1].Value,
      password: Parameters[0].Value,
      server: "pocdb.cbjhfsw0n963.us-east-2.rds.amazonaws.com",
      port: 1433,
      options: {
        database: "StevePoc",
        encrypt:false
      },
    };
    console.log("point-2");
    sql.connect(config, (err) => {
      if (err) {
        console.log("point-3");
        reject(err);
      } else {
        const request = new sql.Request();

        const query = "SELECT * FROM customer";
        request.query(query, (err, result) => {
          if (err) {
            console.log("point-4");
            reject(err);
          } else {
            console.log("point-5");
            const response = {
              statusCode: 200,
              //  Uncomment below to enable CORS requests
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
              },
              body: JSON.stringify(result),
            };
            resolve(response);
          }
        });
      }
    })
  });

  console.log("point-6");
  return promise;
};
