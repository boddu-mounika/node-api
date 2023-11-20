

exports.handler = async (event) => {

  console.log("point-1")
  const promise = new Promise(function (resolve, reject) {
    let sql = require("mssql");

    const config = {
      user: "admin",
      password: "Helloworld123",
      server: "pocdb.cbjhfsw0n963.us-east-2.rds.amazonaws.com",
      port: 1433,
      options: {
        database: "StevePoc",
        encrypt: false,
      },
    };
    console.log("point-2")
    sql.connect(config, (err) => {
      if (err) {

        console.log("point-3")
        reject(err);
      } else {
        const request = new sql.Request();

        const query = "SELECT * FROM customer";
        request.query(query, (err, result) => {
          if (err) {
            console.log("point-4")
            reject(err);
          } else {
            console.log("point-5")
            resolve(result);
          }
        });
      }
    });
  });

  console.log("point-6")
  return promise;
};
