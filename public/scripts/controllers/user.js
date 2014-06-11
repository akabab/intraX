angular.module('intraX')

.controller('UserCtrl', function ($scope, $stateParams, $http, SessionService) {
  $scope.user = {};
  $scope.user.uid = $stateParams.uid;
  $scope.user.Found = false;
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

  $scope.askToken = function () {
    $scope.askingToken = true;
  }

  $scope.getCurrentToken = function () {

    console.log("yo");

    $http.post('/auths/autologin/get', {'password': $scope.password})
    .success(function (data) {
      if (!data.err) {
        $scope.askingToken = false;
        $scope.token = data.token;
      }
      else
        $scope.errorMessage = data.err;
      })
    .error(function (err) {});
  };

  $scope.getNewToken = function () {

    $http.post('/auths/autologin/new', {'password': $scope.password})
    .success(function (data) {
      if (!data.err) {
        $scope.token = data.token;
      }
      else
        $scope.errorMessage = data.err;
    })
    .error(function (err) {});
  };

/*  (function() {
    window.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        event = event || window.event; // IE-ism
        console.log(event.clientX);// and event.clientY contain the mouse position
    }
})();*/

});
