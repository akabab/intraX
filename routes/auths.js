
'use strict';

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accounts = mongo.collection('accounts');
var ldap = require('ldapjs');
var clients = {};

router.get('/', function (req, res) {
  var uid = 'cdenis';
  var login = 'adjivas';
  var password = 'fccjnw';
  var infos = {
    "uid": uid,
    "login": login,
    "password": password,
    "req": req,
    "res": res 
  };
});

module.exports = router;

/* 00.
** All object is the error message according to context.
*/

var D_ERR_AUTHS_EMPTY = 'please, enter a authentication.';
var D_ERR_AUTHS_FINDNO = 'please, enter a correct login or password.';
var D_ERR_AUTHS_TIMEFORCE = 'sorry, try to see this page more later.';

/* 01.
** The function returns void and runs a action according to
** the success to authentication.
*/

function getLdap(account) {
  if (account && clients.hasOwnProperty(account._id))
    return (clients[account._id]);
  var client;
  client = ldap.createClient({url: 'ldaps://ldap.42.fr:636'});
  client.bind(account.ldapAccess.login, account.ldapAccess.password, function (err) { if (err) console.log(err); });
  clients[account._id] = client;
  return (client);
}

function initSession(session, account, password, dn) {
  account['ldapAccess'] = {"login":dn, "password": password};
  session['account'] = account;
  session['logged'] = true;
  return account;
}

function auths_connect(req, res) {
  var login = req.body.login.toLowerCase();
  var password = req.body.password;
  accounts.find({"login": login}, function(error, results) {
    var len = results.length;
    if (!len) {
      res.end('Impossible to find account');
      return;
    }
    for (var i = 0; i < len; i++) {
      if (bcrypt.compareSync(password, results[i]['password'])) {
        var dn = 'uid=' + login + ',ou=2013,ou=people,dc=42,dc=fr';
        var client = getLdap(initSession(req.session, results[i], password, dn));
        var opts = {
          "attributes": ['uid', 'uidNumber', 'first-name', 'last-name'],
          "filter":'!(close=non admis)',
          "scope": 'sub'
        };
        client.search(dn, opts, function (err, result) {
          if (err) { console.log(err); return; }
          result.on('searchEntry', function(entry) {
            req.session.account['name'] = entry.object['first-name'];
            req.session.account['surname'] = entry.object['last-name'];
            res.end('true');
          });
          result.on('searchReference', function(referral) { console.log('referral: ' + referral.uris.join()); });
          result.on('error', function(err) { console.error('error: ' + err.message); });
          result.on('end', function(result) { console.log('status: ' + result.status); });
        });
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
    auths_connect(req, res);
  }
});

module.exports = router;
