var q = require("q");
var fs = require("fs");
var easymongo = require("easymongo");
var mongo = new easymongo({dbname: "db"});
var feature = mongo.collection("feature");

/*
** The anonyme function returns void and puts a see on
** feature' collection.
*/

exports.get = function (req, res) {
  feature_get().then(function(result) {
  	res.json(result);
  });
};

/*
** The function returns all feature from
** feature' collection.
*/

var feature_get = function (argument) {
  var deferred = q.defer();

  feature.find(argument, function(error, result) {
    if (error)
      deferred.reject(error);
    if (result)
      deferred.resolve(result);
  });
  return (deferred.promise);
}
