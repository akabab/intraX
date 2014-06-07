angular.module('intraX')

.controller('ForumCtrl', ["$scope", "$rootScope", "SessionService", "$http",
function ($scope, $rootScope, SessionService, $http) {

  //static scope variables
  $scope.welcome = "Welcome to our forum !";
  $scope.speach = "Here are the categories :"

  $scope.userTopics = [
    {title:"The cake is a lie", author:"grebett", date:new Date().toString()}
  ];
  $scope.followedTopics = [
    {title:"Ycribier is awesome", author:"ycribier", date:new Date().toString()},
    {title:"Please help me !", author:"anonymous", date:new Date().toString()}
  ];

  //dynamic scope variables
  $http({
    method: "get",
    url: "/forum/category",
    headers: {'Content-Type': 'application/json'}
  })
  .success(function (data) {
    $scope.data = data.tree;
  })
  .error(function (data, status, headers, config, statusText) {
    console.log(statusText + " : " + status);
    console.log(headers);
    console.log(data);
  });
}])

.controller('CategoryCtrl', ["$scope", "$rootScope", "SessionService", "$http", "$stateParams",
function ($scope, $rootScope, SessionService, $http, $stateParams) {

  //static scope variables
  $scope.catName = $stateParams.cat; 
  $scope.subName = $stateParams.sub;
  
  $scope.topics = [
    {title:"The cake is a lie", author:"grebett", date:new Date().toString()},
    {title:"Ycribier is awesome", author:"ycribier", date:new Date().toString()},
    {title:"Please help me !", author:"anonymous", date:new Date().toString()}
  ];
  
  $scope.add = function (topicName) {
    console.log(topicName);
    $http({
      method:"post",
      url: "/forum/topic/add",
      data: {description: topicName, categoryId:"0"}
    })
    .success(function (data) {
      console.log("success : ", data);
    })
    .error(function (data) {
      console.log("error : ", data);
    });
  };
  
}]);
