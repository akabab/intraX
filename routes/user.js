var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

router.get('/all', function (req, res) {
  var users = [];
  var account = req.session.account;
  var client = ldap.createClient({
    url: "ldaps://ldap.42.fr:636"
  });
  client.bind(account.ldap.dn, account.ldap.password, function (err) {
    if (err) {
      return console.log('Bind err: ' + err);
    }
    var opts = {
      attributes: [
        "uid",
        "uidNumber",
        "first-name",
        "last-name"
        ],
      filter:"!(close=non admis)",
      scope: 'sub'
    };
    client.search('ou=2013,ou=people,dc=42,dc=fr', opts, function (err, result) {
      result.on('searchEntry', function (entry) {
        var user = {
          uid: entry.object['uid'],
          uidNumber: entry.object['uidNumber'],
          firstName: entry.object['first-name'],
          lastName: entry.object['last-name']
        };
        users.push(user);
      });
      result.on('searchReference', function (referral) {
        res.json('referral: ' + referral.uris.join());
      });
      result.on('error', function (err) {
        res.json({error: err.message});
      });
      result.on('end', function (result) {
        res.json( users );
        client.unbind(function (err) {});
      });
    });
  });
});

router.get('/:uid', function (req, res) {
  var uid = req.params.uid;
  var account = req.session.account;
  var client = ldap.createClient({
    url: "ldaps://ldap.42.fr:636"
  });
  client.bind(account.ldap.dn, account.ldap.password, function (err) {
    if (err) {
      return console.log('Bind err: ' + err);
    }
    var opts = {
      attributes: [
        "uid",
        "uidNumber",
        "first-name",
        "last-name",
        "birth-date",
        "mobile-phone"
        ],
      filter:"!(close=non admis)",
      scope: 'sub'
    };
    client.search('uid=' + uid + ',ou=2013,ou=people,dc=42,dc=fr', opts, function (err, result) {
      result.on('searchEntry', function (entry) {
        var user = {
          isMe: (account.uid == uid) ? true : false,
          uid: entry.object['uid'],
          uidNumber: entry.object['uidNumber'],
          firstName: entry.object['first-name'],
          lastName: entry.object['last-name'],
          birthDate: entry.object['birth-date'] ? entry.object['birth-date'] : '/',
          mobilePhone: entry.object['mobile-phone'] ? entry.object['mobile-phone'].replace(/ /g, "") : '/'
        };
        res.json( user );
      });
      result.on('searchReference', function (referral) {
        res.json('referral: ' + referral.uris.join());
      });
      result.on('error', function (err) {
        res.json({error: err.message});
      });
      result.on('end', function (result) {
        //console.log('status: ' + result.status);
        client.unbind(function (err) {});
      });
    });
  });
});


router.post('/:name', function (req, res) {
    //req.params
});

module.exports = router;
