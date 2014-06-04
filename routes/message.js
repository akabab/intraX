var q = require("q");
var fs = require("fs");
var topic_get = require('./topic').topic_get;
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var topic = mongo.collection("topic");

/* http://127.0.0.1:3000/message/
** The anonyme function returns void.
*/

exports.get = function (req, res) {

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

  for (var count = 0; count < list.length; count += 1)
    if (root == list[count]._idMessage)
      node.push({
        'parent': {
           'id': list[count]._id,
           'idAccounts': list[count]._idAccounts,
           'dateOfCreation': list[count].dateOfCreation,
           'contenue': list[count].contenue
         },
         'child': message_tree({'list': list, 'root': list[count]._id})
      });
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

function message_add(argument) {
  var idMessageParent = argument.idMessageParent;
  var idTopic = argument.idTopic;
  var idAccounts = argument.idAccounts;
  var contenue = argument.contenue;
  var message = mongo.collection(('message' + idTopic));
  var date = new Date();
  var data = {
    '_idMessage': idMessageParent,
    '_idAccounts': idAccounts,
    'dateOfCreation': date,
    'contenue': contenue
  };

  message.save(data, function(error, results) {
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

  console.log(('message' + idTopic), idMessage);
  message.removeById(idMessage, function(error, results) {
  });
}
