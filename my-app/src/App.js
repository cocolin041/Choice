import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/post', {
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({data: data[0]})
    });
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    // console.log(this.state.data);
    return (
      <div>Hello {this.state.data.Address}</div>
    );
  }
}
export default App;