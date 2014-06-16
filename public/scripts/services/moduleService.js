angular.module('intraX.services')

.factory("ModuleService", function ($q, $http) {
  return {
    getModule: function (moduleName) {
      var deferred = $q.defer();

      $http.get('/modules/' + moduleName).then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    getModules: function () {
      var deferred = $q.defer();

      $http.get('/modules').then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    getActivities: function (moduleName) {
      var deferred = $q.defer();

      $http.get('/modules/' + moduleName + '/all').then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    subscribe: function (module) {
      var deferred = $q.defer();

      $http.post('/modules/subscribe', {'module': module}).then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

  }

});
