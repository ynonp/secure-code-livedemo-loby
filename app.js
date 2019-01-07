const mongoose = require('mongoose');
const passport = require('passport');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  secret: 'ninja',
}));


app.use(passport.initialize());
app.use(passport.session());

const sessionsRouter = require('./routes/sessions');
const registrationsRouter = require('./routes/registrations');
const itemsRouter = require('./routes/items');

require('./init/passport');

app.use(function(req, res, next) {
  console.log(req.user);
  if (req.user) {
    console.log('----');
    res.locals.user = req.user;
  }

  next();
});

app.use('/items', itemsRouter);
app.use('/sessions', sessionsRouter);
app.use('/registrations', registrationsRouter);
app.use('/', function(req, res, next) {
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
