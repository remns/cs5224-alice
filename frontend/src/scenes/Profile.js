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
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      interests: [
        {
          name: "Arts",
          value: 0
        },
        {
          name: "Science",
          value: 1
        },
        {
          name: "Math",
          value: 2
        }
      ],
      interestsSelected: [],
      currentInput: 0,
      gpa: null,
      alevel: {
        h2_1: null,
        h2_2: null,
        h2_3: null,
        h1: null,
        pw: null,
        gp: null,
        mtl: null
      }
    };

  }

  componentDidMount(){
    fetch(process.env.REACT_APP_API + '/courses')
        .then((response) => {
          return response.json();
        })
        .then((results) => {
          console.log(results);
          this.setState({ courses: results });
        });
  }

  onNextSelected = () => {
    if(this.state.currentInput == 2){
      this.props.history.push('/institutions');
    }
    this.setState({ currentInput: this.state.currentInput + 1});
  }

  render () {
    const courses = this.state.courses.map((item, i) => (
      <div>
        <p>{ item.Title } (by {item.Uni})</p>
      </div>
    ));

    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Grid container justify="center" alignItems="center">
            <img style={{width: 200}} src="https://cdn.logo.com/hotlink-ok/logo-social.png" />
          </Grid>
          <Paper style={{minWidth: 350}}>
            <Typography variant="h6" align="center">Profile</Typography>
            {
              (this.state.currentInput == 0) ?
              (
                <FormControl fullWidth>
                    <InputLabel>Select your education level</InputLabel>
                    <Select
                      value={this.state.education}
                      onChange={(event) => {this.setState({ education: event.target.value })}}
                      variant="outlined"
                      autoWidth
                    >
                      <MenuItem value={0}>Polytechnic</MenuItem>
                      <MenuItem value={1}>Junior College</MenuItem>
                    </Select>
                </FormControl>
              ) :
              (this.state.currentInput == 1 && this.state.education == 0) ?
              (
                <TextField
                  label="Enter your GPA"
                  variant="outlined"
                  type="number"
                  min="0.1"
                  value={this.state.gpa}
                  onChange={(event) => {this.setState({ gpa: event.target.value })}}
                  fullWidth
                  />
              ) :
              (this.state.currentInput == 1 && this.state.education == 1) ?
              (
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  style={{ maxWidth: 500 }}
                  >
                  <Grid item xs={3}>
                    <TextField
                      label="H2"
                      variant="outlined"
                      type="number"
                      value={this.state.alevel.h2_1}
                      onChange={(event) => {this.setState({ alevel: {...this.state.alevel, h2_1: event.target.value} })}}
                      fullWidth
                      />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="H2"
                      variant="outlined"
                      type="number"
                      value={this.state.alevel.h2_2}
                      onChange={(event) => {this.setState({ alevel: {...this.state.alevel, h2_2: event.target.value} })}}
                      fullWidth
                      />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="H2"
                      variant="outlined"
                      type="number"
                      value={this.state.alevel.h2_3}
                      onChange={(event) => {this.setState({ alevel: {...this.state.alevel, h2_3: event.target.value} })}}
                      fullWidth
                      />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      label="H1"
                      variant="outlined"
                      type="number"
                      value={this.state.alevel.h1}
                      onChange={(event) => {this.setState({ alevel: {...this.state.alevel, h1: event.target.value} })}}
                      fullWidth
                      />
                  </Grid>
                </Grid>
              ) :
              (this.state.currentInput == 2) ?
              (
                <FormControl fullWidth>
                    <InputLabel>Select your interests</InputLabel>
                    <Select
                      value={this.state.interestsSelected}
                      onChange={(event) => { this.setState({interestsSelected: event.target.value}) }}
                      input={<Input />}
                      renderValue={(selected) => {
                        let results = [];
                        for(let i = 0; i < this.state.interests.length; i++){
                          if(selected.indexOf(this.state.interests[i].value) > -1){
                            results.push(this.state.interests[i].name);
                          }
                        }
                        return results.join(", ");
                      }}
                      variant="outlined"
                      autoWidth
                      multiple
                      displayEmpty
                    >
                      {this.state.interests.map((el) => (
                        <MenuItem key={el.name} value={el.value}>
                          <Checkbox checked={this.state.interestsSelected.indexOf(el.value) > -1} />
                          <ListItemText primary={el.name} />
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              )  :
              <Box />
            }


            <Button
              type="button"
              fullWidth
              color="primary"
              variant="contained"
              onClick={this.onNextSelected}
              >
              {(this.state.currentInput == 2) ? "Find universities" : "Next"}
              </Button>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}
