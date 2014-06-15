angular.module('intraX.services')

.factory("ModuleService", function ($q, $http) {
  return {
    getModules: function () {
      var deferred = $q.defer();

      $http.get('/modules').then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }
  }

});
