import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import GradeTwoToneIcon from '@material-ui/icons/GradeTwoTone';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import { withStyles } from '@material-ui/styles';
import React, { Component } from 'react';
import { getAllCourses, getAllCourseWithProfile, getAllInterest, getAllUniversity } from '../api/API.js';
import ALevelInput from '../components/ALevelInput.js';
import ConfirmationDialog from '../components/ConfirmationDialog.js';
import ProfileDialog from '../components/ProfileDialog.js';
import CourseDisplay from '../components/CourseDisplay';
import CourseSort from '../components/CourseSort';
import EducationInput from '../components/EducationInput.js';
import FilterDisplay from '../components/FilterDisplay';
import FilterDropdownDisplay from '../components/FilterDropdownDisplay';
import GPAInput from '../components/GPAInput.js';
import SearchBar from '../components/SearchBar';

import configuration from '../components/configuration.js';

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
      searchWord: '',

      isResetConfigureOpen: false,
      isOverwriteConfigureOpen: false,
      isProfileDialogOpen: false,

      alevel: {
        gp: '',
        h1: '',
        h2_1: '',
        h2_2: '',
        h2_3: '',
        mtl: '',
        pw: ''
      },
      education: '',
      gpa: '',
    }
  }

  componentDidMount() {
    if (!configuration.exists()) {
      this.props.history.push('/');
      return;
    }

    let config = configuration.getConfiguration();
    // grab university list
    const uniPromise = getAllUniversity();
    uniPromise
      .then(res => res.json())
      .then((data) => {
        // add isChecked attribute to each row
        data.forEach(row => row.isChecked = config.university.includes(row.Id));
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
        data.forEach(row => row.isSelected = config.interest.includes(row.Id));
        this.setState({
          interest: data
        })
      })
      .catch(console.log)

    // grab course list
    let currentProfile = configuration.getConfiguration();
    this.getUpdatedCourseList(currentProfile);
  }

  getUpdatedCourseList(profile) {
    const coursePromise = getAllCourseWithProfile(profile);
    coursePromise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          course: data
        })
      })
      .catch(console.log)
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
    this.setState({ searchWord: value });
  }

  clearAllFilter() {
    let copiedInterest = [...this.state.interest];
    copiedInterest.forEach(interest => interest.isSelected = true);

    let copiedUniversity = [...this.state.university];
    copiedUniversity.forEach(uni => uni.isChecked = true);

    this.setState({
      interest: copiedInterest,
      unviersity: copiedUniversity,
      searchWord: ''
    })
  }

  loadInitialConfiguration() {
    this.setState({ isResetConfigureOpen: false });
    // update grades
    let currentProfile = configuration.getConfiguration();
    this.getUpdatedCourseList(currentProfile);

    // update uni filter
    let uniFilter = currentProfile.university;
    let copiedUni = [...this.state.university];
    copiedUni.forEach(uni => (uniFilter.includes(uni.Id)) ? uni.isChecked = true : uni.isChecked = false);

    // update interest filter
    let interestFilter = currentProfile.interest;
    let copiedInterest = [...this.state.interest];
    copiedInterest.forEach(inter => (interestFilter.includes(inter.Id)) ? inter.isSelected = true : inter.isSelected = false);

    this.setState({
      university: copiedUni,
      interest: copiedInterest
    })
  }

  saveCurrentConfiguration() {
    this.setState({ isOverwriteConfigureOpen: false });

    // format uni arr
    let copiedUniArr = [...this.state.university];
    let uniArr = copiedUniArr
      .filter(uni => uni.isChecked === true)
      .map(uni => uni.Id);

    // format interest arr
    let copiedInterestArr = [...this.state.interest];
    let interestArr = copiedInterestArr
      .filter(inter => inter.isSelected === true)
      .map(inter => inter.Id);

    // store current configuration
    let data = [
      uniArr,
      interestArr
    ]

    configuration.setFilterConfiguration(...data);
  }

  emptyGradeFields() {
    this.setState({
      education: '',
      alevel: {
        gp: '',
        h1: '',
        h2_1: '',
        h2_2: '',
        h2_3: '',
        mtl: '',
        pw: ''
      },
      gpa: ''
    })
  }

  sendRequest() {
    configuration.setGradeConfiguration(this.state.education, this.state.gpa, this.state.alevel);
    this.getUpdatedCourseList(configuration.getConfiguration());
    this.emptyGradeFields();
  }

  openProfileDialog() {
    this.setState({ isProfileDialogOpen: true });
  }

  isFormFilled() {
    if (this.state.education !== '') {
      if (this.state.education === 1) {
        for (let key in this.state.alevel) {
          if (this.state.alevel[key].length === 0) {
            return false;
          }
        }

        return true;
      }

      if (this.state.education === 0) {
        return this.state.gpa.length > 0 && parseFloat(this.state.gpa) <= 4
      }
    }

    return false;
  }

  configureButtons() {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4" style={{ textAlign: "center" }}><SettingsTwoToneIcon /> Settings</Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider style={{ margin: '10px' }} />
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={6}>
              <Button variant="outlined" color="secondary"
                onClick={() => this.setState({ isResetConfigureOpen: true })}>
                Load Initial Configuration
              </Button>
              <ConfirmationDialog
                title={"Confirmation"}
                message="This will LOAD all your filters and grades in your initial configuration you submitted during the profile setup or the previous saved configuration, whichever is nearer. Are you sure you want to reset?"
                isOpen={this.state.isResetConfigureOpen}
                handleOpen={(isOpen) => this.setState({ isResetConfigureOpen: isOpen })}
                onClickAgree={this.loadInitialConfiguration.bind(this)} />

            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" color="primary"
                onClick={() => this.setState({ isOverwriteConfigureOpen: true })}>
                Save Current Configuration
              </Button>
              <ConfirmationDialog
                title={"Confirmation"}
                message="This will OVERWRITE all your filters and grades in your inital configuration you submitted during the profile setup or your previous saved configuration, whichever is nearer. Are you sure you want to overwrite?"
                isOpen={this.state.isOverwriteConfigureOpen}
                handleOpen={(isOpen) => this.setState({ isOverwriteConfigureOpen: isOpen })}
                onClickAgree={this.saveCurrentConfiguration.bind(this)} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    let filteredCourse = courseFilter(this.state.course, this.state.university, this.state.interest, this.state.searchWord);
    let config = configuration.getConfiguration();
    let education = config.education;
    let gpa = config.gpa;
    let alevel = config.alevel;

    return (
      <Container maxWidth="xl" style={{ marginTop: '30px', marginBottom: '30px' }}>
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

            <br />

            {/**Resubmit grades Poly / JC */}
            <Paper style={{ padding: '10px' }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4" style={{ textAlign: "center" }}><GradeTwoToneIcon /> Grades</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider style={{ margin: '10px' }} />
                </Grid>

                <Grid item xs={12}>
                  <EducationInput value={this.state.education} onChange={(value) => {
                    this.emptyGradeFields();
                    this.setState({ education: value })
                  }} />
                </Grid>

                <Grid item xs={12} style={{ marginTop: '30px' }}>
                  {
                    this.state.education === 0 &&
                    <GPAInput value={this.state.gpa} onChange={(value) => this.setState({ gpa: value })} />
                  }
                  {
                    this.state.education === 1 &&
                    <ALevelInput onChange={(value) => this.setState({ alevel: value })} />
                  }
                </Grid>

                <Grid item xs={12} style={{ marginTop: '30px' }}>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <Button variant="outlined" color="secondary" onClick={this.openProfileDialog.bind(this)}>
                        View Existing Profile
                    </Button>
                    <ProfileDialog
                      title={"Profile"}
                      isOpen={this.state.isProfileDialogOpen}
                      handleOpen={(isOpen) => this.setState({ isProfileDialogOpen: isOpen })}
                      education={education}
                      gpa={gpa}
                      alevel={alevel}
                    />
                    </Grid>
                    <Grid item xs>
                      <Button variant="outlined" color="primary" onClick={this.sendRequest.bind(this)} disabled={!this.isFormFilled()}>
                        Update My Grades
                    </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                    <Button variant="contained" onClick={this.clearAllFilter.bind(this)} style={{ marginRight: '10px' }}>
                      Clear All Filters
                    </Button>
                    <Button variant="contained" onClick={() => this.onClickSearch('')}>
                      Clear Search
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <Grid container direction="row" justify="flex-end" alignItems="center">
                    <SearchBar onClick={this.onClickSearch.bind(this)} courseList={this.state.course} />
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

export default withStyles(styles)(Institutions);

// ==========================================================

function courseFilter(courseArr, uniArr, interestList, searchWord) {
  let copiedCourseArr = [...courseArr];
  if (!(searchWord === '')) {
    copiedCourseArr = filterSearch(copiedCourseArr, searchWord);
  }
  let filteredCourseByUni = filterCourse(copiedCourseArr, uniArr);
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

function filterSearch(courseArr, searchWord) {
  let filteredCourseList = courseArr.filter(course =>
    course.Programme.toLowerCase().includes(searchWord.toLowerCase()));

  return filteredCourseList;
}