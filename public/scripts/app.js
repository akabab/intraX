var app = angular.module('intraX', ['ui.router', 'auths']);

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

app.controller('IndexCtrl', ['$scope', function ($scope) {
    $scope.title = "Index";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#index-link')).addClass('current');
  }]);


app.controller('InboxCtrl', ['$scope', function ($scope) {
    $scope.title = "Inbox";

    console.log("INBOX");
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#inbox-link')).addClass('current');
  }]);


app.controller('ModuleCtrl', ['$scope', function ($scope) {
    $scope.title = "Module";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#module-link')).addClass('current');
  }]);


app.controller('CalendarCtrl', ['$scope', function ($scope) {
    $scope.title = "Calendar";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#calendar-link')).addClass('current');
  }]);


app.controller('ConferencesCtrl', ['$scope', function ($scope) {
    $scope.title = "Conferences";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#conferences-link')).addClass('current');
  }]);


app.controller('ElearningCtrl', ['$scope', function ($scope) {
    $scope.title = "Elearning";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#elearning-link')).addClass('current');
  }]);


app.controller('ForumCtrl', ['$scope', function ($scope) {
    $scope.title = "Forum";
    angular.element(document.querySelector('.current')).removeClass('current');
    angular.element(document.querySelector('#forum-link')).addClass('current');
  }]);

