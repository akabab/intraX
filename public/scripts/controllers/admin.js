angular.module('intraX')

.controller('AdminCtrl', function ($scope, $http, $timeout, ModuleService) {

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

  var setMessage = function (at, message) {
    $timeout(function() { $scope[at] = ''; }, 2000);
    $scope[at] = message;
  };

  //Modules
  $scope.resetModuleForm = function () {
    $scope.curModule = {};
    $scope.isEditingModule = false;
  }

  $scope.editModule = function (module) {
    $scope.curModule = module;
    $scope.isEditingModule = true;
  };

  $scope.getModules = function () {
    ModuleService.getModules().then(function (data) {
       $scope.modules = data;
    }, function (err) {
      console.log(err);
    });
  };

  $scope.addModule = function (module) {
    $http.post('/modules/add', {'module': module})
    .success(function (data) {
      setMessage('moduleMessage', 'Module added successfuly');
      $scope.modules = data;
      $scope.curModule = {};
    })
    .error(function (err) {
      console.log(err);
    });
  };

  $scope.updateModule = function (module) {
    $http.post('/modules/update', {'module': module})
    .success(function (data) {
      setMessage('moduleMessage', 'Module updated successfuly');
      $scope.modules = data;
    })
    .error(function (err) {
      console.log(err);
    });
  };

  $scope.delModule = function (module) {
    if ($scope.isEditingModule && module._id == $scope.curModule._id) {
      $scope.resetModuleForm();
    }

    $http.post('/modules/del', {'module': module})
    .success(function (data) {
      setMessage('moduleMessage', 'Module removed successfuly');
      $scope.modules = data;
    })
    .error(function (err) {
      console.log(err);
    });
  };

  //Activities
  $scope.resetActivityForm = function () {
    $scope.curActivity = {};
    $scope.isEditingActivity = false;
  }

  $scope.editActivity = function (activity) {
    $scope.curActivity = activity;
    $scope.isEditingActivity = true;
  }

  $scope.getActivities = function (module) {
    $http.get('/modules/' + module.name + '/all')
    .success(function (data) {
      $scope.activities = data;
    })
    .error(function (err) {
      console.log(err);
    });
  };

  $scope.addActivity = function (module, activity) {
    activity.moduleId = module._id;

    $http.post('/modules/' + module.name + '/add', {'activity': activity})
    .success(function (data) {
      setMessage('activityMessage', 'Activity added successfuly');
      $scope.activities = data;
      $scope.curActivity = {};
    })
    .error(function (err) {
      console.log(err);
    });
  };

  $scope.updateActivity = function (module, activity) {
    activity.moduleId = module._id;

    $http.post('/modules/' + module.name + '/update', {'activity': activity})
    .success(function (data) {
      setMessage('activityMessage', 'Activity updated successfuly');
      $scope.activities = data;
    })
    .error(function (err) {
      console.log(err);
    });
  };

  $scope.delActivity = function (module, activity) {
    if ($scope.isEditingActivity && activity._id == $scope.curActivity._id) {
      $scope.resetActivityForm();
    }

    $http.post('/modules/' + module.name + '/del', {'activity': {'moduleId': module._id, '_id': activity._id}})
    .success(function (data) {
      setMessage('activityMessage', 'Activity removed successfuly');
      $scope.activities = data;
    })
    .error(function (err) {
      console.log(err);
    });
  };
});
