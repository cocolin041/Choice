import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
// import './post.css';

class createPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      posts: []
    }
    this.connecToServer = this.connecToServer.bind(this);
  }
  async connecToServer() {
    //get user_id
    await fetch('/user/' + this.props.location.username, {
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        user_id: data[0].user_id
      });
    })   
  }

  componentDidMount() {
    this.connecToServer();
  }

  createPost = () => {
    let left = document.querySelector("input[name='left']");
    let right = document.querySelector("input[name='right']");
    let duration = document.querySelector("input[name='duration']");

    fetch('/post/' + this.state.user_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        left: left.value,
        right: right.value,
        duration: duration.value
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
  }

  render() {
    return (
      <div>
        {/* <div>Hello, {this.props.location.username}</div> */}
        <ul className="menu">
          <Link className="menu-item" to={{pathname: "/yourPost", username: this.props.location.username}}>Your Post</Link>
          <Link className="menu-item" to={{pathname: "/vote", username: this.props.location.username}}>Vote</Link>
        </ul>
        <h2>Create post</h2>
        <div className="choice">
          <input type="text" name="left"/>
          <input type="text" name="right"/>
        </div>
        Period: <input type="number" name="duration"/> mins
        <button type="button" onClick={this.createPost}>create</button>
      </div>
    );
  }
}
export default createPost;