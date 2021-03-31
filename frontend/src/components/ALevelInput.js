import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

export default class ALevelInput extends Component {
    constructor(props) {
      super(props);

      this.state = {
        alevel: {
          h2_1: '',
          h2_2: '',
          h2_3: '',
          h1: '',
          pw: '',
          gp: '',
          mtl: ''
        }
      }
    }

    componentDidMount() {
    }

    onInputChange = (key, event) => {
      let alevel = this.state.alevel;
      let input = event.target.value;
      input = input.toUpperCase();
      if(input == "A" || input == "B" || input == "C" || input == "D" || input == "E" || input == "U" || input == ''){
        alevel[key] = input;
        this.setState({ alevel: alevel }, () => {this.props.onChange(this.state.alevel)});
      }
    }

    render() {
        return (
          <Grid
            container
            spacing={1}
            direction="row"
            style={{ maxWidth: 700 }}
            >
            <Grid item xs={3}>
              <TextField
                label="H2"
                variant="outlined"
                type="text"
                value={this.state.alevel.h2_1}
                onChange={(event) => this.onInputChange("h2_1", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="H2"
                variant="outlined"
                type="text"
                value={this.state.alevel.h2_2}
                onChange={(event) => this.onInputChange("h2_2", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="H2"
                variant="outlined"
                type="text"
                value={this.state.alevel.h2_3}
                onChange={(event) => this.onInputChange("h2_3", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="H1"
                variant="outlined"
                type="text"
                value={this.state.alevel.h1}
                onChange={(event) => this.onInputChange("h1", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Project Work"
                variant="outlined"
                type="text"
                value={this.state.alevel.pw}
                onChange={(event) => this.onInputChange("pw", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Mother Tongue"
                variant="outlined"
                type="text"
                value={this.state.alevel.mtl}
                onChange={(event) => this.onInputChange("mtl", event)}
                fullWidth
                />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="GP"
                variant="outlined"
                type="text"
                value={this.state.alevel.gp}
                onChange={(event) => this.onInputChange("gp", event)}
                fullWidth
                />
            </Grid>
          </Grid>
        )
    }
}
