import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: []};
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    fetch('/users')
      .then(res => {
        console.log(res.text());
        this.setState({data: res.text});
      })
      .then(a => this.setState({data: a}));
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    // console.log(this.state.data);
    return (
      <div>Hello ss! {this.state.data}</div>
    );
  }
}
export default App;