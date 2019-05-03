import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/users', {
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({data: data})
    });
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    // console.log(this.state.data);
    return (
      <div>Hello ss! {this.state.data.name}</div>
    );
  }
}
export default App;