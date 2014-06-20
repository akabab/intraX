angular.module('intraX')

.controller('ElearningCtrl', ['$scope', function ($scope) {
    $scope.title = "Elearning";

    $scope.video = {
      title: 'libft',
      module: '[algo-1-001]',
      categ: 'algo',
      file: "[algo-1-001]-libft.mp4",
      type: 'mp4'
    };

}]);
