import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {courses: []};
    this.componentDidMount.bind(this);
    this.render.bind(this);
  }

  // https://3jqms9dxp6.execute-api.ap-southeast-1.amazonaws.com/Prod/courses
  componentDidMount(){
    fetch(process.env.REACT_APP_API + '/courses')
        .then((response) => {
          return response.json();
        })
        .then((results) => {
          console.log(results);
          this.setState({ courses: results });
        });
  }

  render () {
    const courses = this.state.courses.map((item, i) => (
      <div>
        <p>{ item.Title } (by {item.Uni})</p>
      </div>
    ));

    return (
    <div className="App">
      <header className="App-header">
        <p>
          List of Courses:
        </p>
        <div>{ courses }</div>
      </header>
    </div>)
  }
}
