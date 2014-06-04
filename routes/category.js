var q = require("q");
var fs = require("fs");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var category = mongo.collection("category");

/*
** The anonyme function returns void and puts a see on
** category' collection.
*/

exports.get = function (req, res) {
  var tree;

  category_get().then(function(result) {
    tree = category_tree({'list': result, 'root': ''});
      res.json('category', {'tree': tree});
  });
};

/*
** The anonyme function returns void and adds or dels a category to
** category' collection.
*/

exports.post = function (req, res) {
  var addIdParent = req.body.addIdParent;
  var addName = req.body.addName;
  var delIdChild = req.body.delIdChild;

  if (req.params.action === 'add' && addName)
    if (addIdParent.length === 0 || addIdParent.length === 24)
      category_add({'parent': addIdParent, 'name': addName});
  else if (req.params.action === 'del' && delIdChild.length === 24)
    category_del({'id': delIdChild});
  category_get().then(function(parents) {
    res.render('category', {'parents': parents});
  });
}

/*
** The function returns a category's tree from
** category' collection.
*/

function category_tree(argument) {
  var list = argument.list;
  var root = argument.root;
  var node = [];

  for (var count = 0; count < list.length; count += 1)
    if (root == list[count]._idCategory)
      node.push({
        'parent': {
           'id': list[count]._id,
           'name': list[count].name
         },
         'child': category_tree({'list': list, 'root': list[count]._id})
      });
  return (node);
}

/*
** The function returns all categories from
** category' collection.
*/

var category_get = function (argument) {
  var deferred = q.defer();

  category.find(argument, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}

/*
** The function returns void and saves the new category to
** category' collection.
*/

function category_add(argument) {
  var parent = argument.parent;
  var name = argument.name.toLowerCase();
  var data = {'_idCategory': parent, 'name': name};

  category.save(data, function(error, results) {
  });
}

/*
** The function returns void and erases the category's id to
** category' collection.
*/

function category_del(argument) {
  var id = argument.id;

  category.removeById(id, function(error, results) {
  });
}

exports.category_get = category_get;
