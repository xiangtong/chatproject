app.controller('MainController',['$scope','userFactory',function ($scope,userFactory) {
   $scope.page=userFactory
   console.log("page:"+$scope.page);
  }])
