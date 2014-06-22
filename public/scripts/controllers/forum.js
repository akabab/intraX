angular.module('intraX')

.controller('ForumCtrl', ["$scope", "$rootScope", "SessionService", "$http",
function ($scope, $rootScope, SessionService, $http) {

  //static scope variables
  $scope.welcome = "Welcome to our forum !";

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
    console.log(data);
  })
  .error(function (data, status, headers, config, statusText) {
    console.log(statusText + " : " + status);
    console.log(headers);
    console.log(data);
  });
}])

.controller('CategoryCtrl', ["$scope", "$rootScope", "SessionService", "$http", "$stateParams",
function ($scope, $rootScope, SessionService, $http, $stateParams) {

  console.log($stateParams);
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
    url: "/forum/category"
  })
  .success(function (data) {
    data.forEach(function (cat) {
      if (cat.url === $scope.catName) {
        if (typeof($scope.subName) !== "undefined") {
          cat.children.forEach(function (sub) {
            $scope.categoryId = sub.id;
          });
        }
        else {
          $scope.categoryId = cat.id;
        }
        console.log($scope.catName, $scope.subName, $scope.categoryId);
      }
    });
  });
  
  
  $http({
    method: "get",
    url: "/forum/topic/" + $scope.catName + "/" + $scope.subName
  })
  .success(function (data) {
    $scope.topics = data.topics;
    console.log(data);
  })
  .error(function (data) {
    console.log("error");
  });
  
  $scope.add = function (title, content) {
    console.log(content);
    $http({
      method:"post",
      url: "/forum/topic/new",
      data: {description: title, contenue: content, idCategory: $scope.categoryId}
    })
    .success(function (data) {
      $http({
        method: "get",
        url: "/forum/topic/" + $scope.catName + "/" + $scope.subName
      })
      .success(function (data) {
        $scope.topics = data.topics;
        console.log(data);
      })
      .error(function (data) {
        console.log("error");
      });
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
  $http({
    method:"get",
    url:"forum/message/" + a.cat + "/" + a.sub + "/" + a.post
  })
  .success(function (data) {
    $scope.messages = data.tree;
    $scope.idTopic = data.idTopic;
    console.log("data:", data);
  })
  .error(function (data) {
    console.log("error");
  });


  $scope.comment = function (content, id) {
    console.log("id: %s /// content: %s", id, content)
    $http({
      method:"post",
      url:"forum/message/add",
      data:{idTopic:$scope.idTopic, contenue:content, idMessageParent:id}
    })
    .success(function (data) {
      console.log("it works!");
      $http({
        method:"get",
        url:"forum/message/" + a.cat + "/" + a.sub + "/" + a.post
      })
      .success(function (data) {
        $scope.messages = data.tree;
        $scope.idTopic = data.idTopic;
        console.log("data:", data);
      })
      .error(function (data) {
        console.log("error");
      });
    })
    .error(function (data) {
      console.log(data);
    });
  };
  
  
  $scope.answer = function (content) {
    $scope.bouh = content;
    
    $http({
      method:"post",
      url:"forum/message/add",
      data:{idTopic:$scope.idTopic, contenue:content, idMessageParent:""}
    })
    .success(function (data) {
      $http({
        method:"get",
        url:"forum/message/" + a.cat + "/" + a.sub + "/" + a.post
      })
      .success(function (data) {
        $scope.messages = data.tree;
        $scope.idTopic = data.idTopic;
        console.log("data:", data);
      })
      .error(function (data) {
        console.log("error");
      });
    })
    .error(function (data) {
      console.log(data);
    });
  };
  
  
  
  
}]);
