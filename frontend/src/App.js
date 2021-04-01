import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Profile from './scenes/Profile';
import Institutions from './scenes/Institutions';
import Statistics from './scenes/Statistics';
import Details from './scenes/Details';

import 'fontsource-roboto';
import './styles/main.css';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Profile} />
          <Route exact path="/institutions" component={Institutions} />
          <Route exact path="/institutions/:id" render={(props) => <Details {...props} /> }/>
          <Route exact path="/statistics" component={Statistics} />
        </Switch>
      </Router>
    )
  }
}
