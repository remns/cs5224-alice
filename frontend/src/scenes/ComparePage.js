import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import React, { Component } from 'react';
import { getAllCourses, getAllUniversity } from '../api/API.js';
import Loading from '../components/Loading';

function CompareInput(props) {
  let filteredCourse = [];
  if (props.selectedUni !== '') {
    filteredCourse = props.course.filter(course => course.University === props.selectedUni);
  }

  return (
    <Box width="100%">
      <TextField
        select
        label="Select University"
        value={props.selectedUni}
        onChange={(event) => props.handleChange(props.uniAtr, event.target.value)}
        helperText="Please select the university."
        fullWidth={true}
        variant="outlined"
      >
        <MenuItem key={0} value={''}>
          None
        </MenuItem>
        {
          props.university.map((uni, index) => (
            <MenuItem key={index + 1} value={uni.Name}>
              {uni.Name}
            </MenuItem>
          ))
        }
      </TextField>

      {
        props.selectedUni !== '' &&
        <TextField
          select
          label="Select Course"
          value={props.selectedCourse}
          onChange={(event) => props.handleChange(props.courseAtr, event.target.value)}
          helperText="Please select the course."
          fullWidth={true}
          variant="outlined"
          style={{ marginTop: '30px' }}
        >
          <MenuItem key={0} value={''}>
            None
          </MenuItem>
          {
            filteredCourse.map((course, index) => (
              <MenuItem key={index + 1} value={course.Id}>
                {course.Programme}
              </MenuItem>
            ))
          }
        </TextField>
      }
    </Box>
  );
}

class ComparePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareCourses: [],
      uni1: '',
      uni2: '',

      course1: '',
      course2: '',

      university: [],
      course: [],
    }
  }

  componentDidMount() {
    // grab university list
    const uniPromise = getAllUniversity();
    uniPromise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          university: data,
        })
      })
      .catch(console.log);

    // grab course list
    const coursePromise = getAllCourses();
    coursePromise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          course: data
        })

      })
      .catch(console.log)
  }

  handleChange(attribute, newValue) {
    this.setState({
      [attribute]: newValue
    })

    if (attribute === 'uni1') {
      this.setState({
        'course1': ''
      })
    }

    if (attribute === 'uni2') {
      this.setState({
        'course2': ''
      })
    }
  }

  handleClick() {
    let course1 = this.state.course.find(cou => cou.Id === this.state.course1);
    let course2 = this.state.course.find(cou => cou.Id === this.state.course2);

    let compareList = [course1, course2];
    let states = {
      compareList: compareList,
      university: this.state.university,
      course: this.state.course
    }

    this.props.history.push('/compare/result', states);
  }

  render() {
    if (!this.state.university || this.state.university.length === 0) {
      return <Loading />;
    }

    if (!this.state.course || this.state.course.length === 0) {
      return <Loading />;
    }

    return (
      <div>
        <Grid xs={12} container direction="row" justify="center" alignItems="center" style={{ minHeight: '70vh' }}>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h3">Course Comparison</Typography>
              </Grid>

              <br />

              <Grid container direction="row" justify="center" alignItems="center">

                <Grid xs={5} item direction="row" justify="center" alignItems="center">
                  <CompareInput selectedUni={this.state.uni1} selectedCourse={this.state.course1} university={this.state.university} course={this.state.course} handleChange={this.handleChange.bind(this)} uniAtr={"uni1"} courseAtr={"course1"} />
                </Grid>
                <Grid xs={2} item>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <Typography variant="h5"> VS </Typography>
                  </Grid>
                </Grid>
                <Grid xs={5} item direction="row" justify="center" alignItems="center">
                  <CompareInput selectedUni={this.state.uni2} selectedCourse={this.state.course2} university={this.state.university} course={this.state.course} handleChange={this.handleChange.bind(this)} uniAtr={"uni2"} courseAtr={"course2"} />
                </Grid>


                <Grid>
                  <Button variant="contained" color="primary" onClick={this.handleClick.bind(this)}
                    disabled={(this.state.uni1 === '' || this.state.uni2 === '' ||
                      this.state.course1 === '' || this.state.course2 === '' || this.state.course1 === this.state.course2)}>
                    Compare
                  </Button>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>


      </div>
    );
  }
}

export default ComparePage;