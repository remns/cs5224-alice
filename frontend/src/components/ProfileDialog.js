import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import React from 'react';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileDialog = ({ title, isOpen, handleOpen, education, gpa, alevel }) => {
  const handleClose = () => {
    handleOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText>
          {
            education === 0 &&
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item xs><Typography variant="h4" color="primary">Education Type</Typography></Grid>
              <Grid item xs><Typography variant="h6">Polytechnic</Typography></Grid>

              <br />

              <Grid item xs><Typography variant="h4" color="primary">Grade Point Average (GPA)</Typography></Grid>

              <Grid item xs><Typography variant="h6">{gpa}</Typography></Grid>
            </Grid>
          }

          {
            education === 1 &&
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item xs><Typography variant="h4" color="primary">Education Type</Typography></Grid>
              <Grid item xs><Typography variant="h6">Junior College</Typography></Grid>

              <br />

              <Grid item xs><Typography variant="h4" color="primary">A Level</Typography></Grid>

              <Grid item xs><Typography variant="h6">H2: <b>{alevel.h2_1}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">H2: <b>{alevel.h2_2}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">H2: <b>{alevel.h2_3}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">H1: <b>{alevel.h1}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">Project Work: <b>{alevel.pw}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">General Paper: <b>{alevel.gp}</b></Typography></Grid>
              <Grid item xs><Typography variant="h6">Mother Tongue: <b>{alevel.mtl}</b></Typography></Grid>
            </Grid>
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileDialog;