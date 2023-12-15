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
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Amplify, { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
// import Sample from "./SamplePages/SimpleStartPage";
// import Sidebar from "./ChatGptPoc/Sidebar";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import AddNewCase  from "./AppPages/AddNewCase";
import Home from "./AppPages/Home";
import LandingPage from "./AppPages/LandingPage";
import Submit from "./AppPages/SubmitForm/Submit"

const myAPI = "api747c26ec";
const path = "/customer";

function App({ signOut }) {
  const location = useLocation();
  console.log(location);
  const [input, setInput] = useState("");
  const [customers, setCustomers] = useState([]);
  return (
    <div>
      {!location.pathname.includes('/submit') && (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <Link to="/">
              <IconButton
                style={{ margin: "10px" }}
                variant="contained"
                //onClick={goToHome}
              >
                <HomeIcon />
              </IconButton>
            </Link>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Welcome! to Steve's Legit Hub
            </Typography>
            <Button onClick={signOut}>Sign Out</Button>
          </Toolbar>
        </AppBar>
      </Box>)}

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
