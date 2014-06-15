angular.module('intraX')

.controller('AdminCtrl', function ($scope, $http, $timeout) {

  $scope.panels = [ {name: 'Module',   template: 'admin_module'},
                    {name: 'Activity', template: 'admin_activity'}
                   ];

  $scope.modules = [];
  $scope.curModule = {};
  $scope.isEditingModule;
  $scope.moduleMessage = '';

  $scope.activities = [];
  $scope.curActivity = {};
  $scope.isEditingActivity;
  $scope.activityMessage = '';


  //Modules
  $scope.newModule = function () {
    $scope.curModule = {};
    $scope.isEditingModule = false;
  }

  $scope.editModule = function (module) {
    $scope.curModule = module;
    $scope.isEditingModule = true;
  }

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

  $scope.delModule = function (module) {
    $http.post('/modules/del', {'_id': module._id})
    .success(function (data) {
      $scope.modules = data;
    })
    .error(function (data) {});
  };

  //Activities
  $scope.newActivity = function () {
    $scope.curActivity = {};
    $scope.isEditingActivity = false;
  }

  $scope.editActivity = function (activity) {
    $scope.curActivity = activity;
    $scope.isEditingActivity = true;
  }

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
      $timeout(function() { $scope.activityMessage = ''; }, 2000);
      $scope.activityMessage = 'Activity added successfuly';
      $scope.activities = data;
      $scope.curActivity = {};
    })
    .error(function (data) {});
  };

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
