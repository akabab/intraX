
'use strict';

var express = require('express');
var router = express.Router();

var ldap = require('ldapjs');

function tldap_putuser(argument) {
  var client = ldap.createClient({url: 'ldaps://ldap.42.fr:636'});
  var opts = {
    attributes: ['uid', 'uidNumber', 'picture', 'birth-date', 'first-name',
'last-name', 'mobile-phone', 'mail', 'alias'],
    filter:'!(close=non admis)',
    scope: 'sub'
  };

  client.bind('uid=' + argument['login'] + ',ou=2013,ou=people,dc=42,dc=fr',
argument['password'], function(err) {
    return ;
  });
  client.search('uid=' + argument['uid'] + ',ou=2013,ou=people,dc=42,dc=fr',
    opts, function(err, res) {
    res.on('searchEntry', function(entry) {
      console.log(entry.object);
//      argument['res'].end(entry.object);
      return ;
    });
    return ;
  });
  return ;
}

router.get('/', function (req, res) {
  var uid = 'cdenis';
  var login = 'adjivas';
  var password = 'fccjnw';

  tldap_putuser({uid: uid, login: login, password: password,
req: req, res: res});
  return ;
});

module.exports = router;
