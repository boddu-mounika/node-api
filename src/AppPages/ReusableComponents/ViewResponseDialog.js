import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ViewResponseDialog(props) {
  let date = new Date().toLocaleDateString('en-US');
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
            Client Answer:
            {props.standardAnswer}
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description">
            Converted Answer:
            {props.originalAnswer}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}