var app = angular.module('intraX', ['ui.router', 'intraX.services']); // 'ui.bootstrap'

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {       url: '/',            templateUrl: '/template/index',       controller: 'IndexCtrl' })
    .state('user', {        url: '/user/:uid',  templateUrl: '/template/user',        controller: 'UserCtrl' })
    .state('inbox', {       url: '/inbox',       templateUrl: '/template/inbox',       controller: 'InboxCtrl' })
    .state('module', {      url: '/module',      templateUrl: '/template/module',      controller: 'ModuleCtrl' })
    .state('calendar', {    url: '/calendar',    templateUrl: '/template/calendar',    controller: 'CalendarCtrl' })
    .state('conferences', { url: '/conferences', templateUrl: '/template/conferences', controller: 'ConferencesCtrl' })
    .state('elearning', {   url: '/elearning',   templateUrl: '/template/elearning',   controller: 'ElearningCtrl' })
    .state('forum', {       url: '/forum',       templateUrl: '/template/community',   controller: 'ForumCtrl' });
    .state('category', {    url: '/category/:cat/:sub', templateUrl: '/template/category', controller: 'CategoryCtrl' });
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

app.controller('SidebarCtrl', ['$scope', function ($scope) {
  $scope.links = [
                  {name: 'Inbox', unseen: 5, sublinks: [{name: 'Messages', unseen: 2}, {name: 'Tickets', unseen: 0}]},
                  {name: 'Forum', unseen: 2, sublinks: [{name: 'General', unseen: 2}]},
                  {name: 'Modules', unseen: 5, sublinks: [{name: 'Algo', unseen: 2}]},
                  {name: 'Conferences', unseen: 1, sublinks: [{name: 'News', unseen: 2}]},
                  {name: 'Activity', unseen: 0, sublinks: [{name: 'Past', unseen: 2}]}
                  ];

  $scope.selectLink = function (index) {
      $scope.selectedLink = index;
      $scope.selectedSublink = -1;
  }

  $scope.selectSublink = function (index) {
      $scope.selectedSublink = index;
  }

}]);

app.controller('TopmenuCtrl', ['$scope', '$window', function ($scope, $window) {
  $scope.isDropdown = false;

  $scope.dropdown = function () {
    $window.onclick = null;
    $scope.isDropdown = !$scope.isDropdown;

    if ($scope.isDropdown) {
      $window.onclick = function (event) {
          $scope.isDropdown = false;
          $scope.$apply();
      };
    }
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


app.controller('ElearningCtrl', ['$scope', function ($scope) {
    $scope.title = "Elearning";
}]);


app.controller('ForumCtrl', ['$scope', function ($scope) {
    $scope.title = "Forum";
}]);
