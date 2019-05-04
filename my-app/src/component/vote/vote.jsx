import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import './vote.css';

var storageService = firebase.storage();
var storageRef = storageService.ref();

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
    this.handleFileDownload = this.handleFileDownload.bind(this);
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

  handleFileDownload = (post_id) => {
    storageRef.child('images/left_'+ post_id + '.png').getDownloadURL().then(function(url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
      var img = document.getElementById('myimgL');
      img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
    storageRef.child('images/right_'+ post_id + '.png').getDownloadURL().then(function(url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
      var img = document.getElementById('myimgR');
      img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
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
      if (this.state.post.length > 0) {
        console.log("render");
        let post = this.state.post[0];
        this.handleFileDownload(post.post_id);
        return (
          <div>
            <img id="myimgL" onClick={() => this.left(post.post_id)} />
            <img id="myimgR" onClick={() => this.right(post.post_id)} />
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
        <ul className="menu">
          <Link className="menu-item" to={{pathname: "/yourPost", username: this.props.location.username}}>Your Post</Link>
          <Link className="menu-item" to={{pathname: "/createPost", username: this.props.location.username}}>Create Post</Link>
        </ul>
        <h2>Vote</h2>
        {this.update()}
        {this.setrender()}
      </div>
    );
  }
}
export default Vote;