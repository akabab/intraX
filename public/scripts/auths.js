angular.module('intraX').controller('AuthCtrl', function ($scope, $rootScope, $http, $window, SessionService) {

  var rgxLogin = /^[A-Za-z0-9 ]{3,20}$/;
  var rgxPassword = /^[A-Za-z0-9!@#$%^&*\(\)\{\}\[\]\?]{3,32}$/;

  $scope.isRequesting = false;
  $scope.errorMessage = '';
  $scope.message = 'Sign in';

  $scope.signin = function() {
    // console.log($scope.login, $scope.password);

    $scope.errorMessage = '';

    if (!$scope.login || !$scope.password || !rgxLogin.test($scope.login) || !rgxPassword.test($scope.password)) {
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
      $scope.isRequesting = false;

        if (!data.err) {
        $scope.errorMessage = '';
        SessionService.set("user", {
          firstName: data.user.firstName,
          lastName: data.user.lastName
        });
        $window.location = '/';
      }
      else {
        $scope.errorMessage = data.err;
        $scope.message = 'Sign in';
      }
    });
  };
});
