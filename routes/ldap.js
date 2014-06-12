var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

var mongodb = require('mongodb').MongoClient;


var saveToDB = function (users) {

    mongodb.connect('mongodb://127.0.0.1:27017/db', function (err, db) {
      if (err) {
        console.log(err);
      }
      else {
        var collection = db.collection('ldap');
        collection.drop();
        for (var i=0; i<users.length; i++) {
          
          collection.insert(users[i], function (err, result) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    });

}

router.get('/load', function (req, res) {
  var uid = req.query.uid;
  var pwd = req.query.pwd;
  var dn = 'uid=' + uid + ',ou=2013,ou=people,dc=42,dc=fr';
  var users = [];

  var client = ldap.createClient({url: "ldaps://ldap.42.fr:636", maxConnections: 2000});

  client.bind(dn, pwd, function (err) {
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
    client.search('ou=2013,ou=people,dc=42,dc=fr', opts, function (err, result) {
      result.on('searchEntry', function (entry) {
        if (entry.object['uid']) {
          var user = {
            uid: entry.object['uid'],
            uidNumber: entry.object['uidNumber'],
            firstName: entry.object['first-name'],
            lastName: entry.object['last-name'],
            birthDate: entry.object['birth-date'] ? entry.object['birth-date'] : '/',
            mobilePhone: entry.object['mobile-phone'] ? entry.object['mobile-phone'].replace(/ /g, "") : '/'
          };
          users.push(user);
        }
      });

      result.on('searchReference', function (referral) {
        res.json('referral: ' + referral.uris.join());
      });

      result.on('error', function (err) {
        res.json({error: err.message});
      });

      result.on('end', function (result) {
        saveToDB(users);
        res.json({error: null});
      });

    });
  });

});

module.exports = router;
