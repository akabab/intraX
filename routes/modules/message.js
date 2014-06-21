var q               = require("q");
var fs              = require("fs");
var easymongo       = require("easymongo");
var mongo           = new easymongo({dbname: "db"});
var category_get    = require('./category').category_get;
var category_url    = require('./category').category_url;
var category_tree   = require('./category').category_tree;
var topic_get       = require('./topic').topic_get;
var topic_url       = require('./topic').topic_url;

/* http://127.0.0.1:3000/message/
** The anonyme function returns void.
*/

exports.get = function (req, res) {
  var urlCategory = req.params.topic;
  var urlUnderCategory = req.params.subtopic;
  var urlTopic = req.params.message;
  var path = [urlCategory, urlUnderCategory];
  var idTopic;
  var treeTopic;
  var idMessage;
  var treeMessage;

  console.log('message');
  if (urlCategory && urlTopic) {
    category_get().then(function(result) {
      treeTopic = category_tree({'list': result, 'root': ''});
      idTopic = category_url({'tree': treeTopic, 'path': path});
      topic_get({'categoryId': idTopic}).then(function(topics) {
        idMessage = topic_url({'list': topics, 'nameMessage': urlTopic});
        message_get({'idTopic': idMessage}).then(function(messages) {
          treeMessage = message_tree({'list': messages, 'root': ''});
          res.json({'messages': treeMessage});
        });
      });
    });
  }
}

/* http://127.0.0.1:3000/message/
** The anonyme function returns void and adds, gets or dels a topic to
** topic' collection.
*/

exports.post = function (req, res) {
  var idMessageParent = req.body.idMessageParent;
  var idTopic = req.body.idTopic;
  var idMessage = req.body.idMessage;
  var idAccounts = req.body.idAccounts;
  var contenue = req.body.contenue;

  if (idTopic.length == 24) {
    if (req.params.action === 'add') {
      if (idAccounts.length == 24 && contenue)
        if (idMessageParent.length == 0 || idMessageParent.length == 24)
          message_add({
            'idTopic': idTopic,
            'idMessageParent': idMessageParent,
            'idAccounts': idAccounts,
            'contenue': contenue
          });
    }
    else if (req.params.action === 'get') {
        message_get({'idTopic': idTopic}).then(function(result) {
          res.json('message', (message_tree({'list': result, 'root': ''})));
        });
    }
    else if (req.params.action === 'del') {
      if (idMessage.length == 24)
        message_del({'idTopic': idTopic, 'idMessage': idMessage});
    }
  }
}

/* http://127.0.0.1:3000/message/get
** The function returns all message from (message + idtopic)'s collection
** according to the id from topic' collection.
*/

// idTopic: topic.id

function message_get(argument) {
  var idTopic = argument.idTopic;
  var message = mongo.collection(('message' + idTopic));
  var deferred = q.defer();

  message.find({}, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}

/* http://127.0.0.1:3000/message/get
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

/* http://127.0.0.1:3000/message/add
** The function returns void and saves the new message to
** (message + idtopic)'s collection.
*/

// idTopic: topic.id
// idMessageParent: message.id
// contenue: message.contenue
// idAccounts: account.id

var message_add = function (argument) {
  var idMessageParent = argument.idMessageParent;
  var idTopic = argument.idTopic;
  var idAccounts = argument.idAccounts;
  var contenue = argument.contenue;
  var message = mongo.collection(('message' + idTopic));
  var date = new Date();
  var data = {
    '_idMessageParent': idMessageParent,
    '_idAccounts': idAccounts,
    'dateOfCreation': date,
    'contenue': contenue
  };
  message.save(data, function(error, results) {
    console.log("saved");
  });
}

/* http://127.0.0.1:3000/message/del
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

exports.message_add = message_add;
