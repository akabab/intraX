var app = angular.module('intraX', ['ui.router', 'ngSanitize', 'intraX.services']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {         url: '/',                         templateUrl: '/template/index',          controller: 'IndexCtrl' })
    .state('user', {          url: '/user/:uid',                templateUrl: '/template/user',           controller: 'UserCtrl' })
    .state('ldap', {          url: '/ldap',                     templateUrl: '/template/ldap',           controller: 'LdapCtrl' })
    .state('inbox', {         url: '/inbox',                    templateUrl: '/template/inbox',          controller: 'InboxCtrl' })
    .state('messages', {      url: '/inbox/messages',           templateUrl: '/template/messages',       controller: 'InboxCtrl' })
    .state('tickets', {       url: '/inbox/tickets',            templateUrl: '/template/tickets',        controller: 'InboxCtrl' })
    .state('module', {        url: '/module/:name',             templateUrl: '/template/module',         controller: 'ModuleCtrl' })
    .state('activity', {      url: '/module/:mName/:aName',     templateUrl: '/template/activity',       controller: 'ActivityCtrl' })
    .state('calendar', {      url: '/calendar',                 templateUrl: '/template/calendar',       controller: 'CalendarCtrl' })
    .state('conferences', {   url: '/conferences',              templateUrl: '/template/conferences',    controller: 'ConferencesCtrl' })
    .state('elearning', {     url: '/elearning',                templateUrl: '/template/elearning',      controller: 'ElearningCtrl' })
    .state('admin', {         url: '/admin',                    templateUrl: '/template/admin',          controller: 'AdminCtrl' })
    .state('planning', {      url: '/planning',                 templateUrl: '/template/planning',       controller: 'PlanningCtrl' })
    .state('forum', {         url: '/forum',                    templateUrl: '/template/forum',          controller: 'ForumCtrl' })
    .state('category', {      url: '/forum/category/:cat/:sub', templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('topics', {        url: '/forum/:cat',               templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('posts', {         url: '/forum/:cat/:post',         templateUrl: '/template/message',        controller: 'MessageCtrl' })
    .state('subtopics', {     url: '/forum/:cat/:sub',          templateUrl: '/template/category',       controller: 'CategoryCtrl' })
    .state('subposts', {      url: '/forum/:cat/:sub/:post',    templateUrl: '/template/message',        controller: 'MessageCtrl' })
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
    }
  });
}]);

app.controller('TopmenuCtrl', ['$scope', '$window', '$http', function ($scope, $window, $http) {
  $scope.menu = '';
  $scope.searchHelp = 'Search...';
  $scope.searchShow = 'All';
  $scope.searchValue = '';
  $scope.searchDone = false;
  $scope.searchPosition = 0;
  $scope.users = '';
  $scope.commands = [
    {"name":'/logout', 'alias':'/quit', 'description':'Log out of the intra', 'icon':'power-off '},
    {"name":'/clear', 'alias':'/all', 'description':'Clear the selected search', 'icon':'eraser'},
    {"name":'/dummy1', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy2', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy3', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy4', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy5', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy6', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/dummy7', 'alias':'', 'description':'Just a dummy command', 'icon':'question'},
    {"name":'/message', 'alias':'/whisper', 'description':'Send a private message to...', 'icon':'comment-o'},
  ];
  $scope.searchOptions = [
    {"name":'LDAP'},
    {"name":'Forum'},
    {"name":'Inbox'},
    {"name":'E-learning'},
    {"name":'Modules'},
    {"name":'Conferences'}
  ];
  function clearSearchMenu () {
    $scope.searchShow = 'All';
    $scope.searchHelp = 'Search...';
  }
  function setSearchMenu (arg) {
    $scope.searchShow = arg;
    $scope.searchHelp = "Hit 'Esc' to clear...";
  }
  $scope.isValidSearch = function (domId) {
    var elem = angular.element(document.querySelector(domId))[0];
    if (!elem || !elem.attributes.arg) { return "false"; }
    return elem.attributes.arg.value;
  }
  $scope.onKeyPress = function ($event) {
    var k = $event.keyCode;
    switch (k) {
      case 8: // Del
        $scope.searchDone = false;
        // if (!$scope.searchValue) { $scope.searchShow = 'All'; }
        break;
      case 9: // Tab
        if (!$scope.searchValue) { break; }
        var valid = true;
        var searched = $scope.searchValue.toLowerCase();
        switch (searched) {
          case 'all':
          case '/all':
          case '/clear':
          case 'clear':
            clearSearchMenu(); break;
          default:
            var elem = $scope.isValidSearch('#el-' + $scope.searchPosition);
            if (elem === "false") {
              valid = false;
              elem = $scope.isValidSearch('#res-' + $scope.searchPosition)
              if (elem !== "false") {
                valid = "OK";
                $scope.searchPosition = 0;
                $scope.searchValue = elem;
              }
            }
            else {
              switch (elem) {
                case "LDAP":
                  if ($scope.users === '') {
                    $http.get('/user/all')
                    .success(function (data) { $scope.users = data; })
                    .error(function (data, status) { console.log('Error:', status); });
                  } break;
                default: break;
              }
              setSearchMenu(elem);
            } break;
        }
        if (valid) {
          if (valid === true)
            $scope.searchValue = '';
          $scope.searchDone = true;
        }
        $event.preventDefault();
        break;
      case 13: // Enter
        break;
      case 40: // Down
        $event.preventDefault();
        if ($scope.searchPosition > 8)
          $scope.searchPosition = 0;
        else
          $scope.searchPosition++;
        break;
      case 38: // Up
        $event.preventDefault();
        if ($scope.searchPosition < 1)
          $scope.searchPosition = 9;
        else
          $scope.searchPosition--;
        break;
      case 27: // Esc
        $event.preventDefault();
        if ($scope.searchValue)
          $scope.searchValue = '';
        else
          clearSearchMenu();
        break;
      case 191: // slash
        break;
      default:
//        if ($scope.searchValue.length === 0) console.log(k);
        if ((k > 47 && k < 91) || (k > 95 && k < 112) || (k > 185)) {
          $scope.searchDone = false;
          $scope.searchPosition = 0;
        }
        break;
    }
  }
  $scope.searchbar = angular.element(document.querySelector('#search-input'))[0];
  $scope.optionSelected = function (arg) {
    if (arg)
      setSearchMenu(arg.option.name);
    else
      clearSearchMenu();
    $scope.searchbar.focus();
  }
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
    if ($scope.searchShow === 'LDAP') {
      console.log('/#/user' + $scope.searchValue);
      $window.location = '/#/user/' + $scope.searchValue;
      $scope.searchValue = '';
    }
    else if ($scope.searchValue && $scope.searchValue.length && $scope.searchValue.charAt(0) === '/')
      $window.location = $scope.searchValue;
    else
      $window.location = '/#/' + $scope.searchValue;
  }
}]);

app.controller('IndexCtrl', ['$scope', '$rootScope', 'SessionService', function ($scope, $rootScope, SessionService) {
    $scope.title = "Index";
}]);

app.controller('InboxCtrl', ['$scope', 'SessionService', function ($scope, SessionService) {
  var fakeMsg = {
    "from": "cdenis",
    "title": "Je suis nul, j'ai pas vu l'inscription J04",
    "resolved": true,
    "content": "J'ai rate l'inscription du Jour 04 : /\n\nC'est une erreur et rien de volontaire si jammais j'ai une chance de la ratrapper je suis preneur, sinon tampis je ferais les exo J04 quand même.",
    "comments": [
      { "from":"sgregory", "content":"Bonjour,\nNon. Fais quand meme les exercices et fais attention la prochaine fois.\nCordialement.", "date":212316 },
      { "from":"zaz", "content":"En effet, dans ce cas la tu sert a rien.\n\n Cordialement", "date":212955 },
    ]
  };
  $scope.tickets = [ fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg , fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg , fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg, fakeMsg ];
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

app.filter('fuzzyFilter', function () {
  function fuzzySearchString (sub, pattern) {
    if (typeof sub !== "string") { return; }
    var string = sub;
    string = string.toLowerCase();
    var patternIdx = 0;
    var result = sub.split('');
    var len = string.length;
    var totalScore = 0;
    var currScore = 0;
    var inBold = '';
    for(var idx = 0; idx < len; idx++) {
      var at = string.charAt(idx);
      if (at === pattern.charAt(patternIdx)) {
        patternIdx++;
        inBold = '<b>' + sub.charAt(idx) + '</b>';
        var isCap = (sub.charAt(idx) !== at);
        currScore += 1 + currScore;
        if (isCap)
          currScore++;
        if (!idx)
          currScore += 2;
        else {
          switch (string.charAt(idx - 1)) {
            case ' ':
            case '.':
            case '_':
            case '-':
            case '(':
            case '{':
            case '[':
            case '|':
            case '\\':
            case '/':
            case '<':
            case ',':
              currScore += 2; break;
            default: break;
          }
        }
        result[idx] = inBold;
      }
      else
        currScore = 0;
      totalScore += currScore;
    }
    return {'html':result, 'score':totalScore, 'index':patternIdx};
  }
  return function (items, pattern) {
    if (angular.isUndefined(items) || angular.isUndefined(pattern))
      return items;
    var patLen = pattern.length;
    if (patLen < 1)
      return items;
    var whitelist = {
      "name":true,
      "uid":true,
      "alias":true,
      "fullName":true
    };

    var tempItems = [];
    for (var k = items.length - 1; k >= 0; k--) {
      item = items[k];
      var count = 0;
      if (item.hasOwnProperty('firstName')
        && item.hasOwnProperty('lastName')
        && !item.hasOwnProperty('fullName'))
        item.fullName = item.firstName + ' ' + item.lastName;
      item.score = 0;
      item.matched = false;
      item.html = '';
      for (var key in item) {
        if (whitelist.hasOwnProperty(key)) {
          count++;
          var result = fuzzySearchString(item[key], pattern.toLowerCase());
          item.html += '<span class="fuzzy pt-' + count + '">' + result.html.join('') + '</span>';
          if (item.score < result.score)
            item.score = result.score;
          if (result.index === patLen)
            item.matched = true;
        }
      }
      tempItems.push(item);
    }
    return tempItems;
  }
});

app.directive('resizable', function($window) {
  return function ($scope) {
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
      return $scope.$apply();
    });
  };
});
