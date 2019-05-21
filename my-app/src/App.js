import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from './component/login/login.jsx';
import YourPost from './component/post/post.jsx';
import createPost from './component/createPost/createPost.jsx';
import Vote from './component/vote/vote.jsx';
import About from './component/about/about.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={About}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/vote" component={Vote}/>
          <Route exact path="/yourPost" component={YourPost}/>
          <Route exact path="/createPost" component={createPost}/>
        </Switch>
      </Router>
    );
  }
}
export default App;