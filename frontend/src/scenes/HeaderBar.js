import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
  withRouter,
  Link
} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import CompareIcon from '@material-ui/icons/Compare';
import EqualizerIcon from '@material-ui/icons/Equalizer';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    paddingRight: '5px'
  }
}));

function ButtonAppBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#2783A8' }}>
        <Toolbar>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={1}>
              <Grid container direction="row" justify="center" alignItems="center">
                <img style={{ width: 100, minHeight: "100%" }} src="/images/alice2_inverted.png" />
              </Grid>
            </Grid>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={9}>
              <Grid container direction="row" justify="flex-end" alignItems="center">
                <Button className="h6" color="inherit" component={Link} to='/institutions'>
                  <HomeIcon className={classes.icon} /> Home
                </Button>
                <Button className="h6" color="inherit" component={Link} to='/compare'>
                  <CompareIcon className={classes.icon} /> Compare Universities
                </Button>
                <Button className="h6" color="inherit" component={Link} to='/statistics'>
                  <EqualizerIcon className={classes.icon} /> Statistics
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(ButtonAppBar);
