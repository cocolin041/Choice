import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import './post.css';

const firebaseConfig = {
  apiKey: "AIzaSyB3TGGGH9QxPDNbuwmq7_N63MVNPt9KCD0",
  authDomain: "cs498-1556867489239.firebaseapp.com",
  databaseURL: "https://cs498-1556867489239.firebaseio.com",
  projectId: "cs498-1556867489239",
  storageBucket: "cs498-1556867489239.appspot.com",
  messagingSenderId: "1088207692567",
  appId: "1:1088207692567:web:41978eb051dde9dc"
};
firebase.initializeApp(firebaseConfig);

var storageService = firebase.storage();
var storageRef = storageService.ref();

class YourPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      posts: [],
      downloaded: false
    }
    this.connecToServer = this.connecToServer.bind(this);
    this.handleFileDownload = this.handleFileDownload.bind(this);
    this.renderPost = this.renderPost.bind(this);
  }

  handleFileDownload = (data, num) => {
    let posts = this.state.posts;
    storageRef.child('images/'+ data.left).getDownloadURL().then(function(url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
      var img = document.getElementsByClassName('myimgL')[num];
      img.src = url;
      let postIdx = posts.findIndex(x => x.post_id === data.post_id);
      posts[postIdx].left = url;
      this.setState({posts: posts});
    }).catch(function(error) {
      // Handle any errors
    });


    storageRef.child('images/'+ data.right).getDownloadURL().then(function(url) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
      var img = document.getElementsByClassName('myimgR')[num];
      img.src = url;
      let postIdx = posts.findIndex(x => x.post_id === data.post_id);
      posts[postIdx].right = url;
      this.setState({posts: posts, downloaded: true});
    }).catch(function(error) {
      // Handle any errors
    });
    
  };

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

    //get all post_id of this user
    await fetch('/post/' + this.state.user_id, {
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
        let posts = [];
        data.map(data => {
          posts.push({
            post_id: data.post_id,
            left: data.left,
            right: data.right,
            voteLeft: 0,
            voteRight: 0,
          })
        });
        this.setState({posts: posts});
      }
    })

    //get voteResult
    await this.state.posts.map(p => {
      fetch('/voteResult/' + p.post_id, {
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
          let left = 0;
          let right = 0;
          data.map(d => {
            if (d.choice === 'left') {
              left += 1;
            } else {
              right += 1;
            }
          })
          let posts = this.state.posts;
          let postIdx = posts.findIndex(x => x.post_id === p.post_id);
          posts[postIdx].voteLeft = left / (left + right);
          posts[postIdx].voteRight = right / (left + right);
          this.setState({posts: posts});
        }
      })
    })

    //get img url
    let num = 0;
    await this.state.posts.map(p => {
      this.handleFileDownload(p, num);
      num += 1;
    })
  }

  renderPost = () => {
      return (
        <div>
        <div>hello</div>
        {this.state.posts.map(p => 
          <div>
            <div>
              <img class="myimgL" src={p.left} />
              <div>{p.voteLeft}</div>
            </div>
            <div>
              <img class="myimgR" src={p.right} />
              <div>{p.voteRight}</div>
            </div>
          </div>
        )}
        </div>
      )
  }

  componentDidMount() {
    this.connecToServer();
  }

  render() {
    return (
      <div>
        {/* <div>Hello, {this.props.location.username}</div> */}
        <ul className="menu">
          <Link className="menu-item" to={{pathname: "/createPost", username: this.props.location.username}}>Create Post</Link>
          <Link className="menu-item" to={{pathname: "/vote", username: this.props.location.username}}>Vote</Link>
        </ul>
        <h2>Your Post</h2>
        {this.state.posts.length > 0 ? (
          <div id="renderPost">
            {this.renderPost()}
            {/* {this.state.posts.map(p => 
              <div>
                <div>
                  <img class="myimgL" src={p.left} />
                  <div>{p.voteLeft}</div>
                </div>
                <div>
                  <img class="myimgR" src={p.right} />
                  <div>{p.voteRight}</div>
                </div>
              </div>
            )} */}
          </div>
        ):(
          <div>No post yet</div>
        )}
      </div>
    );
  }
}
export default YourPost;