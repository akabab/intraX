angular.module('intraX')

.controller('ForumCtrl', ["$scope", "$rootScope", "SessionService", "$http",
function ($scope, $rootScope, SessionService, $http) {

  //static scope variables
  $scope.welcome = "Welcome to our forum, ";
  $scope.speach = "Here are the categories :"

  //dynamic scope variables
  $http.get("/category")
  .success(function (data) {
    $scope.data = data.data;
    console.log("success");
    console.log(data);
  })
  .error(function (data, status, headers, config, statusText) {
    console.log("There is an error");
    console.log(statusText + " : " + status);
    console.log(headers);
    console.log(data);
  });
}])

.controller('CategoryCtrl', ["$scope", "$rootScope", "SessionService", "$http", "$stateParams",
function ($scope, $rootScope, SessionService, $http, $stateParams) {

  //static scope variables
  $scope.catName = $stateParams.cat;
  $scope.subName = $stateParams.sub;
}]);
