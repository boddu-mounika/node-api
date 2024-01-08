import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export default function ViewResponseDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        TransitionComponent={props.Transition}
        onClose={props.handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Responses"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <span style={{ color: "black" }}>Client Response:</span>
            {" " + props.row.StandardAnswer}
          </DialogContentText>
          <br />
          <DialogContentText id="alert-dialog-slide-description">
            <span style={{ color: "black" }}>AI Response:</span>
            {" " + props.row.OriginalAnswer}
          </DialogContentText>
          <br />
          {props.row.HasPiiInfo === 1 && (
            <DialogContentText id="alert-dialog-slide-description">
              <span style={{ color: "black" }}>PII Info:</span>
              {" " + props.row.PiiInfo.replace(",", "")}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
