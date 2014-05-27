//◤◥◣◢◤◥◣◢◤
//  ANGULAR JS
//◣◢◤◥◣◢◤◥◣

'use strict';

var app = angular.module('intraX', ["ngRoute"]);

//◤◥◣◢◤◥◣◢◤◥◣◢◤◥◣
//  STARTING CONFIG FILE
//◣◢◤◥◣◢◤◥◣◢◤◥◣◢◤

//ᚊᚊᚊᚊᚊᚊ
//  rooting
//ᚅᚅᚅᚅᚅᚅ

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      template: "<b>start</b>",       // HERE DEFINE ROOT TEMPLATE
      controller: function() { console.log ("root"); }
    })
    .when('/123', {
      templateUrl: '/template/user',  // DEFINE PARTICULIAR ROOT
      controller: function() { console.log ("template"); }
    })
    .otherwise({
      redirectTo: '/' // DEFAULT ROUTE
    });
  $locationProvider.html5Mode(true);
});


app.controller('AuthController', ['$scope', '$http', function ($scope, $http) {

  $scope.getForm = function () {
    console.log($scope.AuthForm);
  };

  var rgxLogin = /^[A-Za-z0-9 ]{6,20}$/;
  var rgxPassword = /^[A-Za-z0-9!@#$%^&*()_]{6,32}$/;

  $scope.errorMessage = '';

  $scope.signin = function() {
    var authForm = $scope.AuthForm;
    $scope.errorMessage = '';

    if (!rgxLogin.test($scope.login) || !rgxPassword.test($scope.password)) {
      $scope.errorMessage = "Invalid data";
      return ;
    }

    $http.post('/auths', {
      'login': $scope.login,
      'password': $scope.password
    }).success(function (data, status) {
      $scope.errorMessage = status + ": " + data;
    });
  };

}]);
