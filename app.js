var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');

var routes = require('./routes/index');

// here should be the required route files
var users = require('./routes/users');
var redirect = require('./routes/redirect');
var auths = require('./routes/auths');
var dltnt = require('./routes/dltnt');
var tldap = require('./routes/tldap');

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
app.use(cookieParser("suce mes bools"));
app.use(session());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/auths', auths);
app.use('/dltnt', dltnt);
app.use('/tldap', tldap);

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

/*var bcrypt = require('bcrypt-nodejs');
var hash = bcrypt.hashSync("bacon");
console.log(hash);

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accounts = mongo.collection('accounts');

accounts.save({login: 'cdenis', password: bcrypt.hashSync('cdenis'), dateOfCreation: Date.now(), accessRights: 5});
accounts.save({login: 'ycribier', password: bcrypt.hashSync('ycribier'), dateOfCreation: Date.now(), accessRights: 5});
accounts.find({}, function(error, results) {
  console.log(results);
});*/

/* end */
module.exports = app;
