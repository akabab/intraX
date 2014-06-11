'use strict';

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var easymongo = require('easymongo');
var ldap = require('ldapjs');
var mongo = new easymongo({dbname: 'db'});
var accountsDB = mongo.collection('accounts');


var D_ERR_AUTHS_EMPTY     = "Empty informations";
var D_ERR_AUTHS_FINDNO    = "Account doesn't exist";
var D_ERR_AUTHS_WRONGPWD  = "Invalid password";
var D_ERR_AUTHS_TIMEFORCE = "Sorry, try to see this page more later.";


//Render Authentication page
router.get('/', function (req, res) {
  res.render('auths', {title: 'Authentication'});
});

function connectToLdap(login, password, req, res) {
  var dn = 'uid=' + login + ',ou=2013,ou=people,dc=42,dc=fr';
  req.session.account['ldap'] = {"dn": dn, "password": password};
  var client = ldap.createClient( {url: 'ldaps://ldap.42.fr:636'} );

  client.bind(req.session.account.ldap.dn, req.session.account.ldap.password, function (err) {
    if (err) {
      console.log("ldap bind err: " + err);
      //CONNECT WITHOUT LDAP
      req.session.account['firstName'] = login;
      req.session.account['lastName']  = "[noLdap]";
      req.session.account['uid']       = "uid";

      accountsDB.find( {"login": login}, function (err, result) {
        if (!result.length) {
          res.json( {err: D_ERR_AUTHS_FINDNO} );
          return;
        }

        for (var i = 0; i < result.length; i++) {
          var account = result[i];
          if (bcrypt.compareSync(password, account['password'])) {
            req.session.account['password'] = account['password']
            req.session.account['accessRights'] = account['accessRights'];
            req.session.account['_id'] = account['_id'];
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
        req.session.account['firstName']    = entry.object['first-name'];
        req.session.account['lastName']     = entry.object['last-name'];
        req.session.account['uid']          = entry.object['uid'];

        accountsDB.find( {"login": login}, function (err, result) {
          if (!result.length) {
          //User not in database -> create new entry && log
            var pwd = bcrypt.hashSync(password);
            accountsDB.save( {'login': login,
                              'password': pwd,
                              'firstName': entry.object['first-name'],
                              'lastName': entry.object['last-name'],
                              'uid': entry.object['uid'],
                              'dateOfCreation': Date.now(),
                              'accessRights': 0}, function (error, result) {
              req.session.account['password'] = pwd;
              req.session.account['accessRights'] = 0;
              req.session.account['_id'] = result['_id'];
              req.session['logged'] = true;
              res.json( {err: null} );
            });
            return;
          }
          //User already exists in database
          for (var i = 0; i < result.length; i++) {
            var account = result[i];
            if (!bcrypt.compareSync(password, account['password'])) {
              account['password'] = bcrypt.hashSync(password);
              accountsDB.update({_id: account._id}, {$set: {password: account['password']}});
            }
            req.session.account['password'] = account['password'];
            req.session.account['accessRights'] = account['accessRights'];
            req.session.account['_id'] = account['_id'];
            req.session['logged'] = true;
            res.json( {err: null} );
            return;
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

//Signin via authentication page
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

    connectToLdap(login, password, req, res);

    return;
  }
});

//Get current autologin token
router.post('/autologin/get', function (req, res) {
  if (!req.body.password) {
    return res.json( {err: D_ERR_AUTHS_EMPTY} );
  }
  var password = req.body.password;
  if (bcrypt.compareSync(password, req.session.account['password'])) {
    accountsDB.find({'password': req.session.account.password}, function (err, result) {
      if (result.length) {
        if (!result[0].autologin) {
          res.json( {err: null, 'token': null} );
        }
        else {
          res.json( {err: null, 'token': result[0].autologin} );
        }
      }
    });
  }
  else
    res.json( {err: D_ERR_AUTHS_WRONGPWD} );
});

//Generate new autologin token
router.post('/autologin/new', function (req, res) {
  if (!req.body.password) {
    return res.json( {err: D_ERR_AUTHS_EMPTY} );
  }
  var password = req.body.password;
  if (bcrypt.compareSync(password, req.session.account['password'])) {
    crypto.randomBytes(16, function (ex, buf) {
      var token = buf.toString('hex');
      accountsDB.update({'password': req.session.account.password}, {$set: {'autologin': token}});
      res.json( {err: null, 'token': token} );
    });
  }
  else
    res.json( {err: D_ERR_AUTHS_WRONGPWD} );
});

//Delete current autologin token
router.post('/autologin/del', function (req, res) {
  if (!req.body.password) {
    return res.json( {err: D_ERR_AUTHS_EMPTY} );
  }
  var password = req.body.password;
  if (bcrypt.compareSync(password, req.session.account['password'])) {
      accountsDB.update({'password': req.session.account.password}, {$set: {'autologin': null}});
      res.json( {err: null, 'token': null} );
  }
  else
    res.json( {err: D_ERR_AUTHS_WRONGPWD} );
});

//Connect via autologin token
router.get('/autologin/:token', function (req, res) {
  var token = req.params.token;
  accountsDB.find({'autologin': token}, function (err, result) {
    if (!result.length)
      return res.redirect('/auths');
    req.session.account = result[0];
    req.session['logged'] = true;
    res.redirect('/');
  });
});



module.exports = router;
