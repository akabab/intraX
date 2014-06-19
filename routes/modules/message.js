var q                     = require("q");
var fs                    = require("fs");
var easymongo             = require("easymongo");
var mongo                 = new easymongo({dbname: "db"});
var category_get          = require('./category').category_get;
var category_url          = require('./category').category_url;
var category_tree_message = require('./category').category_tree_message;
var _topic                = require('./topic');
var accounts_get          = require('./accounts').accounts_get;
var accounts_uid          = require('./accounts').accounts_uid;
var accounts_topic_old    = require('./accounts').accounts_topic_old;
var accounts_topic_new    = require('./accounts').accounts_topic_new;

/* http://127.0.0.1:3000/forum/message/
** The anonyme function returns void.
*/

exports.get = function (req, res) {
  req.session.account = {'_id': '539f1781a592e3309e9f34ce'}; /* /!\ Warming, must be erase. */
  var idAccount = req.session.account._id;
  var urlCategory = req.params.topic;
  var urlUnderCategory = req.params.subtopic;
  var urlTopic = req.params.message;
  var path = [urlCategory, urlUnderCategory];
  var idCategory;
  var treeTheTopic;
  var idMessage;
  var treeMessage;

  if (idAccount.length == 24) {
    if (urlCategory && urlTopic) {
      category_get().then(function(allCathegories) {
        treeTheTopic = category_tree_message({'list': allCathegories, 'root': null});
        idCategory = category_url({'tree': treeTheTopic, 'path': path});        
        _topic.topic_get({'categoryId': idCategory}).then(function(allTopics) {
          idMessage = _topic.topic_url({'list': allTopics, 'nameMessage': urlTopic});
          message_get({'idTopic': idMessage, 'idAccount': idAccount}).then(function(messages) {
            accounts_get().then(function(accounts) {
              messages = message_uid({'listAccounts': accounts, 'listMessages': messages});
              treeMessage = message_tree({'list': messages, 'root': null});
              res.json(treeMessage);
            });
          });
        });
      });
    }
  }
}

/* http://127.0.0.1:3000/forum/message/
** The anonyme function returns void and adds, gets or dels a topic to
** topic' collection.
*/

exports.post = function (req, res) {
  req.session.account = {'_id': '539f1781a592e3309e9f34ce'}; /* /!\ Warming, must be erase. */
  var idAccount = req.session.account._id;
  var idMessageParent = req.body.idMessageParent;
  var idTopic = req.body.idTopic;
  var idMessage = req.body.idMessage;
  var contenue = req.body.contenue;

  if (idTopic.length == 24) {
    if (req.params.action === 'add') {
      if (idAccount.length == 24 && contenue)
        if (idMessageParent.length == 0 || idMessageParent.length == 24) {
          message_add({
            'idTopic': idTopic,
            'idMessageParent': idMessageParent,
            'idAccounts': idAccount,
            'contenue': contenue
          });
        }
    }
    else if (req.params.action === 'get') {
      message_get({'idTopic': idTopic}).then(function(result) {
        res.json('message', (message_tree({'list': result, 'root': null})));
      });
      return ;
    }
    else if (req.params.action === 'del') {
      if (idMessage.length == 24)
        message_del({'idTopic': idTopic, 'idMessage': idMessage});
    }
  }
  res.json('');
}

/* http://127.0.0.1:3000/forum/message/get
** The function returns all message from (message + idtopic)'s collection
** according to the id from topic' collection.
*/

// idTopic: topic.id

function message_get(argument) {
  console.log('message_get', argument.idTopic);
  var idAccount = argument.idAccount;
  var idTopic = argument.idTopic;
  var message = mongo.collection(('message' + idTopic));
  var deferred = q.defer();

  message.find({}, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result) {
      console.log('\n\n\tidTopic', idTopic);
      console.log('\tidAccounts', idAccount + '\n\n');
      accounts_topic_old({'idTopic': idTopic, 'idAccounts': idAccount});
      deferred.resolve(result);
    }
  });
  return (deferred.promise);
}

/* http://127.0.0.1:3000/forum/message/get
** The function returns a (message + idtopic)'s tree according to
** message's list.
*/

// idTopic: topic.id
// root: empty

function message_tree(argument) {
  var list = argument.list;
  var root = argument.root;
  var node = [];

  for (var count = 0; count < list.length; count += 1) {
    if (root == list[count].idMessageParent) {
      node.push({
        'parent': {
           'id': list[count].idMessageParent,
           'idAccounts': list[count]._idAccounts,
           'dateOfCreation': list[count].dateOfCreation,
           'contenue': list[count].contenue
         },
         'child': message_tree({'list': list, 'root': list[count]._id})
      });
    }
  }
  return (node);
}

/* http://127.0.0.1:3000/forum/message/add
** The function returns void and saves the new message to
** (message + idtopic)'s collection.
*/

// idTopic: topic.id
// idMessageParent: message.id
// contenue: message.contenue

var message_add = function (argument) {
  console.log('message_add');
  var idMessageParent = argument.idMessageParent;
  var idTopic = argument.idTopic;
  var idAccounts = argument.idAccounts;
  var contenue = argument.contenue;
  var message = mongo.collection('message' + idTopic);
  var date = new Date();
  var data = {
    '_idMessageParent': idMessageParent,
    '_idAccounts': idAccounts,
    'dateOfCreation': date,
    'contenue': contenue
  };

  message.save(data, function(error, success) {
    if (success)
      accounts_topic_new({'idTopic': idTopic});
  });
}

/* http://127.0.0.1:3000/forum/message/del
** The function returns void and erases the message's id to
** topic' collection.
*/

// idTopic: topic.id
// idMessage: message.id

function message_del(argument) {
  var idMessage = argument.idMessage;
  var idTopic = argument.idTopic;
  var message = mongo.collection(('message' + idTopic));

  message.removeById(idMessage, function(error, results) {
  });
}

/*
** The function returns a new list of message with the logins rather than ids.
*/

function message_uid(argument) {
  var listAccounts = argument.listAccounts;
  var listMessages = argument.listMessages;
  var countAccount;
  var countMessage;

  for (countMessage = listMessages.length - 1; countMessage >= 0; countMessage--)
    for (countAccount = listAccounts.length - 1; countAccount >= 0; countAccount--)
      if (listAccounts[countAccount]._id == listMessages[countMessage]._idAccounts) {
        listMessages[countMessage]._idAccounts = listAccounts[countAccount].login;
        break ;
      }
  return (listMessages);
}

exports.message_add = message_add;
