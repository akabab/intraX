angular.module('intraX').controller('AuthCtrl', function ($scope, $rootScope, $http, $window, SessionService) {

  var rgxLogin = /^[A-Za-z0-9 ]{3,20}$/;
  var rgxPassword = /^[A-Za-z0-9!@#$%^&*\(\)\{\}\[\]\?]{3,32}$/;

  $scope.errorMessage = '';

  $scope.signin = function() {
    $scope.errorMessage = '';

    if (!rgxLogin.test($scope.login) || !rgxPassword.test($scope.password)) {
      $scope.errorMessage = "Invalid data";
      return ;
    }

    $http.post('/auths/signin', {
      'login': $scope.login,
      'password': $scope.password
    }).success(function (data, status) {
      if (!data.err) {
        SessionService.set("user", {
          firstName: data.user.firstName,
          lastName: data.user.lastName
        });
        $window.location = '/';
      }
      else {
        $scope.errorMessage = data.err;
      }
    });
  };
});
