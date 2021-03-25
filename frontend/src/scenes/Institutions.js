import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/styles';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

import {getAllUniversity, getAllInterest, getAllCourses} from '../api/API.js'

import FilterDisplay from '../components/FilterDisplay';
import FilterDropdownDisplay from '../components/FilterDropdownDisplay';
import CourseDisplay from '../components/CourseDisplay';
import CourseSort from '../components/CourseSort';

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
      interestList: []
    }
  }

  componentDidMount() {
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
          interest: data,
          interestList: data
        })
      })
      .catch(console.log)

    // grab course list
    const coursePromise = getAllCourses();
    coursePromise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          course: courseFilter(data, this.state.university, this.state.interestList),
          originalCourse: data
        })

      })
      .catch(console.log)
  }

  filterUniversity(universityId) {
    // set filter
    let university = [...this.state.university];
    let index = university.findIndex(uni => uni.Id === universityId);
    let selectedUni = {...university[index]};

    selectedUni.isChecked = !selectedUni.isChecked;
    university[index] = selectedUni;

    this.setState({university});

    // filter course
    this.setState({course: []});
    let course = [...this.state.originalCourse];
    let filteredCourse = courseFilter(course, university, this.state.interestList)
    this.setState({course: filteredCourse});
  }

  addToInterestList(interestId) {
    if (interestId === "" || interestId === "None") return ;
    let isExist = this.state.interestList.some(inter => inter.Id === interestId);
    if (isExist) {
      return ;
    }

    // remove from dropdown list
    let copiedInterest = [...this.state.interest];
    let index = copiedInterest.findIndex(inter => inter.Id === interestId);
    let selectedInterest = {...copiedInterest[index]};

    selectedInterest.isSelected = true;
    copiedInterest[index] = selectedInterest;
    this.setState({interest: copiedInterest});

    // add to interest list
    let copiedList = [...this.state.interestList];
    copiedList.push(selectedInterest);
    this.setState({interestList: copiedList});

    // filter course
    this.setState({course: []});
    let course = [...this.state.originalCourse];
    let filteredCourse = courseFilter(course, this.state.university, copiedList)
    this.setState({course: filteredCourse});
  }

  removeFromInterestList(interestId) {
    // remove from interestlist
    let copiedInterestList = [...this.state.interestList];
    let updatedInterestList = copiedInterestList.filter(inter => inter.Id !== interestId);
    this.setState({interestList: updatedInterestList});

    // add back to dropdown
    let copiedInterest = [...this.state.interest];
    let index = copiedInterest.findIndex(inter => inter.Id === interestId);
    let selectedInterest = {...copiedInterest[index]};

    selectedInterest.isSelected = false;
    copiedInterest[index] = selectedInterest;
    this.setState({interest: copiedInterest});

    // filter course
    this.setState({course: []});
    let course = [...this.state.originalCourse];
    let filteredCourse = courseFilter(course, this.state.university, updatedInterestList)
    this.setState({course: filteredCourse});
  }

  sortCourse(sortId, isAscending) {
    const sortedCourses = CourseSort.sortBySortId(sortId, this.state.course, isAscending);
    this.setState({course: sortedCourses});
  }

  render () {
    return (
      <Container maxWidth="xl">
        <Grid container spacing={2}>


          <Grid item xs={3}>

            {/* Filter University */}
            <Paper style={{padding: '10px', textAlign: "flex-start"}}>
              <Typography variant="h4" style={{textAlign: "center"}}>
                <SchoolTwoToneIcon /> Universities
              </Typography>
              <FilterDisplay data={this.state.university} onClick={this.filterUniversity.bind(this)} />
            </Paper>

            <br />

            {/* Filter Interests */}
            <Paper style={{padding: '10px'}}>
              <Typography variant="h4" style={{textAlign: "center"}}>
                <FavoriteTwoToneIcon/> Interests
              </Typography>
              <FilterDropdownDisplay
                data={this.state.interest}
                interestList={this.state.interestList}
                onSelect={this.addToInterestList.bind(this)}
                onDelete={this.removeFromInterestList.bind(this)} />
            </Paper>

          </Grid>


          {/* Display Courses */}
          <Grid item xs={9}>
            <Paper>
              <Typography variant="h4" style={{textAlign: "center"}}>
                <MenuBookTwoToneIcon /> Courses
              </Typography>
              <CourseDisplay data={this.state.course} sortCourse={this.sortCourse.bind(this)} {...this.props}/>
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
