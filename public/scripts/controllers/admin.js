angular.module('intraX')

.controller('AdminCtrl', function ($scope, $http, $timeout) {

  $scope.panels = [ {name: 'Module',   template: 'admin_module'},
                    {name: 'Activity', template: 'admin_activity'},
                    {name: 'Forum',    template: 'admin_forum'}
                   ];

  $scope.modules = [];
  $scope.activities = [];
  $scope.curActivity = {};

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
    console.log('add');
    $http.post('/modules/' + module_name + '/add', {'activity': newActivity})
    .success(function (data) {
      $scope.activities = data;
    })
    .error(function (data) {});
  };

  $scope.editActivity = function (activity) {
    $scope.curActivity = activity;
    $scope.isEditing = true;
    console.log($scope.curActivity, $scope.isEditing);
  }

  $scope.updateActivity = function (module_name, activity) {
    console.log('edit %j', activity);
    $http.post('/modules/' + module_name + '/update', {'activity': activity})
    .success(function (data) {
      console.log(data);
      $scope.activities = data;
    })
    .error(function (data) {});
  };

  $scope.delActivity = function (module_name, activity) {
    $http.post('/modules/' + module_name + '/del', {'activity': {'moduleId': activity.moduleId, '_id': activity._id}})
    .success(function (data) {
      $scope.activities = data;
    })
    .error(function (data) {});
  };
});
