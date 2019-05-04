import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
// import './post.css';

// var selectedFileL;
// var selectedFileR;
// const firebaseConfig = {
//   apiKey: "AIzaSyB3TGGGH9QxPDNbuwmq7_N63MVNPt9KCD0",
//   authDomain: "cs498-1556867489239.firebaseapp.com",
//   databaseURL: "https://cs498-1556867489239.firebaseio.com",
//   projectId: "cs498-1556867489239",
//   storageBucket: "cs498-1556867489239.appspot.com",
//   messagingSenderId: "1088207692567",
//   appId: "1:1088207692567:web:41978eb051dde9dc"
// };
// firebase.initializeApp(firebaseConfig);

var storageService = firebase.storage();
var storageRef = storageService.ref();

class createPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      posts: [],
      post_id: '',
      selectedFileL: '',
      selectedFileR: ''
    }
    this.connecToServer = this.connecToServer.bind(this);
    this.handleFileUploadChangeL = this.handleFileUploadChangeL.bind(this);
    this.handleFileUploadChangeR = this.handleFileUploadChangeR.bind(this);
    this.handleFileUploadSubmit = this.handleFileUploadSubmit.bind(this);
    this.handleFileDownload = this.handleFileDownload.bind(this);
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

  createPost = async () => {
    let duration = document.querySelector("input[name='duration']");

    await fetch('/post/' + this.state.user_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        left: '',
        right: '',
        duration: duration.value
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setState({post_id: data.post_id});
    });

    await fetch('/upload/' + this.state.post_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        left: 'left_' + this.state.post_id,
        right: 'right_' + this.state.post_id
      })
    })
  }
  
  handleFileUploadChangeL = (e) => {
    let file = e.target.files[0];
    this.setState({selectedFileL: file});
    // selectedFileL = e.target.files[0];
  }
  handleFileUploadChangeR = (e) => {
    this.setState({selectedFileR: e.target.files[0]});
  }

  handleFileUploadSubmit = (e) => {
    if (this.state.post_id !== '') {
      var uploadTaskL = storageRef.child(`images/${'left_' + this.state.post_id + ".png"}`).put(this.state.selectedFileL);
      var uploadTaskR = storageRef.child(`images/${'right_' + + this.state.post_id + ".png"}`).put(this.state.selectedFileR);
      uploadTaskL.on('state_changed', (snapshot) => {
      }, (error) => {
        console.log(error);
      }, () => {
        console.log('success left');
        uploadTaskR.on('state_changed', (snapshot) => {
        }, (error) => {
          console.log(error);
        }, () => {
          console.log('success right');
          this.handleFileDownload();
        });
      });
    }
  }

  handleFileDownload = (e) => {
    storageRef.child('images/left_'+ this.state.post_id + '.png').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
    
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element:
      var img = document.getElementById('myimgL');
      img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
    storageRef.child('images/right_'+ this.state.post_id + '.png').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
    
      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    
      // Or inserted into an <img> element:
      var img = document.getElementById('myimgR');
      img.src = url;
    }).catch(function(error) {
      // Handle any errors
    });
  }

  render() {
    this.handleFileUploadSubmit();
    return (
      <div>
        {/* <div>Hello, {this.props.location.username}</div> */}
        <ul className="menu">
          <Link className="menu-item" to={{pathname: "/yourPost", username: this.props.location.username}}>Your Post</Link>
          <Link className="menu-item" to={{pathname: "/vote", username: this.props.location.username}}>Vote</Link>
        </ul>
        <h2>Create post</h2>
        <div className="choice">
          <div>
            <div>
              <input type="file" class="file-select-left" accept="image/*" onChange={this.handleFileUploadChangeL}/>
              <img src="" id="myimgL" />
            </div>
            <div>
              <input type="file" class="file-select-right" accept="image/*" onChange={this.handleFileUploadChangeR}/>
              <img src="" id="myimgR" />
            </div>
          </div>

          {/* <form id="frmUploader" enctype="multipart/form-data" action="/api/Upload/" method="post">
            <input type="file" name="imgUploader" multiple />
            <input type="submit" name="submit" id="btnSubmit" value="Upload" onClick={this.submit}/>
            <img src="/image.png" />
          </form> */}
        </div>
        Period: <input type="number" name="duration"/> mins
        <button type="button" onClick={this.createPost}>create</button>
      </div>
    );
  }
}
export default createPost;