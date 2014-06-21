var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

// here should be the required route files
var index     = require('./routes/index');
var user      = require('./routes/user' );
var auths     = require('./routes/auths');
var dltnt     = require('./routes/dltnt');
var forum     = require('./routes/forum');
var ldap      = require('./routes/ldap');
var modules   = require('./routes/modules');
var inbox     = require('./routes/inbox');

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
app.use('/ldap', ldap);

// Redirect to auth if not authenticed
app.all("*", function(req, res, next) {
  if (req.session && req.session['logged'])
    next();
  else {
    res.redirect('/auths');
  }
});

app.use('/', index);
app.use('/user', user);
app.use('/forum', forum);
app.use('/inbox', inbox);
app.use('/dltnt', dltnt);
app.use('/modules', modules);

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

module.exports = app;
