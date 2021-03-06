'use strict'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var mongoose = require("mongoose");
var Category = require("./models/challenge_category.js");
var Challenge = require("./models/challenge.js");

mongoose.connect("mongodb://localhost/JavaLearningTool", {
  useMongoClient: true
});
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

Category.count({}, function(err, count) {
  if (count == 0) {
    let cat = Category({ title: "Basic Skills" });
    cat.save();
  }
});

Challenge.count({}, function(err, count) {
  if (count == 0) {
    let chall = Challenge({
      name: "Hello World",
      description: 'Print out "Hello World" with a new line at the end.',
      difficulty: 1.0,
      defaultText:
        'public class Test {\n    public static void main(String[] args) {\n        // Print out "Hello World" here\n    }\n}'
    });
    chall.save();
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/prod')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
