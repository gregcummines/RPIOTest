var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rpio = require('rpio');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/pin', function (req, res) {
  var pin = +req.query.id;
  let value = rpio.read(pin);
  console.log(`Reading pin ${pin}: ${value}...`);
  res.send({ pin: pin, value: value});
});

app.post('/pin', function (req, res) {
  const value = (+req.body.value) ? rpio.HIGH : rpio.LOW;
  const pin = +req.body.id;
  console.log(`Setting pin ${pin} to ${value}...`);
  rpio.write(req.body.id, value);
  res.send({ pin: pin, value: +req.body.value});
});


app.post('/', function(req, res) {
  console.log(req.body.name);
  res.send(req.body);  
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

rpio.open(40, rpio.OUTPUT, rpio.LOW);
rpio.open(36, rpio.OUTPUT, rpio.LOW);


module.exports = app;
