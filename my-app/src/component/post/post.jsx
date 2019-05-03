import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: ''
    }
    this.connecToServer = this.connecToServer.bind(this);
  }
  connecToServer() {
    console.log(this.props.location.username);
    fetch('/post/' + this.props.location.username, {
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
      // this.setState({
      //   data: data[0]
      // });
    });
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    return (
      <div>Hello, {this.props.location.username}</div>
    );
  }
}
export default Post;