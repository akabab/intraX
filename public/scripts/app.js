var app = angular.module('intraX', ['ui.router', 'intraX.services']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {         url: '/',                         templateUrl: '/template/index',          controller: 'IndexCtrl' })
    .state('user', {          url: '/user/:uid',                templateUrl: '/template/user',           controller: 'UserCtrl' })
    .state('ldap', {          url: '/ldap',                     templateUrl: '/template/ldap',           controller: 'LdapCtrl' })
    .state('inbox', {         url: '/inbox',                    templateUrl: '/template/inbox',          controller: 'InboxCtrl' })
    .state('activity', {      url: '/module/:mName/:aName',     templateUrl: '/template/activity',       controller: 'ActivityCtrl' })
    .state('module', {        url: '/module/:name',             templateUrl: '/template/module',         controller: 'ModuleCtrl' })
    .state('calendar', {      url: '/calendar',                 templateUrl: '/template/calendar',       controller: 'CalendarCtrl' })
    .state('conferences', {   url: '/conferences',              templateUrl: '/template/conferences',    controller: 'ConferencesCtrl' })
    .state('elearning', {     url: '/elearning',                templateUrl: '/template/elearning',      controller: 'ElearningCtrl' })
    .state('admin', {         url: '/admin',                    templateUrl: '/template/admin',          controller: 'AdminCtrl' })
    .state('forum', {         url: '/forum',                    templateUrl: '/template/forum',          controller: 'ForumCtrl' })
    .state('category', {      url: '/forum/category/:cat/:sub', templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('topics', {        url: '/forum/:cat',               templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('posts', {         url: '/forum/:cat/:post',         templateUrl: '/template/message',       controller: 'MessageCtrl' })
    .state('subtopics', {     url: '/forum/:cat/:sub',          templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('subposts', {      url: '/forum/:cat/:sub/:post',    templateUrl: '/template/message',       controller: 'MessageCtrl' })
    .state('adminCategory', { url: '/admin/forum/category',     templateUrl: '/template/admin_category', controller: 'AdminCategoryCtrl' });
}]);

app.controller('UserCtrl', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
  $scope.user = {};
  $scope.user.uid = $stateParams.uid;

  $http.get('/user/' + $stateParams.uid).success(function (data) {
    if (!data.error) {
      $scope.user = data;
      $scope.user.birthDate = data.birthDate.substring(6, 8) + '/' + data.birthDate.substring(4, 6) + '/' +data.birthDate.substring(0, 4);
      $scope.user.mail = data.uid + '@student.42.fr';
      $scope.user.found = true;
    }
    else {
      $scope.user.found = false;
      console.log(data);
    }
  });
}]);

app.controller('TopmenuCtrl', ['$scope', '$window', function ($scope, $window) {
  $scope.menu = '';
  $scope.dropdown = function (value) {

    $window.onclick = function (event) {
        console.log(event.target.tagName);
        if (event.target.tagName !== 'A' && event.target.tagName !== 'BUTTON') {
          $scope.menu = '';
          $scope.$apply();
        }
      };
    if ($scope.menu === value)
      $scope.menu = '';
    else
      $scope.menu = value;
  }

  $scope.search = function () {
    if ($scope.searchValue.charAt(0) == '/')
      $window.location = $scope.searchValue;
    else
      $window.location = '/#/' + $scope.searchValue;
  }
}]);

app.controller('IndexCtrl', ['$scope', '$rootScope', 'SessionService', function ($scope, $rootScope, SessionService) {
    $scope.title = "Index";
}]);

app.controller('InboxCtrl', ['$scope', 'SessionService', function ($scope, SessionService) {
  $scope.title = "Inbox";
  console.log($scope.myStyle);
}]);


app.controller('ModuleCtrl', ['$scope', function ($scope) {
    $scope.title = "Module";
}]);


app.controller('CalendarCtrl', ['$scope', function ($scope) {
    $scope.title = "Calendar";
}]);

app.controller('ConferencesCtrl', ['$scope', function ($scope) {
    $scope.title = "Conferences";
}]);

app.directive('resizable', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      $scope.myStyle = function (arg) {
        return { 'height': ($window.innerHeight - arg) + 'px' };
      }
      return $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      $scope.myStyle = function (arg) {
        return { 'height': ($window.innerHeight - arg) + 'px' };
      }
      console.log($scope.myStyle);
      return $scope.$apply();
    });
  };
});
