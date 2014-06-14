'use strict';

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var easymongo = require('easymongo');
var mongo = new easymongo({dbname: 'db'});
var accountsDB = mongo.collection('accounts');
var ldap = require('ldapjs');
var ldapClients = {};

var D_ERR_AUTHS_EMPTY = "Empty informations";
var D_ERR_AUTHS_FINDNO = "Account doesn't exist";
var D_ERR_AUTHS_WRONGPWD = "Invalid password";
var D_ERR_AUTHS_TIMEFORCE = "Sorry, try to see this page more later.";


function connectToLdap(login, password, req, res) {
  var dn = 'uid=' + login + ',ou=2013,ou=people,dc=42,dc=fr';
  req.session.account['ldap'] = {"dn": dn, "password": password};
  var client = ldap.createClient( {url: 'ldaps://ldap.42.fr:636'} );//ldapGetClient(account);

  //BIND
  client.bind(req.session.account.ldap.dn, req.session.account.ldap.password, function (err) {
    if (err) {
      console.log("ldap bind err: " + err);
      //CONNECT WITHOUT LDAP
      req.session.account['firstName'] = login;
      req.session.account['lastName']  = "[noLdap]";

      accountsDB.find( {"login": login}, function (err, result) {
        if (!result.length) {
          res.json( {err: D_ERR_AUTHS_FINDNO} );
          return;
        }

        for (var i = 0; i < result.length; i++) {
          var account = result[i];
          if (bcrypt.compareSync(password, account['password'])) {
              // req.session['account'] = account;
            req.session['logged'] = true;
            res.json( {err: null} );
            return;
          }
        }
        res.json( {err: D_ERR_AUTHS_WRONGPWD} );
      });
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
        //ABLE TO CONNECT
        req.session.account['firstName'] = entry.object['first-name'];
        req.session.account['lastName']  = entry.object['last-name'];
        //DB check
        accountsDB.find( {"login": login}, function (err, result) {
          if (!result.length) {
            //Not in db
            accountsDB.save( {login: login,
                              password: bcrypt.hashSync(password),
                              dateOfCreation: Date.now(),
                              accessRights: 0,
                              topicSeeNot: []} );
            req.session['logged'] = true;
            res.json( {err: null} );
            return;
          }

          for (var i = 0; i < result.length; i++) {
            var account = result[i];
            if (bcrypt.compareSync(password, account['password'])) {
                // req.session['account'] = account;
              req.session['logged'] = true;
              res.json( {err: null} );
              return;
            }
          }
          res.json( {err: D_ERR_AUTHS_WRONGPWD} );
        });
      });

      result.on('searchReference', function (referral) {
        console.log('referral: ' + referral.uris.join());
      });

      result.on('error', function (err) {
        console.error('error: ' + err.message);
      });

      result.on('end', function (result) {
        console.log('status: ' + result.status);
        client.unbind(function (err) {});
      });

    });
  });
}


router.get('/', function (req, res) {
  res.render('auths', {title: 'Authentication'});
});

router.post('/signin', function (req, res) {
  if (!req.body.password || !req.body.login) {
    return res.json( {err: D_ERR_AUTHS_EMPTY} );
  }
  else {
    var login = req.body.login.toLowerCase();
    var password = req.body.password;

    if (!req.session['account']) {
      req.session['account'] = {};
    }
    //connect to ldap
    connectToLdap(login, password, req, res);
    return;
  }
});

module.exports = router;
