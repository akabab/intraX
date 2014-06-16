angular.module('intraX')

.controller('ModuleCtrl', function ($scope, $http, $stateParams, ModuleService, SessionService) {
  $scope.module = {};
  $scope.moduleAsked = $stateParams.name;
  $scope.activities = [];
  $scope.canRegister = false;
  $scope.isRegistred = true;
  $scope.isRequesting = true;

  var user = SessionService.get('user');


  var setRegisterVal = function () {
    var users = $scope.module.users;

    var subStart_ts = dateToTimestamp($scope.module.subStart);
    var subEnd_ts = dateToTimestamp($scope.module.subEnd);
    var cur_ts = Date.now();

    if (cur_ts > subStart_ts && cur_ts < subEnd_ts)
      $scope.canRegister = true;
    for (var i=0; i < users.length; i++) {
      if (users[i] == user.uid) {
        $scope.isRegistred = true;
        return;
      }
    }
    $scope.isRegistred = false;
  }

  $scope.getModule = function (moduleName) {
    $scope.isRequesting = true;

    ModuleService.getModule(moduleName).then(function (data) {
      $scope.module = data[0];
      if ($scope.module)
        setRegisterVal();
      $scope.isRequesting = false;
    }, function (err) {
      $scope.isRequesting = false;
    });
  }

  $scope.getActivities = function (moduleName) {
    ModuleService.getActivities(moduleName).then(function (data) {
      $scope.activities = data;
      getActivityCurTime();
    }, function (err) {
      console.log(err);
    });
  }

  $scope.subscribe = function (module) {
    ModuleService.subscribe(module).then(function (data) {
      $scope.module = data[0];
      setRegisterVal();
    }, function (err) {
      console.log(err);
    });
  };

  var dateToTimestamp = function (date) {
    var tmp = date.split("-");
    var newDate = tmp[1] + '/' + tmp[2] + '/' + tmp[0];
    var timestamp = new Date(newDate).getTime();
    return timestamp;
  }

  var getActivityCurTime = function () {
    for (var i=0; i < $scope.activities.length; i++) {
      activity = $scope.activities[i];

      if (activity.workStart && activity.workEnd) {
        activity.workStart_ts = dateToTimestamp(activity.workStart);
        activity.workEnd_ts   = dateToTimestamp(activity.workEnd);
        activity.curTime_ts   = Date.now();

        var deltaTime = activity.workEnd_ts - activity.workStart_ts;
        var curDeltaTime = activity.curTime_ts - activity.workStart_ts;
        if (curDeltaTime > 0 && curDeltaTime < deltaTime) {
          activity.active = true;
          activity.deltaTimePercent = Math.round(curDeltaTime * 100 / deltaTime);
        }
        else {
          activity.active = false;
          activity.deltaTimePercent = 100;
        }
      }

    }
  }

});
