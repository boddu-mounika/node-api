/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["DB_USERNAME","DB_PASS","cgkey"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
const aws = require("aws-sdk");
const axios = require("axios");

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const input = Buffer.from(event.body, "base64").toString("ascii");
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
    console.log(keyValuePairs);
    keyValuePairs.forEach((pair) => {
      const match = pair.match(/name="([^"]+)"\r\n\r\n(.+)\r\n/);

      if (match) {
        const name = match[1].replace(/%22/g, "");
        const value = match[2];
        formdata[name] = value;
      }
    });

    console.log(formdata);
  }
  const message = formdata.Body;
  const phoneNumber = formdata.From;
  let originalAnswer = "";
  let questions = [];
  let relevancyCheck = false;
  let prsentQuestion = {};
  let nextQuestion;

  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["DB_USERNAME", "DB_PASS", "cgkey"].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise();

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

  const checkPiiforresponse = () => {
    let result = { HaspiiInfo: 0, OriginalAnswer: "", PiiInfo: "" };
    let patterns = [/^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/, /123/];
    let PII = "";
    let arr = message.split(" ");
    for (let i = 0; i < arr.length; i++) {
      let temp = arr[i];
      for (let j = 0; j < patterns.length; j++) {
        regex = patterns[j];
        if (regex.test(temp) === true) {
          PII = PII + "," + temp;
        }
      }
    }
    console.log(PII);
    if (PII.length > 0) {
      result.HaspiiInfo = 1;
      result.PiiInfo = PII;
      originalAnswer = message;
    }
    return result;
  };

  const sendSms = async (question, message) => {
    console.log("SEND SMS STEP");
    console.log(process.env.AWS_REGION);
    const ses = new aws.SES({ region: process.env.AWS_REGION });
    let emailBody = "";
    emailBody !== "Your response seems to be irrelevant. Please respond again"
      ? "Here is your next question \n\n"
      : "";
    emailBody += message ? message : question.StandardQuestion;

    const params = {
      Destination: {
        ToAddresses: ["mukkaaditya@gmail.com"],
      },
      Message: {
        Body: {
          Text: { Data: emailBody },
        },
        Subject: { Data: "Action requried. Awaiting response!" },
      },
      Source: "mukkaaditya@gmail.com",
    };
    console.log(params);
    const emailpromise = ses.sendEmail(params).promise();
    console.log("email sent next line");
    try {
      const emailresult = await emailpromise;
      console.log("EMAILLLLLLLLLLLLLLLLL" + emailresult);
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ error: err }),
      };
    }
  };

  const getQuestionsForCase = async () => {
    let query =
      "select * from questions where CaseId=(select Id from cases where PhoneNumber=@PhoneNumber and Status!='CANCELLED' and Status!='COMPLETE') ";

    const promise = new Promise((resolve, reject) => {
      let sql = require("mssql");
      console.log("step 2");
      sql.connect(config, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("step 3");
          const request = new sql.Request();
          request.input("PhoneNumber", sql.NVarChar, phoneNumber);

          request.query(query, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("step 7");
              resolve(result);
            }
          });
        }
      });
    });

    const result = await promise;
    //console.log("QUESTIONSSSSSSSSSSS");
    questions = result.recordset;
    //console.log(questions);
  };

  const checkChatGptRelevance = async () => {
    let prompt = process.env.RELEVANCY_CHECK_PROMPT;
    prompt += "QUESTION: " + prsentQuestion.StandardQuestion + ".";
    prompt += "ANSWER: " + message;
    const res = await axios.post(
      `https://api.openai.com/v1/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Parameters[2].Value,
        },
      }
    );
    console.log("relavancy output:" + res.data.choices[0].message.content);
    if (res.data.choices[0].message.content.toString().includes("100%")) {
      console.log("Relevant");
      let prompt = process.env.CHATGPT_PROMPT_ANSWER + ":" + message;
      relevancyCheck = true;
      const res = await axios.post(
        `https://api.openai.com/v1/chat/completions`,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + Parameters[2].Value,
          },
        }
      );
      originalAnswer = res.data.choices[0].message.content;
    } else {
      console.log("Irrelevant");
      relevancyCheck = false;
    }
  };

  var piiResult = checkPiiforresponse();
  await getQuestionsForCase();
  prsentQuestion = questions.filter(
    (x) => x.MsgSent === true && x.MsgReceived === null
  )[0];
  if (prsentQuestion.SequenceNumber !== questions.length) {
    console.log(prsentQuestion);
    nextQuestion = questions.filter(
      (x) => x.SequenceNumber === prsentQuestion.SequenceNumber + 1
    )[0];
  }
  console.log("Present Question: " + prsentQuestion.StandardQuestion);
  console.log(nextQuestion);
  if (piiResult.HaspiiInfo === 0) {
    console.log("No PII Info");
    await checkChatGptRelevance();
  } else {
    console.log("PII INFO present");
    originalAnswer = message;
    relevancyCheck = true;
  }
  if (relevancyCheck) {
    const promise = new Promise((resolve, reject) => {
      let date = Date.now();
      let sql = require("mssql");
      console.log("step 2");
      sql.connect(config, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("step 3");
          const request = new sql.Request();
          request.input("StandardAnswer", sql.NVarChar, message);
          request.input("Channel", sql.NVarChar, "Sms");
          request.input("OriginalAnswer", sql.NVarChar, originalAnswer);
          //request.input("InsertedTimeStamp", sql.DateTime, date);
          request.input("HasPiiInfo", sql.Bit, piiResult.HaspiiInfo);
          request.input("PiiInfo", sql.NVarChar, piiResult.PiiInfo);
          request.input("QuestionId", sql.Int, prsentQuestion.Id);
          request.input("CaseId", sql.Int, prsentQuestion.CaseId);
          let insertionQuery = "";
          if (nextQuestion !== null && nextQuestion !== undefined) {
            request.input("NextQuesId", sql.Int, nextQuestion.Id);
            insertionQuery += `UPDATE Questions set MsgSent = 1,MsgSentDateTime=getdate() where Id=@NextQuesId;`;
          }
          insertionQuery += ` UPDATE Questions set MsgReceived=1 where Id=@QuestionId;
            INSERT INTO [WebResponses] (StandardAnswer,Channel,OriginalAnswer,HasPiiInfo,PiiInfo,QuestionId,CaseId,InsertedTimeStamp,IsActive) VALUES (@StandardAnswer,@Channel,@OriginalAnswer,@HasPiiInfo,@PiiInfo,@QuestionId,@CaseId,getDate(),1)`;
          //let values = JSON.parse(req.body.insertObj);
          request.query(insertionQuery, (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log("step 7");
              resolve(result);
            }
          });
        }
      });
    });

    try {
      console.log("Hello");
      let result = {};

      result = await promise;

      console.log(nextQuestion);
      console.log("Step-1");
      await sendSms(nextQuestion, "");

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(
          "Response recorded Please reply to next question."
        ),
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
  } else {
    await sendSms(
      prsentQuestion,
      "Your response seems to be irrelevant. Please respond again"
    );
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(
        "Response seems irrelevant. Please send your response again."
      ),
    };
    return response;
  }
};
