var app = angular.module('intraX', ['ui.router', 'intraX.services']); // 'ui.bootstrap'

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {       url: '/',            templateUrl: '/template/index',       controller: 'IndexCtrl' })
    .state('inbox', {       url: '/inbox',       templateUrl: '/template/inbox',       controller: 'InboxCtrl' })
    .state('module', {      url: '/module',      templateUrl: '/template/module',      controller: 'ModuleCtrl' })
    .state('calendar', {    url: '/calendar',    templateUrl: '/template/calendar',    controller: 'CalendarCtrl' })
    .state('conferences', { url: '/conferences', templateUrl: '/template/conferences', controller: 'ConferencesCtrl' })
    .state('elearning', {   url: '/elearning',   templateUrl: '/template/elearning',   controller: 'ElearningCtrl' })
    .state('forum', {       url: '/forum',       templateUrl: '/template/community',   controller: 'ForumCtrl' });
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

app.controller('TopmenuCtrl', ['$scope', function ($scope) {
  $scope.isDropdown = false;

  $scope.dropdown = function () {
    $scope.isDropdown = !$scope.isDropdown;
  }
}]);

app.controller('IndexCtrl', ['$scope', '$rootScope', 'SessionService', function ($scope, $rootScope, SessionService) {
    $scope.title = "Index";

    $rootScope.user = SessionService.get("user");
}]);

app.controller('InboxCtrl', ['$scope', 'SessionService', function ($scope, SessionService) {
    $scope.title = "Inbox";

    $scope.firstName = SessionService.get("firstName");
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
