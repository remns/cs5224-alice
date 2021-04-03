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
import ComparePage from './scenes/ComparePage';
import CompareResult from './scenes/CompareResult';
import Details from './scenes/Details';
import HeaderBar from './scenes/HeaderBar';

import 'fontsource-roboto';
import './styles/main.css';

const DefaultContainer = () => (
  <div>
    <HeaderBar />
    <Route exact path="/institutions" component={Institutions} />
    <Route exact path="/institutions/:id" render={(props) => <Details {...props} /> }/>
    <Route exact path="/compare" component={ComparePage} />
    <Route exact path="/compare/result" component={CompareResult} />
    <Route exact path="/statistics" component={Statistics} />
  </div>
)

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Profile} />
          <Route {...this.props} component={DefaultContainer} />
        </Switch>
      </Router>
    )
  }
}
