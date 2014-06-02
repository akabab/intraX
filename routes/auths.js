'use strict';

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accountsDB = mongo.collection('accounts');
var ldap = require('ldapjs');
var ldapClients = {};


function ldapGetClient(account) {
  var client = {};

  if (account && ldapClients.hasOwnProperty(account._id)) {
    client = ldapClients[account._id];
  }
  else {
    client = ldap.createClient( {url: 'ldaps://ldap.42.fr:636', maxConnections: 2000} );
    ldapClients[account._id] = client;
  }
  return (client);
}

function connectToLdap(login, password, req, res) {
  var dn = 'uid=' + login + ',ou=2013,ou=people,dc=42,dc=fr';
  var account = req.session.account;
  account['ldap'] = {"dn": dn, "password": password};
  var client = ldapGetClient(account);

  //BIND
  client.bind(account.ldap.dn, account.ldap.password, function (err) {
    if (err) {
      console.log("ldap bind err: " + err);
      //CONNECT WITHOUT LDAP
      account['firstName'] = login;
      account['lastName']  = "[noLdap]";
      req.session['logged'] = true;
      res.json( {err: null} );
      return;
    }

    var opts = {
      "attributes": ['uid', 'uidNumber', 'first-name', 'last-name'],
      "filter":'!(close=non admis)',
      "scope": 'sub'
    };

    client.search(dn, opts, function (err, result) {
      if (err) {
        return console.log("ldap search err: " + err);
      }

      result.on('searchEntry', function (entry) {
        account['firstName'] = entry.object['first-name'];
        account['lastName']  = entry.object['last-name'];
        //ABLE TO CONNECT
        req.session['logged'] = true;
        res.json( {err: null} );
      });

      result.on('searchReference', function (referral) {
        console.log('referral: ' + referral.uris.join());
      });

      result.on('error', function (err) {
        console.error('error: ' + err.message);
      });

      result.on('end', function (result) {
        console.log('status: ' + result.status);
      });

    });
  });
}


router.get('/', function (req, res) {
  res.render('auths', {title: 'Authentication'});
});

var D_ERR_AUTHS_EMPTY = "Empty informations";
var D_ERR_AUTHS_FINDNO = "Account doesn't exist";
var D_ERR_AUTHS_WRONGPWD = "Invalid password";
var D_ERR_AUTHS_TIMEFORCE = "Sorry, try to see this page more later.";

router.post('/signin', function (req, res) {
  console.log(req.body);
  if (!req.body.password || !req.body.login) {
    res.json( {err: D_ERR_AUTHS_EMPTY} );
    return;
  }
  else {
    var login = req.body.login.toLowerCase();
    var password = req.body.password;
    accountsDB.find( {"login": login}, function (err, result) {
      if (!result.length) {
        res.json( {err: D_ERR_AUTHS_FINDNO} );
        return;
      }
      for (var i = 0; i < result.length; i++) {
        var account = result[i];
        if (bcrypt.compareSync(password, account['password'])) {
          if (!req.session['account']) {
            req.session['account'] = account;
          }
          //LDAP binding
          //res.json( {err: null, user: {firstName: login, lastName: "[noLdap]"}} );
          connectToLdap(login, password, req, res);
          return;
        }
      }
      res.json( {err: D_ERR_AUTHS_WRONGPWD} );
    });
  }
});

router.get('/logout', function (req, res) {
  // req.session.destroy();
  req.session['logged'] = false;
  // client.unbind();
  res.redirect('/');
});

module.exports = router;
