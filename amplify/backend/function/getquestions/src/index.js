

const aws = require("aws-sdk");

exports.handler =async (event) => {
    const id = event.pathParameters.id;
    //console.log("Hellooooooooooooooooooooo"+id)
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

    sql.connect(config, (err) => {
      if (err) {
        reject(err);
      } else {
        const request = new sql.Request();
        request.input("caseId", sql.NVarChar, id);  
      
        const selectQuery =`select q.Id, q.SequenceNumber,q.MsgSentDateTime,  q.CaseId, q.MsgSent, q.MsgReceived, q.OriginalQuestion ,q.StandardQuestion,  r.StandardAnswer, r.OriginalAnswer from questions q 
        left outer join responses r on q.Id = r.QuestionId
        where q.CaseId=@caseId order by q.SequenceNumber asc`;
        request.query(selectQuery, (err, result) => {
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
    console.log("Step-1");
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'Content-Type':'text/plain'
      },
      body: JSON.stringify(result),
    };
    return response;
  } catch(e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'Content-Type':'text/plain'
      },
      body: JSON.stringify(e.message),
    };
  }
};
