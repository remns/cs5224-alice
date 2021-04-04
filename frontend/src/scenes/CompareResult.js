import { Collapse, Paper, Typography } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { Component, useState } from 'react';
import CompareTable from '../components/CompareTable';
import Loading from '../components/Loading';


function InputCourseForm({ university, course, addCourse}) {
  const [newUni, setNewUni] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [isShow, setIsShow] = useState(true);

  const handleUniChange = (event) => setNewUni(event.target.value);
  const handleCourseChange = (event) => setNewCourse(event.target.value);
  const handleClick = () => {
    addCourse(newCourse);
    setNewCourse('')
    setNewUni('')
  };
  const handleShow = () => {
    setIsShow(!isShow);
  }

  let filteredCourse = [];
  if (newUni !== '') {
    filteredCourse = course.filter(course => course.University === newUni);
  }

  return (
    <Grid container>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={11}>
              <Typography variant="h6">
                Add more courses for comparison
            </Typography>
            </Grid>
            <Grid item xs={1}>
              <Grid container direction="row" justify="center" alignItems="flex-start">
                <Switch
                  checked={isShow}
                  onChange={handleShow}
                  color="primary"
                />
              </Grid>
            </Grid>
          </Grid>

          <Collapse in={isShow}>
            <br />

            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
              <Grid item xs={5}>
                <TextField
                  select
                  label="Select University"
                  value={newUni}
                  onChange={handleUniChange}
                  helperText="Please select the university."
                  variant="outlined"
                  fullWidth={true}
                >
                  <MenuItem key={0} value={''}>
                    None
                </MenuItem>
                  {
                    university.map((uni, index) => (
                      <MenuItem key={index + 1} value={uni.Name}>
                        {uni.Name}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </Grid>

              <Grid item xs={5}>
                {
                  newUni !== '' &&
                  <TextField
                    select
                    label="Select Course"
                    value={newCourse}
                    onChange={handleCourseChange}
                    helperText="Please select the course."
                    variant="outlined"
                    fullWidth={true}
                    disabled={newUni === ''}
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
              </Grid>
              <Grid item xs={2}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Fab color="primary" onClick={handleClick} disabled={newCourse === ''}>
                    <AddIcon />
                  </Fab>
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
}

class CompareResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compareList: [],
      university: [],
      course: [],

      newUni: '',
      newCourse: ''
    }
  }

  componentDidMount() {
    if (!this.props.history.location.state) {
      this.props.history.push("/compare");
      return;
    }

    this.setState({
      compareList: this.props.history.location.state.compareList,
      university: this.props.history.location.state.university,
      course: this.props.history.location.state.course,
    })
  }

  removeCourse(courseId) {
    let copiedCompareLst = [...this.state.compareList];
    let filteredCompareList = copiedCompareLst.filter(course => course.Id !== courseId);
    this.setState((prevState) => {
      return {
        ...prevState,
        compareList: filteredCompareList
      }
    })
  }

  addCourse(courseId) {
    let courseObj = this.state.course.find(course => course.Id === courseId);
    let copiedCompareLst = [...this.state.compareList];
    if (copiedCompareLst.findIndex(course => course.Id === courseId) !== -1) {
      return;
    }

    copiedCompareLst.push(courseObj);
    this.setState((prevState) => {
      return {
        ...prevState,
        compareList: copiedCompareLst
      }
    })
  }

  render() {
    if (this.state.university.length === 0) {
      return <Loading />
    }
    return (
      <div style={{ marginTop: '30px' }}>
        <InputCourseForm university={this.state.university} course={this.state.course} addCourse={this.addCourse.bind(this)} />

        <br />

        {
          this.state.compareList.length > 0 &&
          <CompareTable compareList={this.state.compareList} removeCourse={this.removeCourse.bind(this)} />
        }
      </div>
    );
  }
}

export default CompareResult;