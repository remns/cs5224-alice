import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import React from 'react';
import DataExtractor from '../components/DataExtractor';
import UniversityLogo from '../components/UniversityLogo';


const styles = {
  rowItem: {
    paddingTop: '5px',
    paddingBottom: '5px',
    minHeight: '100%'
  }
}

function getBestSignature() {
  return (
    <div>
      <Box>
        <Badge badgeContent={'Best'} color="secondary"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></Badge>
      </Box>
    </div>
  );
}

function getEmptyField() {
  return (
    <Grid item xs component={Box} borderRight={1}>
      <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
        -
      </Grid>
    </Grid>
  );
}

function getCompareTableOperator(compareList, removeCourse) {
  return (
    <Grid container direction="row">
      <Grid item xs={2}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography>
            <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
              Indicators
            </Box>
          </Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          return (
            <Grid item xs key={index}>
              <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
                <Button variant="outlined" color="secondary" onClick={() => removeCourse(course.Id)}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareTableCourse(compareList) {
  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography>
            Course
          </Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
                <Typography align="center" display="inline">{course.Programme}</Typography>
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareUniversity(compareList) {
  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography>University</Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          let imageURL = UniversityLogo.getUniversityLogoLink(course.University);
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
                <img src={imageURL} alt="school logo" style={{ padding: '10px', maxWidth: "35%", maxHeight: '25%' }} />
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareSalary(compareList) {
  let maxCourse = compareList.filter(course => DataExtractor.getMedianSalary(course) !== null)
                      .reduce((prev, curr) => 
                        (DataExtractor.getMedianSalary(prev) < DataExtractor.getMedianSalary(curr))
                        ? curr
                        : prev);
  let maxSalary = DataExtractor.getMedianSalary(maxCourse);
  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography align="center" display="inline">Median Salary ($)</Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          let medSalary = DataExtractor.getMedianSalary(course);
          let year = DataExtractor.getGESYear(course);

          if (!medSalary) {
            return getEmptyField();
          }
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="row" justify="center" alignItems="center" style={styles.rowItem}>
                <Grid container direction="row" justify="center" alignItems="center" style={styles.rowItem}>
                  <Typography align="center" display="inline">$ {medSalary}</Typography>
                  {
                    medSalary === maxSalary &&
                    getBestSignature()
                  }
                </Grid>
                <Typography align="center" display="inline"><Box fontSize={13}>Year: {year}</Box></Typography>
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareCost(compareList) {
  let minCourse = compareList.filter(course => DataExtractor.getAnnualCost(course) !== null)
                      .reduce((prev, curr) => 
                        (DataExtractor.getAnnualCost(prev) > DataExtractor.getAnnualCost(curr))
                        ? curr
                        : prev);
  let minCost = DataExtractor.getAnnualCost(minCourse);
  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography align="center" display="inline">Fee (Citizen) ($)</Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          let annualCost = DataExtractor.getAnnualCost(course);
          if (!annualCost) {
            return getEmptyField();
          }
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="row" justify="center" alignItems="center" style={styles.rowItem}>
                <Typography align="center" display="inline">$ {annualCost} / year</Typography>
                {
                  annualCost === minCost &&
                  getBestSignature()
                }
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareROI(compareList) {
  let maxCourse = compareList.filter(course => DataExtractor.getROI(course) !== null)
                      .reduce((prev, curr) => 
                        (DataExtractor.getROI(prev) < DataExtractor.getROI(curr))
                        ? curr
                        : prev);
  let maxROI = DataExtractor.getROI(maxCourse);

  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography align="center" display="inline">Return of Investment ($)</Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          if (!course.ROI) {
            return getEmptyField();
          }
          let ROI = (course.ROI) ? (parseFloat(course.ROI).toFixed(2) * 100) + " %" : '-';
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="row" justify="center" alignItems="center" style={styles.rowItem}>
                <Typography align="center" display="inline">{ROI}</Typography>
                {
                  course.ROI === maxROI &&
                  getBestSignature()
                }
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

function getCompareEmployment(compareList) {
  let maxCourse = compareList.filter(course => DataExtractor.getEmploymentRate(course) !== null)
                      .reduce((prev, curr) => 
                        (DataExtractor.getEmploymentRate(prev) < DataExtractor.getEmploymentRate(curr))
                        ? curr
                        : prev);
  let maxEmploymentRate = DataExtractor.getEmploymentRate(maxCourse);
  return (
    <Grid container direction="row">
      <Grid item xs={2} component={Box} borderRight={1}>
        <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
          <Typography align="center" display="inline">Employment Rate (%)</Typography>
        </Grid>
      </Grid>
      {
        compareList.map((course, index) => {
          let employmentRate = DataExtractor.getEmploymentRate(course);
          let year = DataExtractor.getGESYear(course);

          if (!employmentRate) {
            return getEmptyField();
          }
          return (
            <Grid item xs key={index} component={Box} borderRight={1}>
              <Grid container direction="column" justify="center" alignItems="center" style={styles.rowItem}>
                <Grid container direction="row" justify="center" alignItems="center" style={styles.rowItem}>
                  <Typography align="center" display="inline">{employmentRate * 100} %</Typography>
                  {
                    employmentRate === maxEmploymentRate &&
                    getBestSignature()
                  }
                </Grid>
                <Typography align="center" display="inline"><Box fontSize={13}>Year: {year}</Box></Typography>
              </Grid>
            </Grid>
          );
        })
      }
    </Grid>
  );
}

const CompareTable = ({ compareList, removeCourse }) => {
  if (compareList.length <= 1) {
    return (
      <Grid container direction="column" justify='center' alignItems='center'>
        <Typography>There must be at least 2 courses to compare!</Typography>
        <Typography>Current Selected Courses:</Typography>
        <Typography>{compareList.map(course => course.Programme)}</Typography>
      </Grid>
    );
  }
  return (
    <div style={{ margin: '15px'}}>
      {getCompareTableOperator(compareList, removeCourse)}
      <Divider />
      {getCompareTableCourse(compareList)}
      <Divider />
      {getCompareUniversity(compareList)}
      <Divider />
      {getCompareSalary(compareList)}
      <Divider />
      {getCompareCost(compareList)}
      <Divider />
      {getCompareROI(compareList)}
      <Divider />
      {getCompareEmployment(compareList)}
      <Divider />
    </div>
  );
};

export default CompareTable;