import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

import Loading from './Loading'

function ResultBox(props) {
  if (!props.data) return (null);
  let interestList = props.interestList;

  const handleDelete = (interestId) => () => {
    props.onDelete(interestId);
  };

  return (
    <Grid container>
      <Grid item>
        {
          interestList.map( (interest, index) => {
            return (
              <Chip key={index} variant="outlined" color="primary" icon={<FaceIcon />} label={interest.Name} 
                onDelete={(handleDelete(interest.Id))}/>
            );
          })
        }
      </Grid>
    </Grid>
  );
}

function Dropdown(props) {
  const [dropdownVal, setDropdownVal] = React.useState('');
  const handleChange = (event) => {
    setDropdownVal("");
    props.onSelect(event.target.value);
  };

  if (!props.data) return (null);

  let availableInterest = props.data.filter(inter => !inter.isSelected);

  return (
    <FormControl variant="outlined" fullWidth={true} style={{marginLeft: "10px", marginRight: "10px"}}>
      <InputLabel>Interest</InputLabel>
      <Select
        value={dropdownVal}
        onChange={handleChange}
        label="Interest"
      >
        <MenuItem value="None" key={0}>
          None
        </MenuItem>
        {
          availableInterest.map( (interest, index) => {
            return (
              <MenuItem key={index + 1} value={interest.Id}>
                {interest.Name}
              </MenuItem>
            );
          })
        }
      </Select>
      <FormHelperText>Add your Area of Interest!</FormHelperText>
    </FormControl>
  );
}

function FilterDropdownDisplay(props) {
  if (!props.data) {
    return <Loading />
  }

  return (
    <div>
      <Grid container>
        <Dropdown {...props} />
      </Grid>
      <Grid container style={{marginLeft: '10px', marginRight: '10px'}}>
        <ResultBox {...props} />
      </Grid>
    </div>
  );
}

export default FilterDropdownDisplay;