import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { getAllUniversity, getAllInterest, getAllCourses } from '../api/API.js'

import FilterDisplay from '../components/FilterDisplay';
import FilterDropdownDisplay from '../components/FilterDropdownDisplay';
import CourseDisplay from '../components/CourseDisplay';
import CourseSort from '../components/CourseSort';

const SearchBar = ({ courseList, onClick }) => {
  const [value, setValue] = React.useState('');
  var onSubmit = () => {
    setValue('')
    onClick(value);
  }

  return (
    <Autocomplete
      fullWidth
      freeSolo
      disableClearable
      options={courseList.map((option) => option.Programme)}
      inputValue={value}
      onChange={(event) => setValue(event.target.outerText)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Courses"
          variant="outlined"
          onChange={(event) => setValue(event.target.value)}
          InputProps={{
            ...params.InputProps, type: 'search', 
          endAdornment: <Button variant="contained" color="primary" onClick={onSubmit}><SearchIcon/></Button>
        }}
        />
      )}
    />
  );
}

export default SearchBar;