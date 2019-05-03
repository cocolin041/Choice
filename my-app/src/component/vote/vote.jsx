import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      post: [],
      newVote: true
    }
    this.connecToServer = this.connecToServer.bind(this);
    this.left = this.left.bind(this);
    this.right = this.right.bind(this);
    this.update = this.update.bind(this);
    this.setrender = this.setrender.bind(this);
  }
  async connecToServer() {
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

  update = () => {
    // console.log(this.state.newVote);
    if (this.state.newVote) {
      fetch('/vote/' + this.state.user_id, {
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
        this.setState({newVote: false});
        if (data.length > 0) {
          this.setState({post: data});
        } else {
          this.setState({post: []});
        }
      })
    }
  }
  setrender = () => {
    if (this.state.post.length > 0) {
      let post = this.state.post[0];
      return (
        <div>
          <span onClick={() => this.left(post.post_id)}>{post.left}</span>
          <span onClick={() => this.right(post.post_id)}>{post.right}</span>
        </div>
      )
    } else {
      return <div>You voted all</div>
    }
  }

  left = (post_id) => {
    this.setState({newVote: true});

    fetch('/vote/' + this.state.user_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: post_id,
        choice: 'left'
      })
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
    });
  }

  right = (post_id) => {
    this.setState({newVote: true});

    fetch('/vote/' + this.state.user_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_id: post_id,
        choice: 'right'
      })
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
    });
  }

  render() {
    return (
      <div>
        <h2>Vote</h2>
        {this.update()}
        {this.setrender()}
      </div>
    );
  }
}
export default Vote;