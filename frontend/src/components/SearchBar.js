import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';



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