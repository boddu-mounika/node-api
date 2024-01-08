import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import Loading from "./ReusableComponents/Loading";
import HomePageTable from "./ReusableComponents/HomePageTable";
import Typography from "@mui/material/Typography";
import FilterBar from "./ReusableComponents/FilterBar";
import * as myConstClass from "../Util/Constants";
import RefreshIcon from "@mui/icons-material/Refresh";

import { Button, Grid, Box } from "@mui/material";

const myAPI = "api747c26ec";
const path = "/customer";

export default function BasicTextFields() {
  let initialState = {
    rows: [],
    columns: [],
    tableData: [],
    filteredTabledata: [],
    isLoading: false,
    selectedFilter: "",
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState({ ...state, isLoading: true });
    fetchData();
  }, []);

  const fetchData = async () => {
    //let customerId=1;
    await API.get(myAPI, path, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((response) => {
        console.log(response);
        response.recordset.forEach(element => {
          if(element.Status.includes(",")) {
            element.CancelQueue = element.Status;
            element.Status=myConstClass.STATUS_CANCEL;            
          } 
        });
        setState({
          ...state,
          tableData: response.recordset,
          isLoading: false,
          filteredTabledata: response.recordset,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const filterTbaleData = (filterType) => {
    let filteredTabledata = [];
    switch (filterType) {
      case myConstClass.STATUS_NEW:
        filteredTabledata = state.tableData.filter(
          (x) => x.Status === myConstClass.STATUS_NEW
        );
        break;
      case myConstClass.STATUS_ATTESTED:
        filteredTabledata = state.tableData.filter(
          (x) => x.Status === myConstClass.STATUS_ATTESTED
        );
        break;
      case myConstClass.STATUS_AWAITING:
        filteredTabledata = state.tableData.filter(
          (x) => x.Status === myConstClass.STATUS_AWAITING
        );
        break;
      case myConstClass.STAUS_COMPLETE:
        filteredTabledata = state.tableData.filter(
          (x) => x.Status === myConstClass.STAUS_COMPLETE
        );
        break;
      case myConstClass.STATUS_ALL:
        filteredTabledata = state.tableData.filter((x) => x.Status !== null);
        break;
      case myConstClass.STATUS_CANCEL:
        filteredTabledata = state.tableData.filter(
          (x) => x.Status === myConstClass.STATUS_CANCEL
        );
        break;
    }
    setState({
      ...state,
      filteredTabledata: filteredTabledata,
      selectedFilter: filterType,
    });
  };

  return !state.isLoading ? (
    <Box
      style={{ marginTop: "5%" }}
      component="main"
      sx={{ flexGrow: 1, p: 3 }}
    >
      {/* //{state.filteredTabledata.length > 0 && ( */}
        <React.Fragment>
          <FilterBar
            tableData={state.tableData}
            filterTbaleData={filterTbaleData}
            selectedFilter={state.selectedFilter}
          />
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography
                variant="h6"
                gutterBottom
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                Case History
              </Typography>
            </Grid>
            {!(state.selectedFilter === "" ||
              state.selectedFilter === myConstClass.STATUS_ALL) && (
                <Grid
                  item
                  xs={6}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={() => filterTbaleData(myConstClass.STATUS_ALL)}
                    variant="text"
                    //disabled={awaitingListCount === 0}
                    startIcon={<RefreshIcon />}
                  >
                    {"Reset Filters"}
                  </Button>
                </Grid>
              )}
          </Grid>

          <HomePageTable rows={state.filteredTabledata} />
        </React.Fragment>
      {/* )} */}
    </Box>
  ) : (
    <Loading />
  );
}
