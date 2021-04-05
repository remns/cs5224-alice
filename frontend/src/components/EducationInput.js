import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

export default class Education extends Component {
    constructor(props) {
      super(props);
      this.state = {
        education: 0
      }
    }

    componentDidMount() {
    }

    render() {
        return (
          <FormControl variant="outlined" fullWidth>
              <InputLabel>Select your education level</InputLabel>
              <Select
                label="Select your education level"
                value={this.props.value}
                onChange={(event) => {
                            this.setState({ education: event.target.value });
                            this.props.onChange(event.target.value);
                          }}
              >
                <MenuItem value={0}>Polytechnic</MenuItem>
                <MenuItem value={1}>Junior College</MenuItem>
              </Select>
          </FormControl>
        )
    }
}
