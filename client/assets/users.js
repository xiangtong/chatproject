app.factory('userFactory',['$http','$location', function($http,$location){
   var factory = {};
   factory.checkstatus=function(callback){
     $http.get('/checkstatus').then(
       function(res){
         if(!res.data){
           $location.url('/')
         } else {
          //  console.log(res.data);
           callback(res.data)
         }
       }
     )
   }
   factory.register = function(newuser,callback){
     $http.post('/register',newuser).then(
       function(res){
         callback(res.data)
       },
       function(res){
         callback(res.data)
       }
     )
   }
   factory.login = function(user,callback){
     $http.post('/login',user).then(
       function(res){
         callback(res.data)
       },
       function(res){
         callback(res.data)
       }
     )
   }
   factory.logout = function(callback){
     $http.get('/logout').then(
       function(res){
        //  console.log(res);
         callback(res.data)
       },
       function(res){
        //  console.log(res);
         callback(res.data)
       }
     )
   }
   return factory;
}])

app.controller('UsersController',['$scope','userFactory','$location','$cookies','$routeParams',function ($scope,userFactory,$location,$cookies,$routeParams) {
  // $scope.userlist=[]
  // console.log("enter controller");
  if($cookies.get('successmessage')){
      $scope.successmessage=$cookies.get('successmessage')
      $cookies.remove('successmessage')
  }
  // $scope.test=[1,2,3]
  // if($cookies.get('userlist')){
  //     $scope.userlist=$cookies.get('userlist')
  //     console.log('**************');
  //     console.log($scope.userlist);
  //     $cookies.remove('userlist')
  // }
  if($routeParams){
    if($routeParams.userid){
      userFactory.checkstatus(function(data){
          $scope.user=data
          console.log(data);
          if(!$cookies.get(!'iffirst')){
            $scope.socket = io.connect();
            $cookies.put('iffirst',1)
            $scope.socket.emit("newuser", {username: data.username,userid:data._id});
            $scope.socket.on('currentusers', function (sdata){
                console.log('The server says: ' + sdata);
                $scope.$apply(function(){
                  $scope.userlist=sdata.users
                  $scope.iomessage=sdata.iomessage
                  console.log($scope.userlist);
                })
            });
          }
      })
    }
  }

  userFactory.checkstatus(function(data){
      $scope.user=data
      if($scope.user&&$location.path()=='/'){
        url='/profile/'+data.user._id
        $cookies.remove('iffirst')
        $location.url(url)
      }
  })

  $scope.register=function(){
    userFactory.register($scope.newuser,function (data){
      if(data.user){
        $scope.newuser={}
        $scope.user=data.user
        $cookies.put('successmessage', data.info)
        url='/profile/'+data.user._id
        $location.url(url)
        }
        else {
          $scope.message=data.info
        }
      })
  };
  $scope.login=function(){
    userFactory.login($scope.loginuser,function (data){
      if(data.user){
        $scope.loginuser={}
        $scope.user=data.user
        $cookies.put('successmessage', data.info)
        url='/profile/'+data.user._id
        $location.url(url)
        }
        else {
          $scope.message=data.info
        }
    })
  };
  $scope.logout=function(){
    userFactory.logout(function (data){
      if(data.info){
        $cookies.put('successmessage', data.info)
        console.log('*****************');
        console.log({username: $scope.user.username,userid:$scope.user._id});
        $scope.socket.emit("logout", {username: $scope.user.username,userid:$scope.user._id});
        $scope.socket.disconnect()
        // $scope.socket.on('disconnect', function (sdata){
        //     console.log('The server says: ' + sdata);
        //     $scope.$apply(function(){
        //       $scope.userlist={}
        //       console.log($scope.userlist);
        //     })
        $cookies.remove('iffirst')
        // });
        $scope.user = {}
        url='/'
        $location.url(url)
        }
        else {
          $scope.message=data.errors
          // console.log($scope.message)
        }
      })
  };
}])
