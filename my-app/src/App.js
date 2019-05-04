import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from './component/login/login.jsx';
import YourPost from './component/post/post.jsx';
import createPost from './component/createPost/createPost.jsx';
import Vote from './component/vote/vote.jsx';
import About from './component/about/about.jsx';

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

  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  render() {
    return (
      // <div class="g-signin2" data-onsuccess="onSignIn"></div>
      <Router>
        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/About" component={About}/>
          <Route exact path="/vote" component={Vote}/>
          <Route exact path="/yourPost" component={YourPost}/>
          <Route exact path="/createPost" component={createPost}/>
        </Switch>
      </Router>
    );
  }
}
export default App;