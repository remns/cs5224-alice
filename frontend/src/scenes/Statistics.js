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

import {getAllStatistics} from '../api/API.js';
import Chart from '../components/Chart';

export default class Statistics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employment: [],
      salary: []
    };

  }

  componentDidMount(){
    this.retrieveEmploymentStatistics();
    this.retrieveSalaryStatistics();
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

    console.log(this.state.salary);
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

  render () {
    return (
      <Grid
        container
        spacing={0}
        direction="row"
        style={{ minHeight: '100vh' }}
      >
        <Grid container item xs={4} justify="center" alignItems="center">
          {
            (this.state.employment.length > 0) &&
            <Grid container item direction="row" justify="center" alignItems="center">
              <Typography variant="h5"><b>Most employable course</b></Typography>
              <Typography variant="h4" align="center"><b>{this.state.employment[0]["Course Code"]}</b></Typography>
              <Typography variant="h6"><b>Employment Rate: {parseFloat(this.state.employment[0]["Full-Time Employment"]) * 100}%</b></Typography>
            </Grid>
          }
        </Grid>
        <Grid item xs={8}>
          <Card>
            <Typography><b>Most employable courses</b></Typography>
            <Chart chart={this.getChartDataTopGraduateEmployment()}/>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <Typography><b>Top Average Salary</b></Typography>
            <Chart chart={this.getChartDataTopAverageSalary()}/>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
          </Card>
        </Grid>
      </Grid>
    )
  }
}
