import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/');
  }

  componentDidMount() {
    this.connecToServer();
  }

  listAll = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
      }
    };
    //get
    xhttp.open("GET", "http://localhost:5000", true);
    xhttp.send();
  };

  render() {
    listAll();
    return (
      <div>Hello world!</div>
    );
  }
}
export default App;