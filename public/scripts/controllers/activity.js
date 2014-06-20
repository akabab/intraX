angular.module('intraX')

.controller('ActivityCtrl', function ($scope, $http, $stateParams, ModuleService, SessionService) {

  $scope.moduleAsked = $stateParams.mName;
  $scope.activityAsked = $stateParams.aName;
  $scope.module = {};
  $scope.activity = {};
  $scope.canRegister = false;
  $scope.isRegistred = true;
  $scope.isRequesting = true;

  var user = SessionService.get('user');

  var setRegisterVal = function () {
    var users = $scope.activity.users;

    var subStart_ts = dateToTimestamp($scope.activity.subStart);
    var subEnd_ts = dateToTimestamp($scope.activity.subEnd);
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
  };

  $scope.getModule = function (moduleName) {
    $scope.isRequesting = true;

    ModuleService.getModule(moduleName).then(function (data) {
      $scope.module = data[0];

      $scope.isRequesting = false;
    }, function (err) {
      $scope.isRequesting = false;
    });
  };

  $scope.getActivity = function (moduleName, activityName) {
    $scope.isRequesting = true;

    ModuleService.getActivity(moduleName, activityName).then(function (data) {
      $scope.activity = data[0];
      if ($scope.activity)
        setRegisterVal();
      $scope.isRequesting = false;
      // getActivityCurTime();
    }, function (err) {
      $scope.isRequesting = false;
      console.log(err);
    });
  };

  $scope.subscribe = function (moduleName, activity) {
    activity.moduleId = $scope.module._id;

    ModuleService.activitySubscribe(moduleName, activity).then(function (data) {
      $scope.activity = data[0];
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
