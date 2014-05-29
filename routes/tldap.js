// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   tldap.js                                           :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: adjivas <adjivas@student.42.fr>            +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2014/05/29 19:23:52 by adjivas           #+#    #+#             //
//   Updated: 2014/05/29 19:23:54 by adjivas          ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

'use strict';

var express = require('express');
var router = express.Router();

var ldap = require('ldapjs');

router.get('/', function (req, res) {
  var client = ldap.createClient({url: 'ldaps://ldap.42.fr:636'});
  var opts;

  client.bind('uid=cdenis,ou=2013,ou=people,dc=42,dc=fr', 'mot de passe de clement', function(err) {
    if (err)
      return ;
  });
  opts = {
    attributes: ['uid', 'uidNumber', 'picture', 'birth-date', 'first-name',
'last-name', 'mobile-phone', 'mail', 'alias'],
    filter:'!(close=non admis)',
    scope: 'sub'
  };
  var uid = 'adjivas';
  client.search('uid=' + uid + ',ou=2013,ou=people,dc=42,dc=fr', opts, function(err, res) {
    if (err)
      return ;

    console.log('result', res);
    res.on('searchEntry', function(entry) {
      console.log('entry: ', entry.object);
    });
    res.on('searchReference', function(referral) {
      console.log('referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      console.log('status: ' + result.status);
    });
  });
  return ;
});

module.exports = router;
