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

Object.defineProperty(this, 'D_ERR_AUTHS_FINDNO',
{
  value: 'please, enter a correct login or password.',
  writable: false
});

// If hack:
Object.defineProperty(this, 'D_ERR_AUTHS_TIMEFORCE',
{
  value: '',
  writable: false
});

/* 01.
** The function returns void and runs a action according to
** the success to authentication.
*/

//! The work is not finish.

function  ft_model_auths(argument) {
  'use strict';
  var account;

  return (accounts.find({login: argument['login']}, function(error, results) {
    while ((account = results.pre_next())) {
      if (bcrypt.compareSync(argument['password'], account['password'])) {
        console.log(account['accessRights']);
        return (true);
      }
    }
    console.log(D_ERR_AUTHS_FINDNO);
    return (false);
  }));
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

//!! Warning, this code is not protected with the brute force.

router.post('/signin', function (req, res) {
  if (!req.body.password || !req.body.login) {
    console.log('here');
    return (res.send(D_ERR_AUTHS_EMPTY));
  }
  else {
    console.log(req.body.login, req.body.password);
    res.end('GOOD');
/*    return (ft_model_auths({'login': req.body.login.toLowerCase(),
                            'password': req.body.password}));*/
  }
});

/*router.post('/', function (req, res) {

  var now = new Date(Date.now()).getTime();

  if ((req.session.tryCount += 1)
    && req.session.tryCount <= 3) {
    req.session.lastTryTimeout = now + 60000;
    return (res.send(D_ERR_AUTHS_TIMEFORCE));
  }

  var timeLeft = req.session.lastTryTimeout - now;
  req.session.lastTryTimeout = now + 60000;
  if (timeLeft > 1) {
    req.session.tryCount = 1;
  }
  if (!req.body.password || !req.body.login) {
    return (res.send(D_ERR_AUTHS_EMPTY));
  } else {
    ft_model_auths({'login': req.body.login.toLowerCase(),
                    'password': req.body.password});
  }
});*/

module.exports = router;
