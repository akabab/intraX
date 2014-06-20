angular.module('intraX')

.controller('PlanningCtrl', function ($scope, $http, $stateParams, $window, ModuleService, SessionService) {
  
  Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  $scope.date = new Date().toString();
  $scope.year = new Date().getFullYear();
  $scope.weekNumber = new Date().getWeek();
  
  $http({
    method:"get",
    url:"modules/getUserActivities",
    headers: {'Content-Type': 'application/json'}
  })
  .success(function (data) {
    $scope.data = data;
    check_week();
  });
  
  $scope.prev = function () {
    $scope.weekNumber -= 1;
    if ($scope.weekNumber <= 0) {
      $scope.year -= 1;
      $scope.weekNumber = 52;
    }
    check_week();
  };
  
  $scope.next = function () {
    $scope.weekNumber += 1;
    if ($scope.weekNumber > 52) {
      $scope.year += 1;
      $scope.weekNumber = 1;
    }
    check_week();
  };
  
  $scope.today = function () {
    $scope.weekNumber = new Date().getWeek();
    $scope.year = new Date().getFullYear();
    check_week();
  };
  
  $scope.reachActivity = function (moduleName, activityName) {
    $window.location = $window.location.origin + '/#/' + moduleName + '/' + activityName;
  }

  var check_week = function () {
    $scope.data.forEach(function (elem) {
      var workStart = elem.workStart.split("-");
      var workEnd = elem.workEnd.split("-");
      var workStartWeek = new Date(workStart[0], workStart[1] - 1, workStart[2]).getWeek();
      var workEndWeek = new Date(workEnd[0], workEnd[1] - 1, workEnd[2]).getWeek();
      
      if ($scope.weekNumber >= workStartWeek && $scope.weekNumber <= workStartWeek && workStart[0] == $scope.year) {
        console.log("ok");
        elem.visible = true;
      }
      else {
        console.log("ko");
        elem.visible = false;
      }
    });
  }
});
