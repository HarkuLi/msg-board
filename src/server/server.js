var path = require('path');
var express = require('express');
var serverStatic = require('serve-static');
var myboard = require("../../public/js/myboard.js");
var userDB = require("../../public/js/userDB.js");
var bodyParser = require("body-parser");
var cookie = require('cookie');
var escapeHtml = require('escape-html');
const myIP = require('my-ip');

var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(serverStatic(path.resolve(__dirname, '../../public')));
//static linking

app.get("/", function (req, res) {
  var POSTS = {};
  var user = getUser(req);

  myboard.getPostList((list)=>{
    POSTS.user = user;
    POSTS.post_lists = list;
    res.render("pages/index", POSTS);
  });
});

app.get("/redirect", function(req, res){
  setTimeout(()=>{
    res.redirect("/");
  }, 150);
});

app.get("/serverIP", function(req, res){
  var serverIP = myIP();
  res.send(serverIP);
});

app.get("/login", function (req, res) {
  res.render("pages/login");
});

app.post("/login_action", function (req, res) { //////need to add error input handle
  var name = req.body.name;
  var pw = req.body.pw;

  userDB.getUserByName(name, (userData)=>{
    if(userData && (pw === userData.pw)){
      res.setHeader('Set-Cookie', cookie.serialize('user', name, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7 // 1 week 
      }));
    }
    else{
      //wrong user name or password
    }
    res.redirect("/");///////////in cbfn?
  });
});

app.post("/log_out", function(req, res){
  var user = getUser(req);
  res.setHeader('Set-Cookie', cookie.serialize('user', user, {
    httpOnly: true,
    maxAge: 0.1, // 0.1 second
  }));
  res.redirect("/redirect");
});

app.get("/signup", function (req, res) {
  res.render("pages/signup");
});

app.post("/signup_action", function (req, res) { //////need to add error input handle
  var name = req.body.name;
  var pw = req.body.pw;

  if(name && pw){
    userDB.getUserByName(name, (userData)=>{
      if(!userData){
        userDB.newUser({
                      name,
                      pw,
                    });
      }
      else{
        //repeated user name
      }
      res.redirect("/");
    });
  }
  else{
    res.redirect("/signup");
  }
});

app.post("/new_post", function(req, res) {
  var user = getUser(req);
  if(user)
    res.render("pages/new_post");
  else
    res.redirect("/");
});

app.post("/do_post", function(req, res) {
  var user = getUser(req);
  if(user)
  {
    let current_time = new Date(Date.now());
    let data =
    {
        title: req.body.title,
        content: req.body.content,
        author: user,
        posted_time: current_time,
        comments: [],
    };
    myboard.newPost(data);  /////should it redirect in callback?
  }
  res.redirect("/");
});

app.post("/edit", function(req, res){
  myboard.getPostByID(req.body.id, (post)=>{
    res.render("pages/edit", post);
  });
});

app.post("/do_edit", function(req, res) {
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  let updateData = {
                      title,
                      content,
                   };
  myboard.editByID(id, updateData);
  res.redirect("/");
});

app.post("/delete", function(req, res){
  myboard.remove(req.body.id);
  res.redirect("/");
});

function getUser(req){
  var cookies, user;
  if(req.headers.cookie)
  {
    cookies = cookie.parse(req.headers.cookie);
    user = cookies.user;
  }
  return user;
}

app.listen(3000);