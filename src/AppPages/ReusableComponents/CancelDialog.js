import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CancelDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      {props.cancelConfirmation === true && (
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
                  "Are you sure you want to cancel the case. You will not be able to make any changes to case once it is cancelled."
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose}>Close</Button>
              <Button onClick={props.handleCancel} autoFocus>
                Cancel Case
              </Button>
            </DialogActions>
          </React.Fragment>
        </Dialog>
      )}
      {props.cancelConfirmation === false && (
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
                {"Case is cancelled!!"}
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
