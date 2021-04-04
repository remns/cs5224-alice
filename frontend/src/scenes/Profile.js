import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import React, { Component } from 'react';
import { getAllInterest } from '../api/API.js';
import ALevelInput from '../components/ALevelInput';
import EducationInput from '../components/EducationInput';
import GPAInput from '../components/GPAInput';
import InterestsInput from '../components/InterestsInput';

import configuration from '../components/configuration.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      interests: [],
      interestsSelected: [],
      currentInput: 0,
      gpa: '',
      education: 0,
      alevel: {
        h2_1: '',
        h2_2: '',
        h2_3: '',
        h1: '',
        pw: '',
        gp: '',
        mtl: ''
      }
    };

  }

  componentDidMount(){
    this.retriveInterest();
  }

  retriveInterest = () => {
    const promise = getAllInterest();
    promise
      .then(res => res.json())
      .then((data) => {
        data.map((e, index) => e.value = index);
        this.setState({
          interests: data,
        })
      })
      .catch(console.log)
  }

  onNextSelected = () => {
    if(this.state.currentInput == 2){

      let interestsId = [];
      for(let i = 0; i < this.state.interestsSelected.length; i++){
        let interest = this.state.interests.find((el, index) => index == this.state.interestsSelected[i]);
        interestsId.push(interest.Id);
      }

      let result = {
        education: this.state.education,
        gpa: this.state.gpa,
        alevel: this.state.alevel,
        interests: interestsId
      };

      configuration.setConfiguration(undefined, interestsId, undefined, this.state.alevel, this.state.education, this.state.gpa);

      this.props.history.push('/institutions', result);
    }
    this.setState({ currentInput: this.state.currentInput + 1});
  }

  onBackSelected = () => {
    if(this.state.currentInput == 0){
      return;
    }

    this.setState({ currentInput: this.state.currentInput - 1});
  }

  canGoNext = () => { // Validate the input and enable/disable button accordingly
    switch(this.state.currentInput){
      case 0:
        return this.state.education != undefined;
        break;
      case 1:
        if(this.state.education == 0){
          return this.state.gpa.length > 0 && parseFloat(this.state.gpa) <= 4;
        }
        else if(this.state.education == 1){
          for(let key in this.state.alevel){
            if(this.state.alevel[key].length == 0){
              return false;
            }
          }
          return true;
        }
        break;
      case 2:
        return this.state.interestsSelected.length != 0;
        break;
      default:
        return false;
        break;
    }
  }

  onEducationInput = (education) => {
    this.setState({ education: education });
  }

  onGPAInput = (gpa) => {
    this.setState({ gpa: gpa });
  }

  onALevelInput = (alevel) => {
    this.setState({ alevel: alevel });
  }

  onInterestInput = (interests) => {
    this.setState({ interestsSelected: interests });
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
          <Grid container justify="center" alignItems="center" style={{marginBottom: 20}}>
            <img style={{width: 100}} src="/images/alice.png" />
          </Grid>
          <Paper style={{minWidth: 350, padding: 10}}>
            {
              (this.state.currentInput != 0) &&
              <IconButton
                style={{marginTop: 10, marginBottom: 10}}
                onClick={this.onBackSelected}
              >
                <ArrowBackIcon />
              </IconButton>
            }
            {
              (this.state.currentInput == 0) ?
              (
                <EducationInput onChange={this.onEducationInput} value={this.state.education} />
              ) :
              (this.state.currentInput == 1 && this.state.education == 0) ?
              (
                <GPAInput onChange={this.onGPAInput} value={this.state.gpa} />
              ) :
              (this.state.currentInput == 1 && this.state.education == 1) ?
              (
                <ALevelInput onChange={this.onALevelInput} />
              ) :
              (this.state.currentInput == 2) ?
              (
                <InterestsInput onChange={this.onInterestInput} value={this.state.interestsSelected} />
              )  :
              <Box />
            }

            <Button
              type="button"
              fullWidth
              color="primary"
              variant="contained"
              onClick={this.onNextSelected}
              disabled={!this.canGoNext()}
              style={{marginTop: 20}}
              >
              {(this.state.currentInput == 2) ? "Find universities" : "Next"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}
