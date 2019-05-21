import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './about.css';
import logo from '../../logo.png';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
    this.renderLogin = this.renderLogin.bind(this);
  }
  renderLogin = () => {
    if (this.props.location.state !== undefined) {
      if (this.props.location.state.isLoggedIn !== this.state.isLoggedIn) {
        this.setState({isLoggedIn: this.props.location.state.isLoggedIn});
      }
    }
  }

  render() {
    this.renderLogin();
    return (
      <div>
        {!this.state.isLoggedIn ? (
          <div className="menu">
            <div className="logo"><img src={logo} alt="logo"/></div>
            <div>
              <Link className="menu-item" to="/login">Login</Link>  
            </div>
          </div>
        ):(
          <div className="menu">
            <div className="logo"><img src={logo} alt="logo"/></div>
            <div>
              <Link className="menu-item" to={{pathname: "/createPost", username: this.props.location.state.username}}>Create Post</Link>
              <Link className="menu-item" to={{pathname: "/yourPost", username: this.props.location.state.username}}>Your Post</Link>
              <Link className="menu-item" to={{pathname: "/vote", username: this.props.location.state.username}}>Vote</Link>
              <Link className="menu-item" to={{pathname: "/login", isLoggedIn: false}}>Logout</Link>  
            </div>
          </div>
        )}
        <h2>Welcome to Choice!</h2>
        <h3>Login to make choices for others, or post your own choices</h3>
      </div>
    )
  }
}
export default About;