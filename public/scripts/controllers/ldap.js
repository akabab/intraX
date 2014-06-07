angular.module('intraX')

.controller('LdapCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  $scope.predicate = 'uid';

  $scope.showUser = function (uid) {
    console.log(uid);
    $window.location = '#/user/' + uid;
  };

  $http.get('/user/all')
  .success(function (data) {
    $scope.users = data;
    // console.log(JSON.stringify(data));
  })
  .error(function (data, status) {
    console.log('Error user/all')
  });

}]);
