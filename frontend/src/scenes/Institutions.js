import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';

import { getAllUniversity, getAllInterest, getAllCourses } from '../api/API.js'

import FilterDisplay from '../components/FilterDisplay';
import FilterDropdownDisplay from '../components/FilterDropdownDisplay';
import CourseDisplay from '../components/CourseDisplay';
import CourseSort from '../components/CourseSort';
import SearchBar from '../components/SearchBar';
import ConfirmationDialog from '../components/ConfirmationDialog.js';

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
};

class Institutions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      university: [],
      interest: [],
      course: [],

      originalCourse: [],

      isResetConfigureOpen: false,
      isOverwriteConfigureOpen: false
    }
  }

  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/');
      return;
    }

    // grab university list
    const uniPromise = getAllUniversity();
    uniPromise
      .then(res => res.json())
      .then((data) => {
        // add isChecked attribute to each row
        data.forEach(row => row.isChecked = true);
        this.setState({
          university: data,
        })
      })
      .catch(console.log)

    // grab interest list
    const interestPromise = getAllInterest();
    interestPromise
      .then(res => res.json())
      .then((data) => {
        data.forEach(row => row.isSelected = true);

        this.setState({
          interest: data
        })

        // integrate profile's interest
        this.integrateProfileInterest();
      })
      .catch(console.log)

    // grab course list
    const coursePromise = getAllCourses();
    coursePromise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          course: courseFilter(data, this.state.university, this.state.interest),
          originalCourse: data
        })

      })
      .catch(console.log)
  }

  integrateProfileInterest() {
    let profileInterest = this.props.location.state.interests;
    console.log(this.props.location.state);
  }

  filterUniversity(universityId) {
    // set filter
    let university = [...this.state.university];
    let index = university.findIndex(uni => uni.Id === universityId);
    let selectedUni = { ...university[index] };

    selectedUni.isChecked = !selectedUni.isChecked;
    university[index] = selectedUni;

    this.setState({ university });
  }

  addToInterestList(interestId) {
    if (interestId === "" || interestId === "None") return;
    let isExist = this.state.interest.some(inter => inter.Id === interestId);
    if (!isExist) {
      return;
    }

    // remove from dropdown list
    let copiedInterest = [...this.state.interest];
    let index = copiedInterest.findIndex(inter => inter.Id === interestId);
    let selectedInterest = { ...copiedInterest[index] };

    selectedInterest.isSelected = true;
    copiedInterest[index] = selectedInterest;
    this.setState({ interest: copiedInterest });
  }

  removeFromInterestList(interestId) {
    // add back to dropdown list
    let copiedInterest = [...this.state.interest];
    let index = copiedInterest.findIndex(inter => inter.Id === interestId);
    let selectedInterest = { ...copiedInterest[index] };

    selectedInterest.isSelected = false;
    copiedInterest[index] = selectedInterest;
    this.setState({ interest: copiedInterest });
  }

  sortCourse(sortId, isAscending) {
    const sortedCourses = CourseSort.sortBySortId(sortId, this.state.course, isAscending);
    this.setState({ course: sortedCourses });
  }

  onClickSearch(value) {
    let copiedCourseList = [...this.state.originalCourse];
    let filteredCourseList = copiedCourseList.filter(course =>
      course.Programme.toLowerCase().includes(value.toLowerCase()));
    this.setState({
      course: filteredCourseList
    })
  }

  clearAllFilter() {
    let copiedInterest = [...this.state.interest];
    copiedInterest.forEach(interest => interest.isSelected = true);

    let copiedUniversity = [...this.state.university];
    copiedUniversity.forEach(uni => uni.isChecked = true);

    this.setState({
      interest: copiedInterest,
      unviersity: copiedUniversity,
      course: this.state.originalCourse
    })
  }

  loadInitialConfiguration() {
    this.setState({isResetConfigureOpen: false});

  }

  saveCurrentConfiguration() {
    this.setState({isOverwriteConfigureOpen: false});
  }

  configureButtons() {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} direction="row" justify="center" alignItems="center">
          <Typography variant="h4" style={{ textAlign: "center" }}><SettingsTwoToneIcon /> Settings</Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider style={{ margin: '10px' }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Button variant="outlined" color="secondary" 
                onClick={() => this.setState({isResetConfigureOpen: true})}>
                Reset to Initial Configuration
              </Button>
              <ConfirmationDialog
                title={"Confirmation"}
                message="This will RESET all your filters and grades to the initial configuration you submitted during the profile setup or the previous saved configuration, whichever is nearer. Are you sure you want to reset?"
                isOpen={this.state.isResetConfigureOpen}
                handleOpen={(isOpen) => this.setState({isResetConfigureOpen: isOpen})} 
                onClickAgree={this.loadInitialConfiguration.bind(this)} />

            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" color="primary"
                onClick={() => this.setState({isOverwriteConfigureOpen: true})}>
                Save Current Configuration
              </Button>
              <ConfirmationDialog
                title={"Confirmation"}
                message="This will OVERWRITE all your filters and grades in your inital configuration you submitted during the profile setup or your previous saved configuration, whichever is nearer. Are you sure you want to overwrite?"
                isOpen={this.state.isOverwriteConfigureOpen}
                handleOpen={(isOpen) => this.setState({isOverwriteConfigureOpen: isOpen})} 
                onClickAgree={this.saveCurrentConfiguration.bind(this)} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    let filteredCourse = courseFilter(this.state.course, this.state.university, this.state.interest);

    return (
      <Container maxWidth="xl" style={{ marginTop: '30px' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>

            {/** Save current configuration, Reset to initial configuration */}
            <Paper style={{ padding: '10px' }}>
              {this.configureButtons()}
            </Paper>

            <br />

            {/* Filter University */}
            <Paper style={{ padding: '10px', textAlign: "flex-start" }}>
              <Typography variant="h4" style={{ textAlign: "center" }}>
                <SchoolTwoToneIcon /> Universities
              </Typography>

              <Divider style={{ margin: '10px' }} />

              <FilterDisplay data={this.state.university} onClick={this.filterUniversity.bind(this)} />
            </Paper>

            <br />

            {/* Filter Interests */}
            <Paper style={{ padding: '10px' }}>
              <Typography variant="h4" style={{ textAlign: "center" }}>
                <FavoriteTwoToneIcon /> Interests
              </Typography>

              <Divider style={{ margin: '10px' }} />

              <FilterDropdownDisplay
                interest={this.state.interest}
                onSelect={this.addToInterestList.bind(this)}
                onDelete={this.removeFromInterestList.bind(this)} />
            </Paper>

          </Grid>


          {/* Display Courses */}
          <Grid item xs={9}>
            <Paper>
              <Grid container direction="row" justify="center" alignItems="center" style={{ padding: '10px' }}>
                <Grid item xs={2} style={{ textAlign: 'center' }}>
                  <Typography variant="h4">
                    <MenuBookTwoToneIcon /> Courses
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <Button variant="contained" onClick={this.clearAllFilter.bind(this)}>
                      Clear All Filters
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <Grid container direction="row" justify="flex-end" alignItems="center">
                    <SearchBar onClick={this.onClickSearch.bind(this)} courseList={this.state.originalCourse} />
                  </Grid>
                </Grid>
              </Grid>

              <Divider />

              <Container style={{ padding: '10px' }}>
                <CourseDisplay data={filteredCourse} sortCourse={this.sortCourse.bind(this)} {...this.props} />
              </Container>
            </Paper>
          </Grid>



        </Grid>
      </Container>
    )


  }
}

Institutions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Institutions);

// ==========================================================

function courseFilter(courseArr, uniArr, interestList) {
  let filteredCourseByUni = filterCourse(courseArr, uniArr);
  let filteredCourseByInterest = filterInterest(filteredCourseByUni, interestList);

  return filteredCourseByInterest;
}

function filterCourse(courseArr, uniArr) {
  let uniMap = new Map();
  uniArr
    .filter(uni => uni.isChecked)
    .forEach(uni => uniMap.set(uni.Name, uni.isChecked));

  const filteredCourse = courseArr.filter(course => uniMap.has(course.University));

  return filteredCourse;
}

function filterInterest(courseArr, interestList) {
  let interestMap = new Map();
  interestList
    .filter(inter => inter.isSelected)
    .forEach(inter => interestMap.set(inter.Name, inter.isSelected));

  const filteredCourse = courseArr.filter(course => {
    let courseCategory = course.Category;
    let found = courseCategory.some(inter => interestMap.has(inter));
    return found;
  });

  return filteredCourse;
}
