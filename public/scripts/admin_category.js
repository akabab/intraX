angular.module('intraX')

.controller('AdminCategoryCtrl', ["$scope", "$rootScope", "SessionService", "$http",
function ($scope, $rootScope, SessionService, $http) {

  //static scope variables
  $scope.welcome = "Welcome to our admin category !";
  $scope.selectedCategory = "";
  
  //methods
  $scope.father = function (nb, id) {
    $scope.fatherIndex = nb;
    $scope.selectedCategory = id;
  };
  $scope.son = function (nb, id) {
    $scope.sonIndex = nb;
    $scope.selectedCategory = id;
  };
  
  $scope.unselect = function () {
    $scope.selectedCategory = false;
  };
  
  $scope.add = function (name) {
    
    var parentId = (($scope.selectedCategory === false) ? "" : $scope.selectedCategory);
    $http({
      method:"post",
      url:"forum/category/add",
      data: {addName: name, addIdParent: parentId}
    })
    .success(function (data) {
        console.log("success : ", data);
        $scope.data = data.tree;
    })
    .error(function (data) {
        console.log("error : ", data);
    });
        
    $scope.flash = "New category " + name + " added ";
    if ($scope.selectedCategory)
      $scope.flash += " in " + $scope.selectedCategory;
    else
      $scope.flash += ".";
    $scope.selectedCategory = false;
  };
  
  $scope.delete = function (id) {
    
    $http({
      method:"post",
      url:"forum/category/del",
      data: {delIdChild: id}
    })
    .success(function (data) {
        console.log("success : ", data);
        $scope.data = data.tree;
    })
    .error(function (data) {
        console.log("error : ", data);
    });
    
    $scope.flash = id + " has been deleted";
    $scope.selectedCategory = false;
  };
  
  $scope.modify = function (id) {
    $scope.modifyCategory = id;
    $scope.modifying = true;
    
    /*** here add modifying api call ***/
    
    $scope.flash = id + " is ready to be modified";
  };
  
  // valid a modification
  $scope.valid = function (id) {
    $scope.modifying = false;
    $scope.flash = id + " has been modified";
    $scope.selectedCategory = false;
    $scope.modifyCategory = false;
  };
  
  $scope.cancel = function () {
    $scope.modifying = false;
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
    url: "forum/category",
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
