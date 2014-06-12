var q = require("q");
var fs = require("fs");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var modules = mongo.collection("modules");


exports.get = function (req, res) {
  console.log(req.params);
  var argument = {name: req.params.module};
  module_get(argument).then(function (result) {
    var id = result[0]._id;
    if (req.params.activity === "*") //find something better ?
      var activity = "";
    else
      var activity = {name:req.params.activity};
    activity_get(activity, id).then(function (result) {
      res.json(result);
    });
  },
  function (error) {
    res.json({error:error});
  });
};

// i'd like a switch / should we get parentId or find it with parent name
exports.post = function (req, res) {
  var parentId = req.body.parentId;
  if (req.params.action === "add") {
    activity_add(req.body, parentId).then(function (result) {
      activity_get("", parentId).then(function (result) {
        res.json(result);
      });
    });
  }
  else if (req.params.action === "del") {
    activity_del({_id: req.body._id}, req.body.parentId).then(function (result) {
      activity_get("", parentId).then(function (result) {
        res.json(result);
      });
    });
  }
  else if (req.params.action === "update") {
    activity_update(req.body, req.body.parentId).then(function (result) {
      activity_get("", parentId).then(function (result) {
        res.json(result);
      });
    });
  }
};

var module_get = function (argument) {
  var deferred = q.defer();

  modules.find(argument, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result.length == 0)
      deferred.reject("MODNOEXISTS");
    else
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var activity_get = function (argument, parentId) {
  var deferred = q.defer();
  console.log("activity" + parentId);
  var activities = mongo.collection("activity" + parentId);  

  activities.find(argument, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var activity_add = function (argument, parentId) {
  var deferred = q.defer();
  var activities = mongo.collection("activity" + parentId);

  // HERE MANAGE DATES
  var start = argument.start.split("/"),
  end = argument.end.split("/");
  if (start.length !== 3)
    throw new Error ("error start");
  if (end.length !== 3)
    throw new Error ("error end");
  var etd = new Date(parseInt(start[2]), parseInt(start[1]), parseInt(start[0]));
  var eta = new Date(parseInt(end[2]), parseInt(end[1]), parseInt(end[0]));
  
  var data = {
    name: argument.name.toLowerCase(),
    type: argument.type,
    description: argument.description.toLowerCase(),
    subject: argument.subject, // later a .pdf
    slots: argument.slots,
    groupSize: argument.groupSize,
    peerNumber: argument.peerNumber,
    autoGroup: argument.autoGroup, //bool
    start: etd,
    end: eta
   };

  activities.save(data, function(error, result) {
    deferred.resolve(result);
  });
  return (deferred.promise);
};

var activity_update = function (argument, parentId) {
  var deferred = q.defer();
  var activities = mongo.collection("activity" + parentId);
  
  var _id = argument._id;
  
  // HERE MANAGE DATES
  var start = argument.start.split("/"),
  end = argument.end.split("/");
  if (start.length !== 3)
    throw new Error ("error start");
  if (end.length !== 3)
    throw new Error ("error end");
  var etd = new Date(parseInt(start[2]), parseInt(start[1]), parseInt(start[0]));
  var eta = new Date(parseInt(end[2]), parseInt(end[1]), parseInt(end[0]));
    
  var data = {
    name: argument.name.toLowerCase(),
    type: argument.type,
    description: argument.description.toLowerCase(),
    subject: argument.subject, // later a .pdf
    slots: argument.slots,
    groupSize: argument.groupSize,
    peerNumber: argument.peerNumber,
    autoGroup: argument.autoGroup, //bool
    start: etd,
    end: eta
   };

  activities.update({_id:_id}, {$set:data}, function(error, result) {
    deferred.resolve(result);
  });
  return (deferred.promise);
};

var activity_del = function (argument, parentId) {
  var deferred = q.defer();
  var activities = mongo.collection("activity" + parentId);
  
  var _id = argument._id;
  
  activities.removeById(_id, function(error, result) {
    deferred.resolve(result);
  });
  return (deferred.promise);
};
