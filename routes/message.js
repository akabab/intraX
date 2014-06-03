var q = require("q");
var fs = require("fs");
var category_get = require('./category').category_get;
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var category = mongo.collection("category");

/*
** The anonyme function returns void and adds or dels a category to
** category' collection.
*/

exports.get = function (req, res) {
  var tree;

  message_get().then(function(result) {
    tree = message_tree({'list': result[0], 'root': ''});
      res.xml('category', {'parents': result, 'tree': tree});
  });
}

exports.post = function (req, res) {
  var idMessageParent = req.body.idMessageParent;
  var idTopic = req.body.idTopic;
  var idAccounts = req.body.idAccounts;
  var contenue = req.body.contenue;
  var categoryId = req.body.categoryID;
  var currentId = req.body.currentId;

  if (req.params.action === 'add')
    if (currentId.length == 24 && categoryId.length == 24)
      message_add({
        'idMessageParent': idMessageParent,
        'idTopic': idTopic,
        'idAccounts': idAccounts,
        'contenue': contenue,
        'categoryId': contenue,
      });
  else if (req.params.action === 'del')
    if (currentId.length == 24 && categoryId.length == 24)
      message_del({'currentId': currentId, 'categoryId': categoryId});
}

/* http://127.0.0.1:3000/message/538cada300107c05a8547fa4
** The function returns all message from (message + idCategory)'s collection
** according to the id from topic' collection.
*/

// categoryId: category.id
// topicId: topic.id

function message_get(argument) {
  var topicId = argument.topicId;
  var categoryId = argument.categoryId;
  var message = mongo.collection(('message' + categoryId));
  var deferred = q.defer();

  message.find({'_idTopic': topicId}, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}

/*
** The function returns a (message + idCategory)'s tree according to
** message's list.
*/

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

/*
** The function returns void and saves the new message to
** (message + idCategory)'s collection.
*/

function message_add(argument) {
  var idMessageParent = argument.idMessageParent;
  var idTopic = argument.idTopic;
  var idAccounts = argument.idAccounts;
  var contenue = argument.contenue;
  var categoryId = argument.contenue;
  var message = mongo.collection(('message' + categoryId));
  var date = new Date();
  var data = {
    '_idMessage': idMessageParent,
    '_idTopic': idTopic,
    '_idAccounts': idAccounts,
    'dateOfCreation': date,
    'contenue': contenue
  };

  message.save(data, function(error, results) {
  });
}

/*
** The function returns void and erases the message's id to
** category' collection.
*/

function message_del(argument) {
  var currentId = argument.currentId;
  var categoryId = argument.contenue;
  var message = mongo.collection(('message' + categoryId));

  message.removeById(currentId, function(error, results) {
  });
}
