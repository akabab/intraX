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
    url: "/forum/category/",
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
  $scope.isAdmin = true;
  
  if (typeof($scope.subName) !== "undefined")
    $scope._prefix = $scope.catName + "/" + $scope.subName + "/";
  else
    $scope._prefix = $scope.catName + "/";
    
  $http({
    method: "get",
    url: "/forum/  topic/123456789012345678901234"
  })
  .success(function (data) {
    $scope.topics = data;
  })
  .error(function (data) {
    console.log("error");
  });
  
  $scope.add = function (topicName) {
    console.log(topicName);
    $http({
      method:"post",
      url: "/forum/topic/add",
      data: {description: topicName, categoryId:"123456789012345678901234"}
    })
    .success(function (data) {
      $scope.topics = data;
      console.log("success : ", data);
    })
    .error(function (data) {
      console.log("error : ", data);
    });
  };
  
  $scope.del = function (topicId) {
    console.log(topicId);
    $http({
      method:"post",
      url: "/forum/topic/del",
      data: {topicId: topicId, categoryId:"123456789012345678901234"}
    })
    .success(function (data) {
      $scope.topics = data;
      console.log("success : ", data);
    })
    .error(function (data) {
      console.log("error : ", data);
    });
  };
}])
  
.controller('MessageCtrl', ["$scope", "$rootScope", "SessionService", "$http", "$stateParams",
function ($scope, $rootScope, SessionService, $http, $stateParams) {
  var a = $stateParams;
  console.log(a.cat + " / " + a.sub + " / " + a.post);
  
//   $http({
//     method:"post",
//     url:"forum/topic/post/id"
//     data:{something:somewhat}
//   })
//   .success(function (data) {
//     $scope.messages = data;
//   })
//   .error(function (data) {
//     console.log("error");
//   });
// });

  // dummy data
  $scope.messages = [
    {id:"1234567890", author:"grebett", content:"lorem ipsum sic dolor", date:"21/01/1970", comments: [{author:"ycribier", content:"et felice pacem !", date:"22/04/1087"}]},
    {id:"0987654321", author:"cdenis", content:"lorem ipsum sic dolor", date:"01/11/1990", comments: [
      {author:"adjivas", content:"et felice pacem !", date:"05/09/3085"},
      {author:"grebett", content:"et felice pacem !", date:"05/09/2085"}]
    }
  ];

  $scope.comment = function (id) {
    $scope.commenting = id;
  };
  $scope.valid = function (content, index) {
    console.log(content);
    document.getElementById("commentBox" + index).firstChild.value = "";
    $scope.commenting = false;
  };
  
  $scope.editMessage = function (id, content) {
    $scope.messages = id, content;
  };
  
  $scope.editComment = function (id, content) {
    $scope.comments = content;
  };
  
  $scope.answer = function (content) {
    $scope.bouh = content;
    console.log(content);
  }
  
  
  
  
}]);
