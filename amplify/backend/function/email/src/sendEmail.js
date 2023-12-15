const AWS = require("aws-sdk");

const sendEmail = (emailAddress, subject, message) => {
    console.log("2: "+emailAddress);       
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    console.log(AWS_SECRET_ACCESS_KEY);
    console.log(AWS_REGION);

  
    const ses = new AWS.SES({ apiVersion: '2010-12-01' });
  
    const params = {
      Destination: {
        ToAddresses: [emailAddress],
      },
      Message: {
        Body: {
          Text: { Data: message },
        },
        Subject: { Data: subject },
      },
      Source: 'mukkaaditya@gmail.com', 
    };
    console.log(params);
    return ses.sendEmail(params).promise();
  };
  
  module.exports.sendEmail = sendEmail;