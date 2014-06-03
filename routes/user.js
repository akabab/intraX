var express = require('express');
var router = express.Router();
var ldap = require('ldapjs');

/* GET users listing. */
// router.get('/', function (req, res) {
//   console.log(user);
//   res.render('template/user', {user: {firstname: 'yoann' } });
//   res.end();
// });

router.get('/:name', function (req, res) {
  var name = req.params.name;
  console.log("HERE");
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
        "picture",
        "birth-date",
        "first-name",
        "last-name",
        "mobile-phone",
        "mail",
        "alias"
        ],
      filter:"!(close=non admis)",
      scope: 'sub'
    };
    client.search('uid=' + name + ',ou=2013,ou=people,dc=42,dc=fr', opts, function (err, result) {
      result.on('searchEntry', function (entry) {
        var user = {
          uid: entry.object['uid'],
          uidNumber: entry.object['uidNumber'],
          picture: entry.object['picture'],
          birthDate: entry.object['birth-date'],
          firstName: entry.object['first-name'],
          lastName: entry.object['last-name'],
          mobilePhone: entry.object['mobile-phone'],
          mail: entry.object['mail'],
          alias: entry.object['alias'],
          picture: entry.raw['picture'].toString("base64")
        };
        res.json( user );
      });
      result.on('searchReference', function (referral) {
        res.json('referral: ' + referral.uris.join());
      });
      result.on('error', function (err) {
        res.json('error: ' + err.message);
      });
      result.on('end', function (result) {
        //console.log('status: ' + result.status);
        client.unbind(function (err) {
          console.log("unbind ok");
        });
      });
    });
  });

});

router.post('/:name', function (req, res) {
    //req.params
});

var user = {
  name: "John",
  lastname: "Doe",
  uid: "41244",
  city: "Paris",
  age: 12
};

module.exports = router;
