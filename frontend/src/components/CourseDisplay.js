import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AccordionActions from '@material-ui/core/AccordionActions';

import Loading from './Loading';

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
        this.setState({currentPage: 1});
      }

      this.setState({expanded: -1})
    }
  }

  handlePageChange(event, value) {
    if (this.state.currentPage !== value) {
      this.setState({expanded: -1})
    }
    this.setState({currentPage: value});
  }

  showMedianPay(row) {
    if (!row['GES']) {
      return <Typography>-</Typography>;
    }

    let medianPay = "";
    let year = "";
    for (let key in row['GES']) {
      let ges = row['GES'][key];
      if (ges['Basic Monthly Median'] !== "" && ges['Basic Monthly Median'] !== "NA") {
        medianPay = ges['Basic Monthly Median'];
        year = ges['Year'];
      }
    }

    if (medianPay === "") {
      return <Typography>-</Typography>;
    }

    return (
      <div key={row.Id} >
        <Typography>Year: {year}</Typography>
        <Typography>$ {medianPay} / mth</Typography>
      </div>
    );
  }

  showCourses(courses) {
    return courses.map( (row, index) => {
      return (
        <Accordion key={index} expanded={this.state.expanded === index} 
          onClick={() => this.setState({expanded: (this.state.expanded === index) ? -1 : index})}>


          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container direction="row" justify="flex-start" alignItems="stretch">
              <Grid item>
                <Typography>{showRanking(((this.state.currentPage - 1) * 10) + index + 1)}</Typography>
              </Grid>
              <Grid item>
                <Typography>{row.Programme}</Typography> 
              </Grid> 
              <Grid item>
                <Typography>{row.University}</Typography>
              </Grid>
              <Grid item>
                <Typography>97</Typography>
              </Grid>        
            </Grid>
          </AccordionSummary>


          <AccordionDetails>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={4}>
                <Typography>Grades</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography>Cost</Typography>
                <Typography>Years: {row.Duration}</Typography>
                <Typography>{row["Fee Citizen"]}</Typography>
                <Typography>{row["Fee International"]}</Typography>
                <Typography>{row["Fee PR"]}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography>Median Pay</Typography>
                {this.showMedianPay(row)}
              </Grid>
            </Grid>
          </AccordionDetails>

          <Divider />
          <AccordionActions>
            <Button size="large" color="primary">
              More Details
            </Button>
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
      <Container>

        {/* courses */}

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Typography>
            {this.props.data.length} results
          </Typography>
          {this.showCourses(courses)}
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
      </Container>
    );
  }
}

export default CourseDisplay;

// ============================================

function showRanking(num) {
  return num;
}