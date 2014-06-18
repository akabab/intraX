var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

// here should be the required route files
var index = require('./routes/index');
var user  = require('./routes/user' );
var auths = require('./routes/auths');
var dltnt = require('./routes/dltnt');
var forum = require('./routes/forum');

var app = express();

/*
** View engine setup.
*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("cookie"));
app.use(session());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/auths', auths);

//Redirect to auth if not authenticed
/*app.all("*", function(req, res, next) {
  if (req.session && req.session['logged'])
    next();
  else {
    console.log(req.url);
    res.redirect('/auths');
  }
});*/

app.use('/', index);
app.use('/user', user);
app.use('/forum', forum);
app.use('/dltnt', dltnt);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*
** error handlers
*/

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
var easymongo        = require("easymongo");
var mongo            = new easymongo({dbname: "db"});
var accounts         = mongo.collection("accounts");

accounts_topic_old({'idAccounts': '539c704ab4d99eed376a5153', 'idTopic': 'test2'});
*/

module.exports = app;
