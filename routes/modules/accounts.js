var q                = require("q");
var fs               = require("fs");
var easymongo        = require("easymongo");
var mongo            = new easymongo({dbname: "db"});
var accounts         = mongo.collection("accounts");
var ObjectId         = require('mongodb').ObjectID;

exports.get = function (req, res) {
  req.session.account = {'_id': '539f1781a592e3309e9f34ce'}; /* /!\ Warming, must be erase. */
  var idAccount = req.session.account._id;

  if (idAccount && idAccount.length === 24) {
    accounts_get().then(function(allAccounts) {
      res.json(allAccounts);
    });
  }
  else
    res.json('');
}

exports.post = function (req, res) {
  req.session.account = {'_id': '539f1781a592e3309e9f34ce'}; /* /!\ Warming, must be erase. */
  var idAccount = req.session.account._id;
  var categoryIsOpen = req.body.categoryIsOpen;
  var topicSeeNot = req.body.topicSeeNot;

  if (req.params.action === 'add') {
    if (topicSeeNot && topicSeeNot.length === 24)
      accounts_topic_new({'idTopic': topicSeeNot});
    if (idAccount && idAccount.length === 24
    && categoryIsOpen && categoryIsOpen.length === 24) {
      accounts_category_open({'idCategory': categoryIsOpen, 'idAccounts': idAccount});
    }
  }
  else if (req.params.action === 'del'
  && idAccount && idAccount.length === 24) {
    if (topicSeeNot && topicSeeNot.length === 24)
      accounts_topic_old({'idTopic': topicSeeNot, 'idAccounts': idAccount});
    if (categoryIsOpen && categoryIsOpen.length === 24)
      accounts_category_close({'idCategory': categoryIsOpen,
                               'idAccounts': idAccount});
  }
  res.json('');
}

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

/* topicSeeNot
** The function adds for all accounts the new event.
*/

var accounts_topic_new = function (argument) {
  var idTopic = argument.idTopic;

  accounts.update({}, {'$push': {'topicSeeNot': idTopic}},
  function(error, result) {
  });
}

/* topicSeeNot
** The function dels for the account the old event.
*/

var accounts_topic_old = function (argument) {
  var idAccounts = argument.idAccounts;
  var idTopic = argument.idTopic;

  accounts.update({'_id': idAccounts}, {'$pull': {'topicSeeNot': idTopic}},
  function(error, result) {
  });
}

/* http://127.0.0.1:3000/forum/accounts/add
** The function adds for one accounts the category close.
*/

var accounts_category_open = function (argument) {
  var idAccounts = argument.idAccounts;
  var idCategory = argument.idCategory;

  console.log('The ' + idAccounts + ' opens ' + 'idCategory');
  accounts.update({'_id': idAccounts}, {'$push': {'categoryIsOpen': idCategory}},
  function(error, result) {
  });
}

/* http://127.0.0.1:3000/forum/accounts/del
** The function dels for one accounts the category open.
*/

var accounts_category_close = function (argument) {
  var idAccounts = argument.idAccounts;
  var idCategory = argument.idCategory;

  accounts.update({'_id': idAccounts}, {'$pull': {'categoryIsOpen': idCategory}},
  function(error, result) {
  });
}


exports.accounts_topic_old = accounts_topic_old;
exports.accounts_topic_new = accounts_topic_new;
exports.accounts_get = accounts_get;
exports.accounts_uid = accounts_uid;
