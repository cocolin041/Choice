const express = require('express');
var moment = require('moment');
var mysql = require('mysql');
// var multer = require('multer');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//connect to mysql
var con = mysql.createPool({
  host: "us-cdbr-iron-east-02.cleardb.net",
  database: "heroku_55d31885725360a",
  user: "bcb93c414806a9",
  password: "e6eea2e6",
  connectionLimit : 10
});

//open the cross access
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.static(path.join(__dirname, 'my-app/build')));

//post
app.get('/post', (req, res) => {
  con.query("SELECT * FROM post", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
})
app.get('/post/:user_id', (req, res) => {
  con.query("SELECT * FROM post WHERE user_id = '" + req.params.user_id + "'", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
})
app.post('/post/:user_id', (req, res) => {
  let values = req.body;
  var createTime = new Date();
  var endTime = new Date();
  endTime.setMinutes(createTime.getMinutes() + Number(values.duration));

  createTime =  moment(createTime).format("YYYY-MM-DD HH:mm:ss");
  endTime =  moment(endTime).format("YYYY-MM-DD HH:mm:ss");

  // console.log({
  //   "createTime": createTime,
  //   "endTime": endTime
  // })

  con.query("INSERT INTO post (`user_id`, `left`, `right`, `createTime`, `endTime`) VALUES ('" + 
  req.params.user_id + "', '" + values.left + "', '" + values.right + "', '" + createTime + "', '" + endTime + "');", 
  (err, result) => {
    if (err) throw err;
    res.send({
      createTime: createTime,
      endTime: endTime,
      post_id: result.insertId
    });
  });
})

app.post('/upload/:post_id', (req, res) => {
  let values = req.body;
  con.query("UPDATE post SET post.left = '" + values.left + ".png', post.right = '" + values.right + ".png' WHERE post.post_id = '" + req.params.post_id + "'", 
  (err, result) => {
    if (err) throw err;
    // res.send({
    //   createTime: createTime,
    //   endTime: endTime,
    //   post_id: result.insertId
    // });
  });
})

//user
app.get('/user', (req, res) => {
  con.query("SELECT * FROM user", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
})
app.get('/user/:username', (req, res) => {
  con.query("SELECT * FROM user WHERE userName = '" + req.params.username + "'", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
})

app.post('/user', (req, res) => {
  let values = req.body;
  con.query("INSERT INTO user (userName, password) VALUES ('" + values.userName + "', '" + values.password +  "');", 
  (err, result) => {
    if (err) throw err;
  });
  res.send(values);
})

//vote
app.get('/vote/:user_id', (req, res) => {
  let currentTime = new Date();
  currentTime =  moment(currentTime).format("YYYY-MM-DD HH:mm:ss");
  
  con.query("SELECT * FROM post \
            WHERE post_id NOT IN ( SELECT post_id FROM vote WHERE user_id = '" + req.params.user_id + "')\
            AND endTime > '" + currentTime + "' \
            AND user_id != '" + req.params.user_id + "' \
            LIMIT 1",
  (err, result) => {
    if (err) throw err;
    res.send(result);
    // console.log(result);
  });
})

app.post('/vote/:user_id', (req, res) => {
  let values = req.body;
  con.query("INSERT INTO vote (user_id, post_id, choice) VALUES ('" + 
  req.params.user_id + "', '" + values.post_id + "', '" + values.choice +  "');", 
  (err, result) => {
    if (err) throw err;
  });
  res.send(values);
  // console.log(values);
})

//voteResult
app.get('/voteResult/:post_id', (req, res) => {
  con.query("SELECT * FROM vote WHERE post_id = '" + req.params.post_id + "'",
  (err, result) => {
    if (err) throw err;
    res.send(result);
    // console.log(result);
  });
})


//upload img


//start server
app.listen(port, (req, res) => {
  console.log( `server listening on port: ${port}`);
})