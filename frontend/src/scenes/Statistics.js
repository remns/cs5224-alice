import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';

import {getAllStatistics, getAllTrackClicks} from '../api/API.js';
import Chart from '../components/Chart';

export default class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employment: [],
      salary: [],
      popularCourses: [],
      intake: [],
      igpALevel10: [],
      igpALevel90: [],
      igpPoly10: [],
      igpPoly90: []
    };

  }

  componentDidMount(){
    this.retrieveEmploymentStatistics();
    this.retrieveSalaryStatistics();
    this.retrievePopularCourses();
    this.retrieveIntake();
    this.retrieveIGP();
  }

  retrieveEmploymentStatistics = () => {
    const promise = getAllStatistics("Full-Time Employment", 10);
    promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          employment: data,
        })
      })
      .catch(console.log)
  }

  retrieveSalaryStatistics = () => {
    const promise = getAllStatistics("Basic Monthly Mean", 10);
    promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          salary: data,
        })
      })
      .catch(console.log)
  }

  retrievePopularCourses = () => {
    const promise = getAllTrackClicks(10);
    promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          popularCourses: data,
        })
      })
      .catch(console.log)
  }

  retrieveIntake = () => {
    const promise = getAllStatistics("Intake", 10);
    promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          intake: data,
        })
      })
      .catch(console.log)
  }

  retrieveIGP = () => {
    let aLevel10Promise = getAllStatistics("A-Levels 10th Percentile", undefined);
    aLevel10Promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          igpALevel10: data,
        })
      })
      .catch(console.log)

    let aLevel90Promise = getAllStatistics("A-Levels 90th Percentile", undefined);
    aLevel90Promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          igpALevel90: data,
        })
      })
      .catch(console.log)

    let poly10Promise = getAllStatistics("Polytechnic 10th Percentile", undefined);
    poly10Promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          igpPoly10: data,
        })
      })
      .catch(console.log)

    let poly90Promise = getAllStatistics("Polytechnic 90th Percentile", undefined);
    poly90Promise
      .then(res => res.json())
      .then((data) => {
        this.setState({
          igpPoly90: data,
        })
      })
      .catch(console.log)
  }

  getChartDataTopGraduateEmployment = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.employment.length; i++){
      labels.push(this.state.employment[i]["Course Code"]);
      data.push(parseFloat(this.state.employment[i]["Full-Time Employment"]) * 100);

      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ", 0.5)");
    }

    return {
        type: "horizontalBar",
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
        }
    };
  }

  getChartDataTopAverageSalary = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.salary.length; i++){
      labels.push(this.state.salary[i]["Course Code"]);
      data.push(parseFloat(this.state.salary[i]["Basic Monthly Mean"]));

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
                    label: "Salary Per Month (SGD)",
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

  getChartDataPopularCourses = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.popularCourses.length; i++){
      labels.push([this.state.popularCourses[i]["Programme"], this.state.popularCourses[i]["University"]]);
      data.push(parseFloat(this.state.popularCourses[i]["Clicks"]));

      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ", 0.5)");
    }

    return {
        type: "radar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Number of times browsed",
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

  getChartDataIntake = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    for(let i = 0; i < this.state.intake.length; i++){
      labels.push(this.state.intake[i]["Programme"] + " - " + this.state.intake[i]["University"]);
      data.push(this.state.intake[i]["Intake"]);

      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      backgroundColor.push("rgba(" + r + ", " + g + ", " + b + ", 0.7)");
    }

    return {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Intake",
                    data: data,
                    backgroundColor: backgroundColor
                }
            ]
        },
        options: {
            //Customize chart options
            responsive: true
        }
    };
  }

  getChartDataIGPALevel10th = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    let render = [];
    for(let i = 0; i < this.state.igpALevel10.length; i++){
      render.push(
        <Typography>{i + 1}. {this.state.igpALevel10[i]["Course Code"]} - {this.state.igpALevel10[i]["Indicative Grade Profile"]["A-Levels 10th Percentile"]}</Typography>
      );
    }

    return render;
  }

  getChartDataIGPALevel90th = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    let render = [];
    for(let i = 0; i < this.state.igpALevel90.length; i++){
      render.push(
        <Typography>{i + 1}. {this.state.igpALevel90[i]["Course Code"]} - {this.state.igpALevel90[i]["Indicative Grade Profile"]["A-Levels 90th Percentile"]}</Typography>
      );
    }

    return render;
  }

  getChartDataIGPPolytechnic10th = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    let render = [];
    for(let i = 0; i < this.state.igpPoly10.length; i++){
      render.push(
        <Typography>{i + 1}. {this.state.igpPoly10[i]["Course Code"]} - {this.state.igpPoly10[i]["Indicative Grade Profile"]["Polytechnic 10th Percentile"]}</Typography>
      );
    }

    return render;
  }

  getChartDataIGPPolytechnic90th = () => {
    let labels = [];
    let data = [];
    let backgroundColor = [];

    let render = [];
    for(let i = 0; i < this.state.igpPoly90.length; i++){
      render.push(
        <Typography>{i + 1}. {this.state.igpPoly90[i]["Course Code"]} - {this.state.igpPoly90[i]["Indicative Grade Profile"]["Polytechnic 90th Percentile"]}</Typography>
      );
    }

    return render;
  }

  render () {
    return (
      <Grid
        container
        spacing={0}
        direction="row"
        style={{ minHeight: '100vh' }}
      >
        {/* STATISTICS */}
        <Grid item xs={12} style={{marginTop: 20, marginBottom: 20}}>
          <Typography variant="h4" align="center"><b>Statistics</b></Typography>
          <Typography variant="h6" color="textSecondary" align="center"><b>Top 10 Results</b></Typography>
        </Grid>

        <Grid container item xs={4} justify="center" alignItems="center">
          {
            (this.state.employment.length > 0) &&
            <Grid container item direction="row" justify="center" alignItems="center">
              <Typography variant="h5" color="secondary"><b>Most employable course</b></Typography>
              <Typography variant="h4" align="center"><b>{this.state.employment[0]["Course Code"]}</b></Typography>
              <Typography variant="h6"><b>Employment Rate: {parseFloat(this.state.employment[0]["Full-Time Employment"]) * 100}%</b></Typography>
            </Grid>
          }
        </Grid>

        {/* MOST EMPLOYABLE COURSES */}
        <Grid item xs={8} style={{marginBottom: 10}}>
          <Card style={{padding: 10}}>
            <Typography variant="h6" style={{marginBottom: 5}}><b>Most employable courses</b></Typography>
            <Chart chart={this.getChartDataTopGraduateEmployment()}/>
          </Card>
        </Grid>

        {/* TOP AVERAGE SALARY */}
        <Grid item xs={6}>
          <Card style={{marginRight: 10, padding: 10}}>
            <Typography style={{marginBottom: 5}}><b>Top Average Salary</b></Typography>
            <Chart chart={this.getChartDataTopAverageSalary()}/>
          </Card>
        </Grid>

        {/* TOP INTAKE BY PROGRAMME */}
        <Grid item xs={6}>
          <Card style={{padding: 10}}>
            <Typography style={{marginBottom: 5}}><b>Top Intake by Programme</b></Typography>
            <Chart chart={this.getChartDataIntake()}/>
          </Card>
        </Grid>

        {/* POPULAR COURSES */}
        <Grid item xs={2} />
        <Grid item xs={8} style={{marginTop: 10}}>
          <Card style={{padding: 10}}>
            <Typography style={{marginBottom: 5}}><b>Popular Courses</b></Typography>
            <Chart chart={this.getChartDataPopularCourses()}/>
          </Card>
        </Grid>
        <Grid item xs={2} />

        {/* IGP */}
        <Grid item xs={12} style={{marginTop: 20, marginBottom: 40}}>
          <Typography variant="h4" align="center"><b>Indicative Grade Profiles Ranking</b></Typography>
          <Typography variant="h6" color="textSecondary" align="center"><b>Only data for NUS, NTU, SMU are included</b></Typography>
        </Grid>

        {/* A LEVELS */}
        <Grid item xs={12} style={{marginBottom: 15}}>
          <Typography variant="h5"><b>A-Levels</b></Typography>
        </Grid>

        <Grid item xs={6}>
          <Card style={{marginRight: 10, padding: 10}}>
            <Typography><b>A Levels 10th Percentile (Highest to lowest)</b></Typography>
            {this.getChartDataIGPALevel10th()}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{padding: 10}}>
            <Typography><b>A Levels 90th Percentile (Highest to lowest)</b></Typography>
            {this.getChartDataIGPALevel90th()}
          </Card>
        </Grid>

        {/* POLYTECHNIC */}
        <Grid item xs={12} style={{marginTop: 15, marginBottom: 15}}>
          <Typography variant="h5"><b>Polytechnic</b></Typography>
        </Grid>

        <Grid item xs={6}>
          <Card style={{marginRight: 10, padding: 10}}>
            <Typography><b>Polytechnic 10th Percentile (Highest to lowest)</b></Typography>
            {this.getChartDataIGPPolytechnic10th()}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{padding: 10}}>
            <Typography><b>Polytechnic 90th Percentile (Highest to lowest)</b></Typography>
            {this.getChartDataIGPPolytechnic90th()}
          </Card>
        </Grid>

      </Grid>
    )
  }
}
