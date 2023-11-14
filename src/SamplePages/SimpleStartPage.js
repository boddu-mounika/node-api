import Amplify, { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import axios from "axios";

const myAPI = "api747c26ec"
const path = '/customer'; 
// const options={
//     headers: {"Content-Type":"application/json"},
//     respose:true
// };

const SamplePage = () => {
  const [input, setInput] = useState("");
  const [customers, setCustomers] = useState([]);

  const chatGptCall = async () => {
    let resp = "";
    let prompt = "Who is presiden of India"
    console.log(prompt);
    await axios
      .post(
        `https://api.openai.com/v1/completions`,
        {
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
        }
      )
      .then((res) => {
        console.log(res);
        
        resp = res;
      });
    console.log(resp.data.choices[0].text);
    let newCustomers = [...customers];
        newCustomers.push({customerId:prompt, customerName:resp.data.choices[0].text});
        setCustomers(newCustomers);
    
    return resp.data.choices[0].text;
  };

  //Function to fetch from our backend and update customers array
  function getCustomer(e) {
    let customerId = e.input;
    API.get(myAPI, path+"/"+customerId )
      .then((response) => {
        console.log(response);
        let newCustomers = [...customers];
        newCustomers.push(response);
        setCustomers(newCustomers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="App">
      <h1>Super Simple React App</h1>
      <div>
        <input
          placeholder="customer id"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <br />
      <button onClick={() => chatGptCall({ input })}>
        Get Customer From Backend
      </button>

      <h2 style={{ visibility: customers.length > 0 ? "visible" : "hidden" }}>
        Response
      </h2>
      {customers.map((thisCustomer, index) => {
        return (
          <div key={thisCustomer.customerId}>
            <span>
              <b>CustomerId:</b> {thisCustomer.customerId} - <b>CustomerName</b>
              : {thisCustomer.customerName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SamplePage;
