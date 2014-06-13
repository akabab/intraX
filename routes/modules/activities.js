var q = require("q");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var modules = mongo.collection("modules");

exports.get = function (req, res) {
  var moduleName = req.params.module;

  module_get(moduleName).then(function (result) {
    var module = result[0];

    if (req.params.activity === "all") {
      activity_get_all(module._id).then(function (result) {
        res.json(result);
      });
    }
    else {
      activity_get(module._id, req.params.activity).then(function (result) {
        res.json(result);
      });
    }
  },
  function (error) {
    res.json({'error':error});
  });
};

exports.post = function (req, res) {
  var moduleName = req.params.module;


  module_get(moduleName).then(function (result) {
    var module = result[0];
    var activity = req.body.activity;
    var action = req.params.action;

    activityActions[action](activity, module._id).then(function (result) {
      activity_get_all(module._id).then(function (result) {
        res.json(result);
      });
    });
  });
};

//Get module identified by name
var module_get = function (moduleName) {
  var deferred = q.defer();

  modules.find({'name': moduleName}, function (error, result) {
    if (error)
      deferred.reject(error);
    if (result.length == 0)
      deferred.reject("MODNOEXISTS");
    else
      deferred.resolve(result);
  });
  return (deferred.promise);
};

//Get activity identified by name & inside collection "activity + moduleId"
var activity_get = function (activityName, moduleId) {
  var deferred = q.defer();

  var activity = mongo.collection("activity" + moduleId);

  activity.find({'name': activityName}, function (error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var activity_get_all = function (moduleId) {
  var deferred = q.defer();

  var activity = mongo.collection("activity" + moduleId);

  activity.find(function (error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var activityActions = {
  add: function (activity, moduleId) {
    console.log('werwe');
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + moduleId);

    activityCol.save(activity, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  update: function (activity, moduleId) {
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + moduleId);

    activityCol.update({'_id': activity._id}, {$set: activity}, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  del: function (activity, moduleId) {
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + moduleId);

    activityCol.removeById(activity._id, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  }
};
