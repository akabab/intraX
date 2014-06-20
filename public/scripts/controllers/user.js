angular.module('intraX')

.controller('UserCtrl', function ($scope, $stateParams, $http, $timeout, SessionService) {
  $scope.user = {};
  $scope.user.uid = $stateParams.uid;
  $scope.user.found = false;
  $scope.isRequesting = true;
  $scope.askingToken = false;

  //Get User info
  $http.get('/user/' + $stateParams.uid).success(function (data) {

    if (!data.error) {
      $scope.user = data;
      $scope.user.birthDate = data.birthDate.substring(6, 8) + '/' + data.birthDate.substring(4, 6) + '/' +data.birthDate.substring(0, 4);
      $scope.user.mail = data.uid + '@student.42.fr';
      $scope.user.found = true;

      if (data.isMe && !SessionService.get("user"))
        SessionService.set("user", $scope.user);
    }
    else {
      $scope.user.found = false;
    }

    $scope.isRequesting = false;
  });


  $scope.showToken = function () {
    $scope.tokenShow = true;
    $scope.password = '';
  }

  $scope.getCurrentToken = function () {

    $http.post('/auths/autologin/get', {'password': $scope.password})
    .success(function (data) {
      if (!data.err) {
        $scope.token = data.token ? data.token : 'No current token';
      }
      else {
        $scope.errorMessage = data.err;
        $timeout(function() { $scope.errorMessage = ''; }, 2000);
      }
    })
    .error(function (err) {});
  };

  $scope.getNewToken = function () {

    $http.post('/auths/autologin/new', {'password': $scope.password})
    .success(function (data) {
      if (!data.err)
        $scope.token = data.token;
      else {
        $scope.errorMessage = data.err;
        $timeout(function() { $scope.errorMessage = ''; }, 2000);
      }
    })
    .error(function (err) {});
  };

  $scope.delToken = function () {

    $http.post('/auths/autologin/del', {'password': $scope.password})
    .success(function (data) {
      if (!data.err) {
        $scope.token = data.token ? data.token : 'No current token';
      }
      else {
        $scope.errorMessage = data.err;
        $timeout(function() { $scope.errorMessage = ''; }, 2000);
      }
    })
    .error(function (err) {});
  };

});
