var q = require("q");
var fs = require("fs");
var category_get = require('./category').category_get;
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var category = mongo.collection("category");

/*
** The anonyme function returns void and puts a see on
** category' collection.
*/

exports.get = function (req, res) {
  var categoryId = req.params.id;
  
  if (categoryId.length === 24)
    topic_get({'categoryId': categoryId}).then(function(topics) {
      res.json(topics);
    });
};

exports.post = function (req, res) {
  var categoryId = req.body.categoryId;
  var description = req.body.description;
  var topicId = req.body.topicId;

  if (categoryId.length == 24) {
    if (req.params.action === 'del' && topicId.length == 24)
      topic_del({'categoryId': categoryId, 'topicId': topicId});
    else if (req.params.action === 'add' && description)
      topic_add({'categoryId': categoryId, 'description': description, 'author': req.session.account["uid"]});
  }
  topic_get({'categoryId': categoryId}).then(function(topics) {
    res.json(topics);
  });
};

/* http://127.0.0.1:3000/topic/538cada300107c05a8547fa4
** The function returns all topics from topic' collection
** according to the id from category' collection.
*/

// 'topic' + category.id

function topic_get(argument) {
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
  var author = argument.author;
  var data = {'description': name, 'author': author, date: new Date().toString()};

  topic.save(data, function(error, results) {
    console.log("saved : ", results);
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
