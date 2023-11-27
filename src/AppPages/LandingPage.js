import * as React from "react";
//import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Amplify, { API } from "aws-amplify";
import {
  IconButton,
  Button,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const myAPI = "api747c26ec";
const path = "/customer";

export default function BasicTextFields() {
  let initialState = {
    rows: [],
    columns: [],
    tableData: [],
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = () => {
      //let customerId=1;
       API.get(myAPI, path,{
        headers:{
            'Content-Type':'text/plain'
        }
      }).then((response) => {
        console.log(response);
        setState({ ...state, tableData: response.recordset });
      }).catch((error) => {
        console.error(error);
      });;
    };

//   function fetchData() {
//     let customerId = 1;
//     alert("test-1");
//     API.get(myAPI, path + "/" + customerId)
//       .then((response) => {
//         console.log(response);
//         let newCustomers = [...customers];
//         newCustomers.push(response);
//         setCustomers(newCustomers);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

  return (
    <React.Fragment>
      <Grid item xs={6}>
        {/* <Link to="/">
          <IconButton
            style={{ margin: "10px" }}
            variant="contained"
            //onClick={goToHome}
          >
            <HomeIcon />
          </IconButton>
        </Link> */}

        <Link to="/Case" state={{ selectedRow: null }}>
          <Button variant="filled" startIcon={<AddIcon />}>
            Create New Case
          </Button>
        </Link>
      </Grid>
      <h3 style={{ margin: "15px" }}>Case History </h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              {/* <TableCell>Case no</TableCell> */}
              <TableCell>Full Name</TableCell>
              <TableCell>Phone No </TableCell>
              <TableCell>Email Id</TableCell>
              <TableCell>Case No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.tableData.map((row) => (
              <TableRow key={row.Id}>
                <TableCell>{row.Id}</TableCell>
                <TableCell>{`${row.FirstName || ""} ${row.MiddleName || ""} ${
                  row.LastName || ""
                }`}</TableCell>
                <TableCell>{row.PhoneNumber}</TableCell>
                <TableCell>{row.EmailId}</TableCell>
                <TableCell>
                  <Link to="/Case" state={{ selectedRow: row }}>
                    {row.CaseId}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
