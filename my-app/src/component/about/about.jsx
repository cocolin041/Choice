import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './about.css';

class About extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   }
  // }

  render() {
    return (
      <div>
        {/* <ul className="menu">
          <Link className="menu-item" to="/">Login</Link>
        </ul> */}
        <h2>This is a website which ask the public to help you making choice!</h2>
      </div>
    )
  }
}
export default About;