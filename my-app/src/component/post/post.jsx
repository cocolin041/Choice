import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import './post.css';

class YourPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      posts: []
    }
    this.connecToServer = this.connecToServer.bind(this);
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
            id: data.post_id,
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
      fetch('/voteResult/' + p.id, {
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
          let postIdx = posts.findIndex(x => x.id === p.id);
          posts[postIdx].voteLeft = left / (left + right);
          posts[postIdx].voteRight = right / (left + right);
          this.setState({posts: posts});
        }
      })
    })
    
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
          <div>
            {this.state.posts.map(p => 
              <table>
                <tr>
                  <th>{p.left}</th>
                  <th>{p.right}</th> 
                </tr>
                <tr>
                  <td>{p.voteLeft}</td>
                  <td>{p.voteRight}</td>
                </tr>
              </table>
            )}
          </div>
        ):(
          <div>No post yet</div>
        )}
      </div>
    );
  }
}
export default YourPost;