
'use strict';

var express = require('express');
//var model = require('../model/model_auths');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accounts = mongo.collection('accounts');

/* 00.
** All object is the error message according to context.
*/

Object.defineProperty(this, 'D_ERR_AUTHS_EMPTY',
{
  value: 'please, enter a authentication.',
  writable: false
});

var D_ERR_AUTHS_FINDNO = 'please, enter a correct login or password.';

// If hack:
Object.defineProperty(this, 'D_ERR_AUTHS_TIMEFORCE',
{
  value: 'sorry, try to see this page more later.',
  writable: false
});

/* 01.
** The function returns void and runs a action according to
** the success to authentication.
*/

function initSession(session, account) {
  session['account'] = account;
  session['logged'] = true;
}

function auths_connect(argument, req, res) {
  'use strict';

  accounts.find({login: argument['login']}, function(error, results) {
    'use strict';
    var len = results.length;
    if (!len) {
      res.end('Impossible to find account');
      return;
    }

    for (var i = 0; i < len; i++) {
      if (bcrypt.compareSync(argument.password, results[i]['password'])) {
        initSession(req.session, results[i]);
        res.end('true');
        return;
      }
    };
    res.end('Impossible to match password and account');
    return;
  });
  return;
}

/* 02.
** The root loads the first page -GET-.
*/

router.get('/', function (req, res) {
  res.render('auths', {title: 'Authentication'});
});

/* 03.
** The root loads all after pages -POST-.
*/

//!! Warning, this code is not protected of the brute force.

router.post('/signin', function (req, res) {
  if (!req.body.password || !req.body.login) {
    return (res.end(D_ERR_AUTHS_EMPTY));
  }
  else {
    auths_connect({'login': req.body.login.toLowerCase(),
                    'password': req.body.password}, req, res);
  }
});

module.exports = router;
