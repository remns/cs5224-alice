import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

export default class Institutions extends Component {
  constructor(props) {
    super(props);

    this.state = {};

  }

  render () {
    return (
      <Grid
        container
        spacing={2}
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={4}>
          {/* Filter */}
          <Paper>
            <Typography variant="h6">Filter</Typography>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          {/* List of institutions */}
          <Card>
            <Typography variant="h5">University</Typography>
            <Typography>Description</Typography>
          </Card>
        </Grid>
      </Grid>
    )
  }
}
