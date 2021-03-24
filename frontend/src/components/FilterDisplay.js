import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Loading from './Loading'

function FilterCheckBox(props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={props.isChecked}
          onClick={() => props.onClick(props.id)}
        />
      }
      label={props.id}
    />
  )
}

function FilterList(props) {
  let data = props.data;
  return (
    <div>
      {
        data.map( (row, index) => {
          return <FilterCheckBox isChecked={row.isChecked} key={index} id={row.Id} value={row.Name} onClick={(val) => props.onClick(val)} />
        })
      }
    </div>
  )
}

class FilterDisplay extends React.Component {
  render() {
    if (!this.props.data) {
      return <Loading />
    }

    return (
      <FilterList data={this.props.data} onClick={(val) => this.props.onClick(val)} />
    )
  }
}

export default FilterDisplay;