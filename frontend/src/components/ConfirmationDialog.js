import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/styles';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import SettingsTwoToneIcon from '@material-ui/icons/SettingsTwoTone';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { getAllUniversity, getAllInterest, getAllCourses } from '../api/API.js'

import FilterDisplay from '../components/FilterDisplay';
import FilterDropdownDisplay from '../components/FilterDropdownDisplay';
import CourseDisplay from '../components/CourseDisplay';
import CourseSort from '../components/CourseSort';
import SearchBar from '../components/SearchBar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationDialog = ({ title, message, onClickAgree, isOpen, handleOpen }) => {
  const handleClose = () => {
    handleOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
          </Button>
        <Button onClick={onClickAgree} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;