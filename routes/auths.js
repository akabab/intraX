'use strict';

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accountsDB = mongo.collection('accounts');
var ldap = require('ldapjs');
var ldapClients = {};



function getLdap(account) {
  if (account && ldapClients.hasOwnProperty(account._id))
    return (ldapClients[account._id]);
  var client = ldap.createClient( {url: 'ldaps://ldap.42.fr:636'} );
  client.bind(account.ldapAccess.dn, account.ldapAccess.password, function (err) {
    if (err)
      console.log(err);
  });
  ldapClients[account._id] = client;
  return (client);
}

function connectToLdap(login, password, session) {
  var dn = 'uid=' + login + ',ou=2013,ou=people,dc=42,dc=fr';
  session.account['ldapAccess'] = {"dn": dn, "password": password};
  var client = getLdap(session.account);
  var opts = {
    "attributes": ['uid', 'uidNumber', 'first-name', 'last-name'],
    "filter":'!(close=non admis)',
    "scope": 'sub'
  };
  client.search(dn, opts, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    result.on('searchEntry', function(entry) {
      session.account['name'] = entry.object['first-name'];
      session.account['surname'] = entry.object['last-name'];
    });
    result.on('searchReference', function (referral) { console.log('referral: ' + referral.uris.join()); });
    result.on('error', function (err) { console.error('error: ' + err.message); });
    result.on('end', function (result) { console.log('status: ' + result.status); });
  });
}


router.get('/', function (req, res) {
  res.render('auths', {title: 'Authentication'});
});



var D_ERR_AUTHS_EMPTY = "Empty informations";
var D_ERR_AUTHS_FINDNO = "Account doesn't exist";
var D_ERR_AUTHS_WRONGPWD = "Password doesn't match";
var D_ERR_AUTHS_TIMEFORCE = "Sorry, try to see this page more later.";

router.post('/signin', function (req, res) {
  if (!req.body.password || !req.body.login) {
    return (res.end(D_ERR_AUTHS_EMPTY));
  }
  else {
    var login = req.body.login.toLowerCase();
    var password = req.body.password;
    accountsDB.find( {"login": login}, function (err, result) {
      if (result.length == null)
        res.json( {err: D_ERR_AUTHS_FINDNO} );
      for (var i = 0; i < result.length; i++) {
        var account = result[i];
        if (bcrypt.compareSync(password, account['password'])) {
          res.json( {err: null} );
          req.session['account'] = account;
          req.session['logged'] = true;
          //LDAP binding
          connectToLdap(login, password, req.session);
        }
      }
      res.json( {err: D_ERR_AUTHS_WRONGPWD} );
    });
  }
});

module.exports = router;
