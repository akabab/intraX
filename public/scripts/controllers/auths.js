angular.module('intraX')

.controller('AuthCtrl', function ($scope, $rootScope, $http, $window, SessionService, $timeout) {

  var rgxLogin = /^[A-Za-z0-9 ]{3,20}$/;
  var rgxPassword = /^[A-Za-z0-9!@#$%^&*\(\)\{\}\[\]\?]{3,32}$/;

  $scope.isRequesting = false;
  $scope.isSigned = false;
  $scope.errorMessage = '';
  $scope.message = 'Sign in';

  $scope.signin = function() {
    $scope.errorMessage = '';

    if (!$scope.login || !$scope.password || !rgxLogin.test($scope.login) ) {//|| !rgxPassword.test($scope.password)) {
      $timeout(function() { $scope.errorMessage = ''; }, 2000);
      $scope.errorMessage = "Invalid data";
      return ;
    }

    $scope.isRequesting = true;
    $scope.message = 'Signing in...';

    $http.post('/auths/signin', {
      'login': $scope.login,
      'password': $scope.password
    })
    .success(function (data, status) {

      $timeout(function() { $scope.errorMessage = ''; }, 2000);

      if (!data.err) {
        $scope.isSigned = true;
        $scope.errorMessage = '';
        $scope.message = 'OK !';
        $window.location = '/';
      }
      else {
        $scope.isRequesting = false;
        $scope.errorMessage = data.err;
        $scope.message = 'Sign in';
      }

    })
    .error(function (data, status) {
      console.log(status + " : " + data);
    });
  };
});
