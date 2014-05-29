// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   auths.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: adjivas <adjivas@student.42.fr>            +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2014/05/24 20:24:00 by adjivas           #+#    #+#             //
//   Updated: 2014/05/24 20:24:03 by adjivas          ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

'use strict';

var express = require('express');
//var model = require('../model/model_auths');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accounts = mongo.collection('accounts');

Array.prototype.pst_next = function() {
  return (this[++this.current]);
};
Array.prototype.pst_prev = function() {
  return (this[--this.current]);
};
Array.prototype.pre_next = function() {
  return (this[this.current++]);
};
Array.prototype.pre_prev = function() {
  return (this[this.current--]);
};
Array.prototype.current = 0;

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

//! The work is not finish.

function initSession(session, account) {
  session['account'] = account;
  session['logged'] = true;
}

function auths_connect(argument, req, res) {
  'use strict';
  console.log(argument);
  accounts.find({login: argument['login']}, function(error, results) {
    'use strict';
    var account;

    while ((account = results.pre_next()))
      if (bcrypt.compareSync(argument.password, account['password'])) {
        initSession(req.session, account);
        res.redirect('index', {"account": account});
        return;
      }
    res.end('false');
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
