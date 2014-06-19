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
  var activity = req.body.activity;
  var action = req.params.action;

  module_get(moduleName).then(function (result) {
    var module = result[0];

    activityActions[action](req, activity).then(function (result) {
      if (action == 'subscribe') {
        activity_get(module._id, activity.name).then(function (result) {
          res.json(result);
        });
      }
      else {
        activity_get_all(module._id).then(function (result) {
          res.json(result);
        });
      }
    });
  });
};

exports.getUserActivities = function (req, res) {
  module_get().then(function (modules) {
    check_activities(modules, req.session.account["uid"]).then(function (result) {
      // put all in a single data tab
      var data = [];
      result.forEach(function (tab) {
        tab.forEach(function (elem) {
          data.push(elem);
        });
      });
      res.json(data);
    });
  });
};

var check_activities = function (modules, user) {
  var the_promises = [];

  modules.forEach(function (module) {
    var deferred = q.defer();
    activity_get_all(module._id).then(function (activities) {
      var tab = [];
      activities.forEach(function (activity) {
        activity.moduleName = module.name;
        // if (activity.users.indexOf(user) !== -1)
          tab.push(activity);
      });
      deferred.resolve(tab);
    });
    the_promises.push(deferred.promise);
  });
  return q.all(the_promises);
};


//Get module identified by name
var module_get = function (moduleName) {
  var deferred = q.defer();
  
  if (typeof(moduleName) === "undefined")
    var what = "";
  else
    var what = {'name': moduleName};
    
  modules.find(what, function (error, result) {
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
var activity_get = function (moduleId, activityName) {
  var deferred = q.defer();

  var activity = mongo.collection("activity" + moduleId);
  console.log(activityName);
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
  add: function (req, activity) {
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + activity.moduleId);

    activityCol.save(activity, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  update: function (req, activity) {
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + activity.moduleId);
    var id = activity._id;
    delete activity._id;

    activityCol.update({'_id': id}, {$set: activity}, function (error, result) {
      console.log(error, result);
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  del: function (req, activity) {
    var deferred = q.defer();

    var activityCol = mongo.collection("activity" + activity.moduleId);

    activityCol.removeById(activity._id, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  },

  subscribe: function (req, activity) {
    var deferred = q.defer();
    var uid = req.session.account.uid;

    var activityCol = mongo.collection("activity" + activity.moduleId);

    activityCol.update({'_id': activity._id}, {$push: {'users': uid}}, function (error, result) {
      deferred.resolve(result);
    });
    return (deferred.promise);
  }

};
