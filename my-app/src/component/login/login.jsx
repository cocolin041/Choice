import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userExist: undefined,
      passwordMatch: false,
      redirectCreatePost: false,
      redirectYourPost: false,
      redirectVote: false
    }
    this.searchUser = this.searchUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.goCreatePost = this.goCreatePost.bind(this);
    this.goYourPost = this.goYourPost.bind(this);
    this.goVote = this.goVote.bind(this);
    this.redirectCreatePost = this.redirectCreatePost.bind(this);
    this.redirectYourPost = this.redirectYourPost.bind(this);
    this.redirectVote = this.redirectVote.bind(this);
    
  }

  searchUser() {
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
            passwordMatch: true
          });
        //password not match
        } else {
          this.setState({
            username: data[0].userName,
            userExist: true,
            passwordMatch: false,
          });
        }
      //user not exist
      } else {
        this.setState({
          userExist: false
        });
        // let alert = document.getElementById("userNotFound");
        // alert.innerText = "user not found";
      }
    });
  };
  createUser() {
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
      console.log(data);
      this.setState({
        username: data.userName,
        userExist: true,
        passwordMatch: true
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

  render() {
    return (
      <div class="user">
        {this.state.userExist === undefined ? (
          <div className="account">
            <div className="login">
              <h2>Login</h2>
              <div><input type="text" name="usernameLogin" placeholder="username" required /></div>
              <div><input type="password" name="passwordLogin" placeholder="password" required /></div>
              <button type="button" onClick={this.searchUser}>login</button>
            </div>

            <div className="login">
              <h2>Don't have an account?</h2>
              <div><input type="text" name="usernameCreate" placeholder="username" required /></div>
              <div><input type="password" name="passwordCreate" placeholder="password" required /></div>
              <button type="button" onClick={this.createUser}>create</button>
            </div>
          </div>
        ) : (
          <div>
            {this.state.userExist ? (
              <div>
                {this.state.passwordMatch ? (
                  <div>
                    <ul className="menu">
                      <li className="menu-item" onClick={this.redirectCreatePost}>Create Post</li>
                      <li className="menu-item" onClick={this.redirectYourPost}>Your Post</li>
                      <li className="menu-item" onClick={this.redirectVote}>Vote</li>
                      <Link className="menu-item" to="/About">About</Link>
                    </ul>
                    <h2>Welcome, {this.state.username}</h2>
                    {this.goCreatePost()}
                    {this.goYourPost()}
                    {this.goVote()}
                    {/* <button type="button" onClick={this.redirectPost}>post</button>
                    <button type="button" onClick={this.redirectVote}>vote</button> */}
                  </div>
                ) : (
                  <div>
                    <h2>Password doesn't match</h2>
                    Username:<input type="text" name="usernameLogin"/>
                    Password:<input type="text" name="passwordLogin"/>
                    <button type="button" onClick={this.searchUser}>login</button>
                  </div>
                )}
              </div>
            ):(
              <div className="login">
                <h2>User not found, don't have an account?</h2>
                <div><input type="text" name="usernameCreate" placeholder="username" required /></div>
                <div><input type="password" name="passwordCreate" placeholder="password" required /></div>
                <button type="button" onClick={this.createUser}>create</button>
              </div>
            )}
            
          </div>
        )}
      </div>
    );
  }
}
export default Login;