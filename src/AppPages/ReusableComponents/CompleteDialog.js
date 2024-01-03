import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CompleteDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      {props.completeConfirmation === true && (
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {
                  "Are you sure you want to complete the case?"
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>Close</Button>
              <Button onClick={props.handleComplete} autoFocus>
                Complete Case
              </Button>
            </DialogActions>
          </React.Fragment>
        </Dialog>
      )}
      {props.completeConfirmation === false && (
        <Dialog
          open={props.open}
          onClose={props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">{"Information"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Case is completed!!!"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>Close</Button>
            </DialogActions>
          </React.Fragment>
        </Dialog>
      )}
    </React.Fragment>
  );
}
