import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import Amplify, { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import Sample from "./SamplePages/SimpleStartPage"

const myAPI = "api747c26ec";
const path = "/customer";

function App({ signOut }) {
  function getCustomer(e) {
    let customerId = e.input;
    API.get(myAPI, path + "/" + customerId)
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

  const [input, setInput] = useState("");
  const [customers, setCustomers] = useState([]);
  return (
    <View className="App">
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
        <button onClick={() => getCustomer({ input })}>
          Get Customer From Backend
        </button>

        <h2 style={{ visibility: customers.length > 0 ? "visible" : "hidden" }}>
          Response
        </h2>
        {customers.map((thisCustomer, index) => {
          return (
            <div key={thisCustomer.customerId}>
              <span>
                <b>CustomerId:</b> {thisCustomer.customerId} -{" "}
                <b>CustomerName</b>: {thisCustomer.customerName}
              </span>
            </div>
          );
        })}
      </div>
      {/* <Sample /> */}
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
