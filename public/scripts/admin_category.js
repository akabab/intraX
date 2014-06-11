angular.module('intraX')

.controller('AdminCategoryCtrl', ["$scope", "$rootScope", "SessionService", "$http",
function ($scope, $rootScope, SessionService, $http) {

  //static scope variables
  $scope.welcome = "Welcome to our admin category !";
  
  //methods
  $scope.father = function (nb, id) {
    $scope.fatherIndex = nb;
    $scope.selectedCategory = id;
  };
  $scope.son = function (nb, id) {
    $scope.sonIndex = nb;
    $scope.selectedCategory = id;
  };
  
  $scope.add = function (name) {
    $scope.flash = "New category " + name + " added ";
    if ($scope.selectedCategory)
      $scope.flash += " in " + $scope.selectedCategory;
    else
      $scope.flash += ".";
    $scope.selectedCategory = false;
  };
  
  $scope.delete = function (id) {
    $scope.flash = id + " has been deleted";
    $scope.selectedCategory = false;
  };
  
  $scope.modify = function (id) {
    $scope.modifyCategory = id;
    $scope.modifying = true;
    $scope.flash = id + " is ready to be modified";
  };
  
  // valid a modification
  $scope.valid = function (id) {
    $scope.modifying = false;
    $scope.flash = id + " has been modified";
    $scope.selectedCategory = false;
    $scope.modifyCategory = false;
  };
  
  // blur after modification
  $scope.blured = function (id) {
    $scope.flash = id + " has been blured";
  };
  
  $scope.clear = function () {
    $scope.flash = "";
  };
  
  
  //dynamic scope variables
  $http({
    method: "get",
    url: "category",
    headers: {'Content-Type': 'application/json'}
  })
  .success(function (data) {
    $scope.data = data.tree;
    console.log(data.tree);
  })
  .error(function (data, status, headers, config, statusText) {
    console.log(statusText + " : " + status);
    console.log(headers);
    console.log(data);
  });
}]);
