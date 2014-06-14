var q               = require("q");
var fs              = require("fs");
var easymongo       = require("easymongo");
var mongo           = new easymongo({dbname: "db"});
var category_get    = require('./category').category_get;
var category_url    = require('./category').category_url;
var category_tree    = require('./category').category_tree;

/*
** The anonyme function returns void and puts a see on
** category' collection.
*/

exports.get = function (req, res) {
  var urlCategory = req.params.topic;
  var urlUnderCategory = req.params.subtopic;
  var path = [urlCategory, urlUnderCategory];
  var idTopic;
  var treeTopic;
  var idMessage;
  var treeMessage;

  if (urlCategory) {
    category_get().then(function(result) {
      treeTopic = category_tree({'list': result, 'root': ''});
      idTopic = category_url({'tree': treeTopic, 'path': path});
      topic_get({'categoryId': idTopic}).then(function(topics) {
        res.json({'topics': topics});
      });
    });
  }
  else {
    res.json({'topics': false});
  }
};

exports.post = function (req, res) {
  var categoryId = req.body.categoryId;
  var description = req.body.description;
  var topicId = req.body.topicId;

  if (categoryId.length == 24) {
    if (req.params.action === 'del' && topicId.length == 24)
      topic_del({'categoryId': categoryId, 'topicId': topicId});
    else if (req.params.action === 'add' && description)
      topic_add({'categoryId': categoryId, 'description': description});
  }
};

/* http://127.0.0.1:3000/topic/538cada300107c05a8547fa4
** The function returns all topics from topic' collection
** according to the id from category' collection.
*/

// 'topic' + category.id

var topic_get = function (argument) {
  var categoryId = argument.categoryId;
  var topic = mongo.collection(('topic' + categoryId));
  var deferred = q.defer();

  topic.find({}, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}

/* http://127.0.0.1:3000/topic/add
** The function returns void and saves the new topic to topic' collection
** according to the id from category' collection.
*/

// categoryId: 'topic' + category.id
// description: description

function topic_add(argument) {
  var topic = mongo.collection(('topic' + argument.categoryId));
  var name = argument.description.toLowerCase();
  var data = {'description': name};

  topic.save(data, function(error, results) {
  });
}

/* http://127.0.0.1:3000/topic/del
** The function returns void and erases the topic from topic' collection
** according to the id from category' collection.
*/

// categoryId: 'topic' + category.id
// topicId: id

function topic_del(argument) {
  var categoryId = argument.categoryId;
  var topicId = argument.topicId;
  var topic = mongo.collection(('topic' + argument.categoryId));

  topic.removeById(topicId, function(error, results) {
  });
}



/*
** The function returns the occurrence from topic' collection according to
** the id from category' collection according to the nameMessage' parameter.
*/

var topic_url = function (argument) {
  var list = argument.list;
  var nameMessage = argument.nameMessage;

  for (var i = list.length - 1; i >= 0; i -= 1) {
    if (nameMessage == list[i].url)
      return (list[i]._id);
  }
  return (undefined);
}

exports.topic_get = topic_get;
exports.topic_url = topic_url;
