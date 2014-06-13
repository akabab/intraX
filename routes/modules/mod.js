var q = require("q");
var fs = require("fs");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var modules = mongo.collection("modules");

exports.get = function (req, res) {
  if (typeof(req.params.module) === "undefined")
    var argument = "";
  else
    var argument = {name: req.params.module};
  module_get(argument).then(function (result) {
    res.json(result);
  });
};

exports.post = function (req, res) {
  if (req.params.action === "add") {
    module_add(req.body).then(function (result) {
      module_get().then(function (result) {
        res.json(result);
      });
    });
  }
  else if (req.params.action === "del") {
    module_del({_id: req.body._id}).then(function (result) {
      module_get().then(function (result) {
        res.json(result);
      });
    });
  }
  else if (req.params.action === "update") {
    module_update(req.body).then(function (result) {
      module_get().then(function (result) {
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
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
};

var module_add = function (argument) {
  var deferred = q.defer();
  
  var name        = argument.name,
      description = argument.description,
      slots       = argument.slots,
      credits     = argument.credits,
      start       = argument.start,
      end         = argument.end;
  
  // // HERE MANAGE DATES
  // var start = argument.start.split("/"),
  // end = argument.end.split("/");
  // if (start.length !== 3)
  //   throw new Error ("error start");
  // if (end.length !== 3)
  //   throw new Error ("error end");
  // var etd = new Date(parseInt(start[2]), parseInt(start[1]), parseInt(start[0]));
  // var eta = new Date(parseInt(end[2]), parseInt(end[1]), parseInt(end[0]));
  
    var data = {
    'name': name,
    'description': description,
    'slots': slots,
    'credits': credits,
    'start': start,
    'end': end
   };

   console.log(data);

  modules.save(data, function(error, result) {
    if (error) console.log(error);
    console.log(result);
    //var collection = mongo.collection("activity" + result._id);
    deferred.resolve(result);
  });
  return (deferred.promise);
};

var module_update = function (argument) {
  var deferred = q.defer();
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
    description: argument.description.toLowerCase(),
    slots: argument.slots,
    credits: argument.credits,
    start: etd,
    end: eta
   };

  modules.update({_id:_id}, {$set:data}, function(error, result) {
    deferred.resolve(result);
  });
  return (deferred.promise);
};

var module_del = function (argument) {
  var _id = argument._id;
  var deferred = q.defer();

  modules.removeById(_id, function(error, result) {
    deferred.resolve(result);
  });
  return (deferred.promise);
};
