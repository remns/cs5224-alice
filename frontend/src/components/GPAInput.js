import TextField from '@material-ui/core/TextField';
import React, { Component } from 'react';

export default class GPAInput extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {

    }

    onInputChange = (event) => {
      let input = event.target.value;
      let validNumber = new RegExp(/^\d*\.?\d*$/);
      if(validNumber.test(input) && input.length <= 4){ // Only digits and decimal
        this.props.onChange(input);
      }
    }

    render() {
        return (
          <TextField
            label="Enter your GPA (Max 4.0)"
            variant="outlined"
            value={this.props.value}
            onChange={(event) => this.onInputChange(event)}
            fullWidth
            />
        )
    }
}
