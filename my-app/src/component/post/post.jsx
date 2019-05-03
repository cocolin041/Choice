import React, { Component } from 'react';
import './post.css';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      posts: []
    }
    this.connecToServer = this.connecToServer.bind(this);
    this.createPost = this.createPost.bind(this);
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

  createPost = () => {
    let left = document.querySelector("input[name='left']");
    let right = document.querySelector("input[name='right']");
    let duration = document.querySelector("input[name='duration']");

    fetch('/post/' + this.state.user_id, {
      method: 'post',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        left: left.value,
        right: right.value,
        duration: duration.value
      })
    })
    .then(res => res.json())
    .then(data => {
      // console.log(data);
    });
  }

  render() {
    return (
      <div>
        <div>Hello, {this.props.location.username}</div>
        <h2>Create post</h2>
        <div className="choice">
          <input type="text" name="left"/>
          <input type="text" name="right"/>
        </div>
        Period: <input type="number" name="duration"/> mins
        <button type="button" onClick={this.createPost}>create</button>

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
export default Post;