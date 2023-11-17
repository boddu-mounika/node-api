/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(event);
  const customerId = event.pathParameters.customerId;
  var sql = require("mssql");
  let res;
  // config for your database
  const config = {
    user: "admin",
    password: "Helloworld123",
    server: "pocdb.cbjhfsw0n963.us-east-2.rds.amazonaws.com,1433",
    database: "StevePoc",
  };
  console.log("connecting");
  // connect to your database
  sql.connect(config, function (err) {
    console.log("ey");
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query("select * from customer", function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      //res.send(recordset);
      console.log(recordset);
    });
  });
  const customer = {
    customerId: res,
    customerName: "Customer " + res,
  };

  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(customer),
  };
  return response;
};
