/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const axios = require("axios");
const aws = require("aws-sdk");

exports.handler = async (event) => {
  const isQuestion = true;
  console.log(event.pathParameters.question);
  const question = event.pathParameters.question;
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["key"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();
  const chatgptPrompt =
    (isQuestion
      ? process.env.CHATGPT_PROMPT
      : process.env.CHATGPT_PROMPT_ANSWER) + event.pathParameters.question;
  console.log(`EVENT: ${JSON.stringify(event)}`);
  let resp = "";
  let prompt = "Who is presiden of India";
  console.log(prompt);
  try{
    await axios
      .post(
        `https://api.openai.com/v1/chat/completions`,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: chatgptPrompt,
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
            Authorization: "Bearer " + Parameters[0].Value,
          },
        }
      )
      .then((res) => {
        console.log(res);
        resp = res;
      });
    console.log(resp.data.choices[0].message.content);
    
        
    //return resp.data.choices[0].text;
    return {
      statusCode: 200,
      //Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(resp.data.choices[0].message.content),
    };
  } catch (error) {
    console.error("Error making chatgpt call", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: error.message,
    };
  }
};
