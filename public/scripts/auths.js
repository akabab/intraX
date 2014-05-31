angular.module('intraX').controller('AuthCtrl', function ($scope, $rootScope, $http, $window, SessionService) {

  $scope.getForm = function () {
    console.log($scope.AuthForm);
  };

  var rgxLogin = /^[A-Za-z0-9 ]{5,20}$/;
  var rgxPassword = /^[A-Za-z0-9!@#$%^&*\(\)\{\}\[\]\?]{5,32}$/;

  $scope.errorMessage = '';

  $scope.signin = function() {
    var authForm = $scope.AuthForm;
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
        SessionService.set("user", angular.toJson({
          firstName: data.user.firstName,
          lastName: data.user.lastName
        }));
        $window.location = '/';
      }
      else {
        $scope.errorMessage = status + ": " + data.err;
      }
    });
  };
});
