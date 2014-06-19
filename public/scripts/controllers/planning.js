angular.module('intraX')

.controller('PlanningCtrl', function ($scope, $http, $stateParams, $window, ModuleService, SessionService) {
  $http({
    method:"get",
    url:"modules/getUserActivities",
    headers: {'Content-Type': 'application/json'}
  })
  .success(function (data) {
    $scope.data = data;
  });
});
