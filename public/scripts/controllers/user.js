angular.module('intraX')

.controller('UserCtrl', function ($scope, $stateParams, $http, SessionService) {
  $scope.user = {};
  $scope.user.uid = $stateParams.uid;
  
  $scope.isRequesting = true;

  $http.get('/user/' + $stateParams.uid).success(function (data) {

    if (!data.error) {
      $scope.user = data;
      console.log(data);
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


});
