var q = require("q");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var modules = mongo.collection("modules");

exports.get = function (req, res) {
  var moduleName = req.params.module;

  if (moduleName) {
    module_get(moduleName).then(function (result) {
      res.json(result);
    });
  }
  else {
    module_get_all().then(function (result) {
      res.json(result);
    });
  }
};

exports.post = function (req, res) {
  var module = req.body.module;
  var action = req.params.action;

  moduleActions[action](req, module).then(function (result) {
    if (action == 'subscribe') {
      module_get(module.name).then(function (result) {
        res.json(result);
      });
    }
    else {
      module_get_all().then(function (result) {
        res.json(result);
      });
    }
  });
};

var module_get = function (moduleName) {
  var deferred = q.defer();

  modules.find({'name': moduleName}, function (error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var module_get_all = function () {
  var deferred = q.defer();

  modules.find(function (error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var moduleActions = {
  add: function (req, module) {
    var deferred = q.defer();

    modules.save(module, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  update: function (req, module) {
    var deferred = q.defer();
    var id = module._id;
    delete module._id;

    modules.update({'_id': id}, {$set: module}, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  del: function (req, module) {
    var deferred = q.defer();

    modules.removeById(module._id, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  subscribe: function (req, module) {
    var deferred = q.defer();
    var uid = req.session.account.uid;

    modules.update({'_id': module._id}, {$push: {'users': uid}}, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  }

};
