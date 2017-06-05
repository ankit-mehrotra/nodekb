const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
let Articles = require("./models/article");
const config = require("./config/database");
const passport = require("passport");
mongoose.connect(config.database);
let db = mongoose.connection;

db.once("open",function(){
  console.log("Connected to MongoDb");
})
db.on('error',function(error){
  console.log(error);
})
app.set("views",path.join(__dirname,"views"));
app.set("view engine","pug");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,"public")));

//express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//passport config
require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());
//express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

app.get("*",function(req,res,next){
  res.locals.user = req.user || null;
  next();
})
//Home Route
app.get("/",function(req,res){
  Articles.find({},function(err,articles){
    if(err)
    console.log(err);
    else{
      res.render("index",{
        title :"Articles",
        articles:articles
      });
    }
  })

});
//Route Files

let article = require('./routes/article');
let users = require('./routes/users');
app.use("/article", article);
app.use("/users", users);
//Listen Server
app.listen(8080,function(){
  console.log("Server started on port 8080..");
});
