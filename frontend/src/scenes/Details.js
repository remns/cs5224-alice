import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { Component } from 'react';
import { getAllCourses, getAllStatistics, postCourseClick } from '../api/API.js';
import Chart from '../components/Chart';


export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      course: undefined,
      stats: undefined
    };

  }

  componentDidMount(){
    const postCoursePromise = postCourseClick(this.state.id);
    postCoursePromise
    .then(res => res.json())
    .then((data) => {
    })
    .catch(console.log)

    const coursesPromise = getAllCourses();
    coursesPromise
    .then(res => res.json())
    .then((data) => {
      let courseResult = data.find(el => (this.state.id == el.Id));
      console.log(courseResult);
      this.setState({
        course: courseResult
      });
    })
    .catch(console.log)

    const statsPromise = getAllStatistics();
    statsPromise
    .then(res => res.json())
    .then((data) => {
      let statsResult = data.find(el => this.state.id == el.Id);
      this.setState({
        stats: statsResult
      });
    })
    .catch(console.log)
  }

  thousandsFormatter = (el) => {
    return el.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  getBasicMonthlyMedianData = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.course.GES.length; i++){
      labels.push(this.state.course.GES[i].Year);
      data.push(this.state.course.GES[i]["Basic Monthly Median"]);

      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ", 0.5)");
    }

    return {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Basic Monthly Median",
                    data: data,
                    backgroundColor: backgroundColor
                }
            ]
        },
        options: {
            //Customize chart options
            responsive: true,
            scales: {
              yAxes: [{
                ticks: { beginAtZero:true }
              }]
            }
        }
    };
  }

  getEmploymentRateData = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.course.GES.length; i++){
      labels.push(this.state.course.GES[i].Year);
      data.push(this.state.course.GES[i]["Overall Employment"] * 100);

      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ", 0.5)");
    }

    return {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Employment Rate %",
                    data: data,
                    backgroundColor: backgroundColor
                }
            ]
        },
        options: {
            //Customize chart options
            responsive: true,
            scales: {
              yAxes: [{
                ticks: { beginAtZero:true }
              }]
            }
        }
    };
  }

  render () {
    let course = this.state.course;
    let stats = this.state.stats;

    if(!course){ // Loading
      return (<div/>);
    }

    // Render IGP
    let renderIGP = [];
    for (var key in course["Indicative Grade Profile"]) {
        renderIGP.push(<Grid item xs={4}>
                          <Typography><b>{key}</b></Typography>
                          <Typography variant="h6">{course["Indicative Grade Profile"][key]}</Typography>
                        </Grid>);
    }

    return (
      <Grid
        container
        spacing={0}
        style={{ minHeight: '100vh' }}
      >
        {/* School Details */}
        <Grid item xs={3} style={{backgroundColor: '#2783A8'}}>
          <Grid
            container
            style={{minHeight: 100, backgroundColor: '#A87A47', paddingLeft: 15, paddingRight: 15}}
            direction="column"
            alignItems="center"
            justify="center">
            <Grid item xs={12} align="center">
              <Typography variant="h5" style={{color: 'white'}}><b>{course.Programme}</b></Typography>
            </Grid>
          </Grid>

          <div style={{paddingLeft: 15, paddingRight: 15}}>
          <Typography style={{marginTop: 10, color: 'white'}} align="center"><b>{course.University}</b></Typography>
          <Typography variant="subtitle2" style={{color: 'white'}} align="center">{course.School}</Typography>

          {/* CATEGORIES */}
          <Typography variant="subtitle2" style={{marginTop: 20, color: 'white'}}><b>Category</b></Typography>
          <Typography variant="subtitle2" style={{color: 'white'}}>
            {course.Category.map((el) =>
              <Typography variant="subtitle2">{el}</Typography>
            )}
          </Typography>
          </div>
        </Grid>

        {/* Other Details */}
        <Grid item xs={9} style={{paddingLeft: 15, paddingRight: 15}}>

          {/* Overview */}
          <Typography variant="h5" align="center" style={{marginTop: 15, marginBottom: 15}}><b>Overview</b></Typography>
          <Card>

            <Grid
              container
              direction="row"
              style={{padding: 10}}
            >
              <Grid item xs={4}>
                <Typography><b>Course Duration</b></Typography>
                <Typography variant="h6">{course.Duration} yrs</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><b>Honours</b></Typography>
                <Typography variant="h6">{course.Honours}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><b>Employability</b></Typography>
                <Typography variant="h6">
                  {
                    (!course.GES) ? "NA"
                    :
                    (course.GES[course.GES.length - 1]["Overall Employment"] >= 0.9) ? "Very High"
                    :
                    (course.GES[course.GES.length - 1]["Overall Employment"] >= 0.8) ? "High"
                    :
                    (course.GES[course.GES.length - 1]["Overall Employment"] >= 0.7) ? "Average"
                    :
                    "Low"
                  }
                </Typography>
              </Grid>
            </Grid>
          </Card>

          {/* IGP */}
          <Typography variant="h5" align="center" style={{marginTop: 15, marginBottom: 15}}><b>Indicative Grade Profile</b></Typography>
          <Card>
            <Grid
              container
              direction="row"
              spacing={1}
              style={{padding: 10}}
            >
              {renderIGP}
            </Grid>
          </Card>

          {/* FEES */}
          <Typography variant="h5" align="center" style={{marginTop: 15, marginBottom: 15}}><b>Fees</b></Typography>
          <Card>
            <Grid
              container
              direction="row"
              style={{padding: 10}}
            >
              <Grid item xs={12}>
                <Typography><b>Fee Type</b></Typography>
                <Typography variant="h6">{course["Fee Type"]}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><b>Citizen</b></Typography>
                <Typography variant="h6">${this.thousandsFormatter(course["Fee Citizen"])}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><b>International</b></Typography>
                <Typography variant="h6">${this.thousandsFormatter(course["Fee International"])}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography><b>Permanent Resident</b></Typography>
                <Typography variant="h6">${this.thousandsFormatter(course["Fee PR"])}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* GES */}
          {
            (stats) &&
            (
              <div>
              <Typography style={{marginTop: 15, marginBottom: 15}} variant="h5" align="center"><b>Graduate Employment Survey</b></Typography>
              <Grid
                container
                direction="row"
              >
                <Grid item xs={4} align="center">
                  <Typography><b>Overall Employment</b></Typography>
                  <Typography variant="h6">{(stats["Overall Employment"] != "NaN") ? Math.round(stats["Overall Employment"] * 100) + "%" : "-"}</Typography>
                </Grid>
                <Grid item xs={4} align="center">
                  <Typography><b>Gross Monthly Mean</b></Typography>
                  <Typography variant="h6">{(stats["Gross Monthly Mean"] != "NaN") ? "$" + this.thousandsFormatter(stats["Gross Monthly Mean"]) : "-"}</Typography>
                </Grid>
                <Grid item xs={4} align="center">
                  <Typography><b>Gross Monthly Median</b></Typography>
                  <Typography variant="h6">{(stats["Gross Monthly Median"] != "NaN") ? "$" + this.thousandsFormatter(stats["Gross Monthly Median"]) : "-"}</Typography>
                </Grid>
                <Grid item xs={6} align="center" style={{marginTop: 10}}>
                  <Typography><b>Gross Monthly 75th Percentile</b></Typography>
                  <Typography variant="h6">{(stats["Gross Monthly 75th Percentile"] != "NaN") ? "$" + this.thousandsFormatter(stats["Gross Monthly 75th Percentile"]) : "-"}</Typography>
                </Grid>
                <Grid item xs={6} align="center" style={{marginTop: 10}}>
                  <Typography><b>Gross Monthly 25th Percentile</b></Typography>
                  <Typography variant="h6">{(stats["Gross Monthly 25th Percentile"] != "NaN") ? "$" + this.thousandsFormatter(stats["Gross Monthly 25th Percentile"]) : "-"}</Typography>
                </Grid>
              </Grid>

              {/* GES Statistics */}
              <Grid
                container
                direction="row"
                style={{marginTop: 15}}
              >
                <Grid item xs={12}>
                  <Typography><b>Yearly Basic Monthly Median</b></Typography>
                  <Chart chart={this.getBasicMonthlyMedianData()}/>
                </Grid>
                <Grid item xs={12} style={{marginTop: 15}}>
                  <Typography><b>Yearly Employment Rate</b></Typography>
                  <Chart chart={this.getEmploymentRateData()}/>
                </Grid>
              </Grid>
            </div>
            )
          }
          </Grid>
      </Grid>
    )
  }
}
