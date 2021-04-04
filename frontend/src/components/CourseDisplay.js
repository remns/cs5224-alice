import Accordion from '@material-ui/core/Accordion';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import Rating from '@material-ui/lab/Rating';
import React from 'react';
import CourseSort from './CourseSort';
import DataExtractor from './DataExtractor';
import Loading from './Loading';
import RatingRubrics from './RatingRubrics';


function SortInput(props) {
  const [dropdownVal, setDropdownVal] = React.useState('');
  const [isChecked, setChecked] = React.useState(false);
  const handleChange = (event) => {
    setDropdownVal(event.target.value);
    props.sortCourse(event.target.value, false);
    setChecked(false);
  };

  const handleSwitchChange = (event, sortId) => {
    setChecked(event.target.checked);
    props.sortCourse(sortId, event.target.checked);
  };

  const sortMethods = CourseSort.sortLabels;

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={2}>
        <Grid container direction="row" justify="center" alignItems="center">
          <FormControlLabel
            control={
              <Switch
                disabled={(dropdownVal === '')}
                checked={isChecked}
                onChange={(event) => handleSwitchChange(event, dropdownVal)}
                color="primary"
              />
            }
            label={isChecked ? 'ASC' : 'DESC'}
          />
        </Grid>
      </Grid>

      <Grid item xs={10}>
        <Grid container direction="row" justify="center" alignItems="center">
          <TextField select label="Sort By" value={dropdownVal} onChange={handleChange} variant="outlined" fullWidth={true}>
            {
              sortMethods.map((method, index) => {
                return (
                  <MenuItem key={index} value={method.id}>
                    {method.name}
                  </MenuItem>
                );
              })
            }
          </TextField>
        </Grid>
      </Grid>

    </Grid>
  );
}

class CourseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      expanded: -1
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      let noOfPage = Math.round(this.props.data.length / 10);

      if (this.state.currentPage > noOfPage) {
        this.setState({ currentPage: 1 });
      }

      this.setState({ expanded: -1 })
    }
  }

  handlePageChange(event, value) {
    if (this.state.currentPage !== value) {
      this.setState({ expanded: -1 })
    }
    this.setState({ currentPage: value });
  }

  showMoneyStats(row) {
    let medianPay = DataExtractor.getMedianSalary(row);

    if (!medianPay) {
      return <Typography>No Data Available</Typography>;
    }

    let year = DataExtractor.getGESYear(row);
    let employmentRate = DataExtractor.getEmploymentRate(row);

    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Rating name="read-only" value={RatingRubrics.getSalaryRating(medianPay)} readOnly />
        <Typography>Year: {year}</Typography>
        <Typography>Median Salary: $ {medianPay} / mth</Typography>
        <Typography>Employment Rate: {employmentRate * 100} %</Typography>
      </Grid>
    );
  }

  showCourses(courses) {
    let props = this.props;

    return courses.map((row, index) => {
      let gradeList = [];
      let IGP = row["Indicative Grade Profile"];
      for (var key in IGP) {
        gradeList.push({ name: key, value: IGP[key] });
      }

      let annualCost = (row['Fee Type'] === "One-Time") ? row['Fee Citizen'] / row['Duration'] : row['Fee Citizen'];

      return (
        <Accordion key={index} expanded={this.state.expanded === index}
          onChange={() => this.setState({ expanded: (this.state.expanded === index) ? -1 : index })}>


          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container>
              <Grid item xs={1}>
                <Typography>{showRanking(((this.state.currentPage - 1) * 10) + index + 1)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>{row.Programme}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>{row.University}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography>{(row.ROI) ? row.ROI : '-'}</Typography>
              </Grid>
            </Grid>
          </AccordionSummary>


          <AccordionDetails>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={4} >
                <Grid container direction="column" justify="center" alignItems="center">
                  <Typography variant="h6">Grade</Typography>
                  {
                    (gradeList.length >= 0)
                    && gradeList.map((gradeRow, index) => {
                      return <Typography key={index}>{gradeRow.name} : {gradeRow.value}</Typography>
                    })
                  }
                  {(gradeList.length === 0) && <Typography>No Data Available</Typography>}
                </Grid>
              </Grid>

              <Grid item xs={4}>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Typography variant="h6">Cost</Typography>
                  <Rating name="read-only" value={RatingRubrics.getCostRating(annualCost)} readOnly />
                  <Typography>Years of Study: {row.Duration}</Typography>
                  <Typography>Fee(Citizen): $ {row["Fee Citizen"]} ({row["Fee Type"]})</Typography>

                </Grid>
              </Grid>

              <Grid item xs={4}>
                <Grid container direction="column" justify="center" alignItems="center">
                  <Typography variant="h6">Salary</Typography>
                  {this.showMoneyStats(row)}
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>

          <Divider />
          <AccordionActions>
            <Grid container>
              <Grid item xs={4}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Typography variant="h6">Probability of Entry: {(row.Entry_Probability) ? row.Entry_Probability : '-'}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={2}>
                <Grid container direction="row" justify="flex-end" alignItems="center">
                  <Button size="large" color="primary" onClick={() => props.history.push('/institutions/' + row["Id"])}>
                    More Details
                </Button>
                </Grid>
              </Grid>
            </Grid>
          </AccordionActions>

        </Accordion>
      );
    });
  }

  render() {
    let courses = this.props.data;
    if (!courses) {
      return <Loading />
    }

    if (courses.length === 0) {
      return <Container><Typography>No result</Typography></Container>;
    }

    let noOfPage = Math.round(courses.length / 10);

    let lastRow = this.state.currentPage * 10;
    courses = courses.slice(lastRow - 10, lastRow);

    return (
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>

        <Grid container direction="row" justify="space-between" alignItems="stretch">
          <Grid item xs={6} container direction="row" justify="flex-start" alignItems="flex-end">
            <Typography>
              Found {this.props.data.length} results
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <SortInput {...this.props} />
          </Grid>
        </Grid>

        {/* courses */}
        <Grid container>
          <Grid item xs={12}>
            {this.showCourses(courses)}
          </Grid>
        </Grid>


        {/* PAGING */}
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Pagination
            size="large"
            count={noOfPage}
            page={this.state.currentPage}
            onChange={this.handlePageChange.bind(this)} />
        </Grid>
      </div>
    );
  }
}

export default CourseDisplay;

// ============================================

function showRanking(num) {
  return num;
}
