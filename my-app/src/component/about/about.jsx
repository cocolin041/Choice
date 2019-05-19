import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './about.css';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false 
    };
    this.renderLogin = this.renderLogin.bind(this);
  }
  renderLogin = () => {
    if (this.props.location.isLoggedIn !== undefined) {
      this.setState({isLoggedIn: this.props.location.isLoggedIn});
    }
  }

  render() {
    this.renderLogin();
    return (
      <div>
        <ul className="menu">
        {!this.state.isLoggedIn ? (
          <Link className="menu-item" to="/login">Login</Link>
        ):(
          <Link className="menu-item" to={{pathname: "/login", isLoggedIn: false}}>Logout</Link>
        )}
        </ul>
        <h2>Welcome to Choice!</h2>
        <h3>Login to make choices for others, or post your own choices</h3>
      </div>
    )
  }
}
export default About;