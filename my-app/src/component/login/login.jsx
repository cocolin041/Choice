import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// import Post from '../post/post.jsx'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userExist: undefined,
      passwordMatch: false
    }
    this.searchUser = this.searchUser.bind(this);
    this.createUser = this.createUser.bind(this);
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
        console.log(data);
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

  render() {
    return (
      <div class="user">
        {this.state.userExist === undefined ? (
          <div>
            <div>
              <h2>Login</h2>
              Username:<input type="text" name="usernameLogin"/>
              Password:<input type="text" name="passwordLogin"/>
              <button type="button" onClick={this.searchUser}>login</button>
            </div>

            <div>
              <h2>Don't have an account?</h2>
              create Username:<input type="text" name="usernameCreate"/>
              create password:<input type="text" name="passwordCreate"/>
              <button type="button" onClick={this.createUser}>create</button>
            </div>
          </div>
        ) : (
          <div>
            {this.state.userExist ? (
              <div>
                {this.state.passwordMatch ? (
                  <Redirect to={{pathname: "/post", username: this.state.username}} />
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
              <div>
                <h2>User Not Found</h2>
                create Username:<input type="text" name="usernameCreate"/>
                create password:<input type="text" name="passwordCreate"/>
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