import React, { Component } from 'react';
import './vote.css';

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      post: [],
      newVote: false,
      count: 0,
      startRender: false
    }
    this.connecToServer = this.connecToServer.bind(this);
    this.left = this.left.bind(this);
    this.right = this.right.bind(this);
    this.update = this.update.bind(this);
    this.setrender = this.setrender.bind(this);
  }
  connecToServer() {
    fetch('/user/' + this.props.location.username, {
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
        user_id: data[0].user_id,
        newVote: true
      });
    })
  }

  componentDidMount() {
    this.connecToServer();
  }

  update = () => {
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
        console.log(data.length);
        if (data.length > 0) {
          if (this.state.count === 0) {
            this.setState({newVote: false, post: data, startRender: true, count: 1});
          } else {
            this.setState({newVote: false, post: data});
          }
        } else {
          this.setState({newVote: false, post: []});
        }
      })
    }
  }
  setrender = () => {
    console.log("setrender");
    if (this.state.startRender) {
      console.log("render");
      // this.setState({setrender})
      if (this.state.post.length > 0) {
        let post = this.state.post[0];
        return (
          <div>
            <span onClick={() => this.left(post.post_id)}>{post.left}</span>
            <span onClick={() => this.right(post.post_id)}>{post.right}</span>
          </div>
        )
      } else {
        console.log("You voted all");
        return <div>You voted all</div>
      }
    } else {
      console.log("not render");
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