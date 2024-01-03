import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";

import AddNewCase  from "./AppPages/AddNewCase";
import Home from "./AppPages/Home";
import LandingPage from "./AppPages/LandingPage";
import Submit from "./AppPages/SubmitForm/Submit"
import Drawer from "./AppPages/ReusableComponents/Drawer"
import styles from './App.css'
import Sidebar from "./AppPages/ReusableComponents/Sidebar";
import { ButtonBase } from "@mui/material";
//import { makeStyles } from "@material-ui/core/styles";
const myAPI = "api747c26ec";
const path = "/customer";


// const useStyles = makeStyles({
//   container: {
//     display: "flex"
//   }
// });

function App({ signOut }) {
  //const classes = useStyles();
  const location = useLocation();
  console.log(location);
  const [input, setInput] = useState("");
  const [customers, setCustomers] = useState([]);
  return (
    <div style={{display:"flex"}}>
      {!location.pathname.includes('/submit') && (

      // <Box sx={{ flexGrow: 1 }}>
        <Sidebar signOut={signOut} />
      )}       

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Case" element={<Home />} />
        <Route exact path="/Home" element={<LandingPage />} />
        <Route exact path="/AddNewCase" element={<AddNewCase />} />
        <Route exact path="/Submit/:key" element={<Submit />}/>
      </Routes>

    </div>
  );
}


export default withAuthenticator(App);

// function getCustomer(e) {
//   let customerId = e.input;
//   alert("test-1");
//   API.get(myAPI, path + "/" + customerId)
//     .then((response) => {
//       console.log(response);
//       let newCustomers = [...customers];
//       newCustomers.push(response);
//       setCustomers(newCustomers);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

// <View className="App">
//     <div className="App">
//       <h1>Super Simple React App</h1>
//       <div>
//         <input
//           placeholder="customer id"
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />
//       </div>
//       <br />
//       {/* <button onClick={() => getCustomer({ input })}>
//         Get Customer data from Backend
//       </button> */}

//       <h2 style={{ visibility: customers.length > 0 ? "visible" : "hidden" }}>
//         Response
//       </h2>
//       {customers.map((thisCustomer, index) => {
//         return (
//           <div key={thisCustomer.customerId}>
//             <span>
//               <b>CustomerId:</b> {thisCustomer.customerId} -{" "}
//               <b>CustomerName</b>: {thisCustomer.customerName}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//     {/* <Sample /> */}
//     <Button onClick={signOut}>Sign Out</Button>
//   </View>
