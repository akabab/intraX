var app = angular.module('intraX', ['ui.router', 'intraX.services']); // 'ui.bootstrap'

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {         url: '/',                         templateUrl: '/template/index',          controller: 'IndexCtrl' })
    .state('user', {          url: '/user/:uid',                templateUrl: '/template/user',           controller: 'UserCtrl' })
    .state('ldap', {          url: '/ldap',                     templateUrl: '/template/ldap',           controller: 'LdapCtrl' })
    .state('inbox', {         url: '/inbox',                    templateUrl: '/template/inbox',          controller: 'InboxCtrl' })
    .state('module', {        url: '/module',                   templateUrl: '/template/module',         controller: 'ModuleCtrl' })
    .state('calendar', {      url: '/calendar',                 templateUrl: '/template/calendar',       controller: 'CalendarCtrl' })
    .state('conferences', {   url: '/conferences',              templateUrl: '/template/conferences',    controller: 'ConferencesCtrl' })
    .state('elearning', {     url: '/elearning',                templateUrl: '/template/elearning',      controller: 'ElearningCtrl' })
    .state('forum', {         url: '/forum',                    templateUrl: '/template/forum',          controller: 'ForumCtrl' })
    .state('category', {      url: '/forum/category/:cat/:sub', templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('adminCategory', { url: '/admin/category',           templateUrl: '/template/admin_category', controller: 'AdminCategoryCtrl' });
}]);

app.controller('SidebarCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.links = [
                  {name: 'Inbox', unseen: 5, sublinks: [{name: 'Messages', unseen: 2}, {name: 'Tickets', unseen: 0}]},
                  {name: 'Forum', unseen: 2, sublinks: []},
                  {name: 'Modules', unseen: 5, sublinks: [{name: 'Algo', unseen: 2}]},
                  {name: 'Conferences', unseen: 1, sublinks: [{name: 'News', unseen: 2}]},
                  {name: 'Ldap', unseen: 0},
                  {name: 'Elearning', unseen: 1, sublinks: [{name: 'Sem0', unseen: 2}, {name: 'Sem1', unseen: 2}, {name: 'Sem2', unseen: 2}]},
                  {name: 'Activity', unseen: 0, sublinks: [{name: 'Past', unseen: 2}]}
                  ];

  $http.get('/forum/category')
  .success(function (data) {
    for (var i in data.tree) {
      $scope.links[1].sublinks.push({name:data.tree[i].name, unseen:2, children:data.tree[i].children});
    }    
  })
  .error(function (data, status, headers, config, statusText) {
    console.log(statusText + " : " + status);
    console.log(headers);
    console.log(data);
  });

  $scope.selectLink = function (index) {
    if ($scope.selectedLink == index)
      $scope.selectedLink = -1;
    else
      $scope.selectedLink = index;
    $scope.selectedSublink = -1;
    $scope.selectedSubsublink = -1;
  }

  $scope.selectSublink = function (index) {
    if ($scope.selectedSublink == index)
      $scope.selectedSublink = -1;
    else
      $scope.selectedSublink = index;
    $scope.selectedSubsublink = -1;
  }
  
  $scope.selectSubsublink = function (index) {
    if ($scope.selectedSubsublink == index)
      $scope.selectedSubsublink = -1;
    else
      $scope.selectedSubsublink = index;
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


