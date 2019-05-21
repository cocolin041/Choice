import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './login.css';
import logo from '../../logo.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userExist: undefined,
      passwordMatch: false,
      redirectCreatePost: false,
      redirectYourPost: false,
      redirectVote: false,
      isLoggedIn: false
    }
    this.searchUser = this.searchUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.goCreatePost = this.goCreatePost.bind(this);
    this.goYourPost = this.goYourPost.bind(this);
    this.goVote = this.goVote.bind(this);
    this.redirectCreatePost = this.redirectCreatePost.bind(this);
    this.redirectYourPost = this.redirectYourPost.bind(this);
    this.redirectVote = this.redirectVote.bind(this);
    this.logout = this.logout.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }

  // Login
  searchUser() {
    if (!this.props.location.isLoggedIn) {
      this.props.location.isLoggedIn = undefined;
    }
    let username = document.querySelector("input[name='usernameLogin']");
    let password = document.querySelector("input[name='passwordLogin']");
    username = username.value;
    password = password.value;

    fetch('/user/' + username ,{
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      //user exist
      if (data.length > 0) {
        //password match
        if (data[0].password === password) {
          this.setState({
            username: data[0].userName,
            userExist: true,
            passwordMatch: true,
            isLoggedIn: true
          });
        //password not match
        } else {
          this.setState({
            username: data[0].userName,
            userExist: true,
            passwordMatch: false,
            isLoggedIn: false
          });
          // show warning message of password wrong
          let password_warn = document.getElementById("password-warn");
          password_warn.style.display = "block";
        }
      //user not exist
      } else {
        this.setState({
          userExist: false,
          isLoggedIn: false
        });
        // show warning message of user doesn't exist
        let user_warn = document.getElementById("user-warn");
        user_warn.style.display = "block";
      }
    });
  };

  // Create user account
  createUser() {
    if (!this.props.location.isLoggedIn) {
      this.props.location.isLoggedIn = undefined;
    }
    let username = document.querySelector("input[name='usernameCreate']");
    let password = document.querySelector("input[name='passwordCreate']");
    username = username.value;
    password = password.value;

    fetch('/user' ,{
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userName: username,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        username: data.userName,
        userExist: true,
        passwordMatch: true,
        isLoggedIn: true
      })
    });
  };
  redirectCreatePost = () => {
    this.setState({redirectCreatePost: true});
  }
  redirectYourPost = () => {
    this.setState({redirectYourPost: true});
  }
  redirectVote = () => {
    this.setState({redirectVote: true});
  }
  goCreatePost = () => {
    if (this.state.redirectCreatePost) {
      return <Redirect to={{pathname: '/createPost', username: this.state.username}} />
    }
  }
  goYourPost = () => {
    if (this.state.redirectYourPost) {
      return <Redirect to={{pathname: '/yourPost', username: this.state.username}} />
    }
  }
  goVote = () => {
    if (this.state.redirectVote) {
      return <Redirect to={{pathname: '/vote', username: this.state.username}} />
    }
  }
  logout = () => {
    this.setState({isLoggedIn: false});
  }

  renderLogin = () => {
    if (this.props.location.isLoggedIn !== undefined) {
      if (this.props.location.isLoggedIn !== this.state.isLoggedIn) {
        this.setState({isLoggedIn: this.props.location.isLoggedIn});
      }
    }
  }

  render() {
    this.renderLogin();
    return (
      <div class="user">
      {/* before login */}
        {!this.state.isLoggedIn ? (
          <div>
            <div className="menu">
              <div className="logo"><img src={logo} alt="logo"/></div>
              <div>
                <Link className="menu-item" to="/">About</Link>  
              </div>
            </div>
            <div className="account">
              <div className="login">
                <h2>Login</h2>
                <div><input type="text" name="usernameLogin" placeholder="username" required /></div>
                <div><input type="password" name="passwordLogin" placeholder="password" required /></div>
                <div id="password-warn">Password Wrong</div>
                <div id="user-warn">User doesn't exist</div>
                <button type="button" onClick={this.searchUser}>Login</button>
              </div>

              <div className="login">
                <h2>Don't have an account?</h2>
                <div><input type="text" name="usernameCreate" placeholder="username" required /></div>
                <div><input type="password" name="passwordCreate" placeholder="password" required /></div>
                <button type="button" onClick={this.createUser}>create</button>
              </div>
            </div>
          </div>
        ) : (
          // successfully login
          <div>
            <div className="menu">
              <div className="logo"><img src={logo} alt="logo"/></div>
              <div>
                <Link className="menu-item" to={{pathname: '/createPost', username: this.state.username}} >Create Post</Link>
                <Link className="menu-item" to={{pathname: '/yourPost', username: this.state.username}}>Your Post</Link>
                <Link className="menu-item" to={{pathname: '/vote', username: this.state.username}}>Vote</Link>
                <Link className="menu-item" to={{pathname: "/", state: {isLoggedIn: true, username: this.state.username}}}>About</Link>
                <span className="menu-item" onClick={this.logout}>Logout</span>
              </div>
            </div>
            <h2>Welcome, {this.state.username}</h2>
            {this.goCreatePost()}
            {this.goYourPost()}
            {this.goVote()}
          </div>
        )}
      </div>
    );
  }
}
export default Login;