import * as React from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import * as myConstClas from "../../Util/Constants";
import Button from "@mui/material/Button";

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: "20%",
  height: 45,
  //padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
}));

export default function FilterBar(props) {
  let allCount = props.tableData.length;
  let newCount = props.tableData.filter(
    (x) => x.Status === myConstClas.STATUS_NEW
  ).length;
  let attestedCount = props.tableData.filter(
    (x) => x.Status === myConstClas.STATUS_ATTESTED
  ).length;
  let awaitingListCount = props.tableData.filter(
    (x) => x.Status === myConstClas.STATUS_AWAITING
  ).length;
  let completeCount = props.tableData.filter(
    (x) => x.Status === myConstClas.STAUS_COMPLETE
  ).length;
  let cancelCount = props.tableData.filter(
    (x) => x.Status === myConstClas.STATUS_CANCEL
  ).length;

  return (
    <Stack direction="row" spacing={3}>
      {/* <DemoPaper variant="elevation">
        <Button
          onClick={() => props.filterTbaleData(myConstClas.STATUS_ALL)}
          variant="text"
          disabled={allCount===0}
        >
          {"All - " + allCount}
        </Button>
      </DemoPaper> */}
      <DemoPaper
        variant="elevation"
        style={{
          backgroundColor:
            props.selectedFilter === myConstClas.STATUS_NEW ? "#0041A5" : "",
        }}
      >
        <Button
          style={{
            width: "100%",
            height: "100%",
            color:
              props.selectedFilter === myConstClas.STATUS_NEW ? "white" : "",
          }}
          onClick={() => props.filterTbaleData(myConstClas.STATUS_NEW)}
          variant="text"
          disabled={newCount === 0}
        >
          {"New - " + newCount}
        </Button>
      </DemoPaper>
      <DemoPaper
        variant="elevation"
        style={{
          backgroundColor:
            props.selectedFilter === myConstClas.STATUS_ATTESTED
              ? "#0041A5"
              : "",
        }}
      >
        <Button
          style={{ width: "100%", height: "100%", color:
          props.selectedFilter === myConstClas.STATUS_ATTESTED ? "white" : "", }}
          onClick={() => props.filterTbaleData(myConstClas.STATUS_ATTESTED)}
          variant="text"
          disabled={attestedCount === 0}
        >
          {"Attested - " + attestedCount}
        </Button>
      </DemoPaper>
      <DemoPaper
        variant="elevation"
        style={{
          backgroundColor:
            props.selectedFilter === myConstClas.STATUS_AWAITING
              ? "#0041A5"
              : "",
        }}
      >
        <Button
          style={{ width: "100%", height: "100%", color:
          props.selectedFilter === myConstClas.STATUS_AWAITING ? "white" : "",}}
          onClick={() => props.filterTbaleData(myConstClas.STATUS_AWAITING)}
          variant="text"
          disabled={awaitingListCount === 0}
        >
          {"Awaiting response - " + awaitingListCount}
        </Button>
      </DemoPaper>
      <DemoPaper
        variant="elevation"
        style={{
          backgroundColor:
            props.selectedFilter === myConstClas.STAUS_COMPLETE
              ? "#0041A5"
              : "",
        }}
      >
        <Button
          style={{ width: "100%", height: "100%", color:
          props.selectedFilter === myConstClas.STAUS_COMPLETE ? "white" : "",}}
          onClick={() => props.filterTbaleData(myConstClas.STAUS_COMPLETE)}
          variant="text"
          disabled={completeCount === 0}
        >
          {"Complete - " + completeCount}
        </Button>
      </DemoPaper>
      <DemoPaper
        variant="elevation"
        style={{
          backgroundColor:
            props.selectedFilter === myConstClas.STATUS_CANCEL
              ? "#0041A5"
              : "",
        }}
      >
        <Button
          style={{ width: "100%", height: "100%", color:
          props.selectedFilter === myConstClas.STATUS_CANCEL ? "white" : "",}}
          onClick={() => props.filterTbaleData(myConstClas.STATUS_CANCEL)}
          variant="text"
          disabled={cancelCount === 0}
        >
          {"Cancelled - " + cancelCount}
        </Button>
      </DemoPaper>
    </Stack>
  );
}
