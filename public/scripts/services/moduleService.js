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

    getActivity: function (moduleName, activityName) {
      var deferred = $q.defer();

      $http.get('/modules/' + moduleName + '/' + activityName).then(function (res) {
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

    moduleSubscribe: function (module) {
      var deferred = $q.defer();

      $http.post('/modules/subscribe', {'module': module}).then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    activitySubscribe: function (moduleName, activity) {
      var deferred = $q.defer();

      $http.post('/modules/'+ moduleName +'/subscribe', {'activity': activity}).then(function (res) {
        deferred.resolve(res.data);
      }, function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

  }

});
