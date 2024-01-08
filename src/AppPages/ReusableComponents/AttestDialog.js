import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AttestDialog(props) {
  let date = new Date().toLocaleDateString("en-US");
  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Attestation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Attest that all questions are accurate, up to date and have full
            meaning of all acronyms and sentences.
          </DialogContentText>
          <DialogContentText>
            Yes I attest all the questions in portal is accurate and update to
            date as of:
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Date"
            type="text"
            fullWidth
            variant="standard"
            disabled={true}
            value={date}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleAttestation}>Attest</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
