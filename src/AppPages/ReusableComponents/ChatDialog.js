import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function WeblinkDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {props.chatInitiatedForCase === false && (
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Are you sure you want to initiate chat with client for this case."}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>Cancel</Button>
              <Button onClick={props.startConversation} autoFocus>
                Start
              </Button>
            </DialogActions>
          </React.Fragment>
        )}
        {props.chatInitiatedForCase === true && (
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Message has been sent to client"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>Cancel</Button>
            </DialogActions>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}
