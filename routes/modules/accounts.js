var q                = require("q");
var fs               = require("fs");
var easymongo        = require("easymongo");
var mongo            = new easymongo({dbname: "db"});
var accounts         = mongo.collection("accounts");
var ObjectId         = require('mongodb').ObjectID;

/*
** The function returns the account list according to
** argument's parameter from accounts' collection.
*/

var accounts_get = function (argument) {
  var deferred = q.defer();

  accounts.find(argument, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}

/*
** The function returns void or the login from
** accounts' collection according to the id.
*/

// Is call by the accounts_uid's function.

function accounts_uid_static(argument) {
  var account = argument.account;
  var element = argument.element;
  var count;

  for (count = account.length - 1; count >= 0; count--) {
    if (account[count]._id == element._idAccounts)
      return (account[count].login);
  }
  return (undefined);
}

/*
** The function returns the message list with uid according to
** argument's parameter.
*/

var accounts_uid = function (argument) {
  var accounts = argument.accounts;
  var list = argument.list;
  var count;

  console.log('accounts_uid:', accounts, list);
  for (count = list.length - 1; count >= 0; count--) {
    list[count]._idAccounts = accounts_uid_static({'element': list[count],
                                                   'account': accounts});
  }
  return (list);
}

exports.accounts_get = accounts_get;
exports.accounts_uid = accounts_uid;
