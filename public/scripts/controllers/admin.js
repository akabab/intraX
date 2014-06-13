angular.module('intraX')

.controller('AdminCtrl', function ($scope, $http, $timeout) {

  $scope.panels = [ {name: 'Module',   template: 'admin_module'},
                    {name: 'Activity', template: 'admin_activity'},
                    {name: 'Forum',    template: 'admin_forum'}
                   ];

  $scope.modules = [];
  $scope.activities = [];

  $scope.getModules = function () {
    $http.get('/modules')
    .success(function (data) {
      $scope.modules = data;
    })
    .error(function (data) {});
  };

  $scope.addModule = function (newModule) {
    $http.post('/modules/add', newModule)
    .success(function (data) {
      $scope.modules = data;
    })
    .error(function (data) {});
  };

  $scope.delModule = function (module_id) {
    $http.post('/modules/del', {'_id': module_id})
    .success(function (data) {
      $scope.modules = data;
    })
    .error(function (data) {});
  };

  //Activities
  $scope.getActivities = function (module_name) {
    $http.get('/modules/' + module_name + '/all')
    .success(function (data) {
      $scope.activities = data;
    })
    .error(function (data) {});
  };

  $scope.addActivity = function (module_name, newActivity) {
    $http.post('/modules/' + module_name + '/add', {'activity': newActivity})
    .success(function (data) {
      console.log('yo');
      $scope.activities = data;
    })
    .error(function (data) {});
  };

  $scope.delActivity = function (module_name, activity_id) {
    $http.post('/modules/' + module_name + '/del', {'activity': {'_id': activity_id}})
    .success(function (data) {
      $scope.activities = data;
    })
    .error(function (data) {});
  };
});
