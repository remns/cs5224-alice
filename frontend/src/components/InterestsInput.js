import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React, { Component } from 'react';
import { getAllInterest } from '../api/API.js';


export default class InterestsInput extends Component {
    constructor(props) {
      super(props);

      this.state = {
        interests: []
      }
    }

    componentDidMount(){
      this.retriveInterest();
    }

    retriveInterest = () => {
      const promise = getAllInterest();
      promise
        .then(res => res.json())
        .then((data) => {
          data.map((e, index) => e.value = index);
          this.setState({
            interests: data,
          })
        })
        .catch(console.log)
    }

    onInterestChange = (event) => {
      this.props.onChange(event.target.value);
    }

    render() {
        return (
          <div style={{maxWidth: 500}}>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>Select your interests</InputLabel>
                <Select
                  label="Select your interests"
                  value={this.props.value}
                  onChange={(event) => this.onInterestChange(event)}
                  renderValue={(selected) => {
                    let results = [];
                    for(let i = 0; i < this.state.interests.length; i++){
                      if(selected.indexOf(this.state.interests[i].value) > -1){
                        results.push(this.state.interests[i].Name);
                      }
                    }
                    return results.join(", ");
                  }}
                  multiple
                  displayEmpty
                >
                  {this.state.interests.map((el) => (
                    <MenuItem key={el.name} value={el.value}>
                      <Checkbox checked={this.props.value.indexOf(el.value) > -1} />
                      <ListItemText primary={el.Name} />
                    </MenuItem>
                  ))}
                </Select>
            </FormControl>
          </div>
        )
    }
}
