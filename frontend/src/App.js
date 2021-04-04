import 'fontsource-roboto';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,

  Route, Switch
} from "react-router-dom";
import ComparePage from './scenes/ComparePage';
import CompareResult from './scenes/CompareResult';
import Details from './scenes/Details';
import HeaderBar from './scenes/HeaderBar';
import Institutions from './scenes/Institutions';
import Profile from './scenes/Profile';
import Statistics from './scenes/Statistics';
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
