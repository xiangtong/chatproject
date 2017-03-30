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
  $scope.showmessagepage=null
  $scope.newtext={}
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
    if($routeParams.userid&&$location.path().indexOf('/profile')>-1){
      userFactory.checkstatus(function(data){
          $scope.user=data
          console.log(data);
          if(!$cookies.get(!'iffirst')){
            $scope.allmessages=[]
            $scope.socket = io.connect();
            console.log($scope.socket.id);
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
            $scope.socket.on('messageupdate', function (message){
                console.log('The server says: ' + message);
                console.log(message);
                $scope.$apply(function(){
                  $scope.allmessages.push(message)
                  console.log($scope.allmessages);
                  if($scope.to_user){
                    if(message.from_userid==$scope.to_user.userid){
                      $scope.messages.push(message)
                      console.log($scope.messages);
                    }
                  }
                })
            });
          }
      })
    }
  }

  userFactory.checkstatus(function(data){
      $scope.user=data
      console.log('************'+data);
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
        // console.log({username: $scope.user.username,userid:$scope.user._id});
        $scope.socket.emit("logout", {username: $scope.user.username,userid:$scope.user._id});
        $scope.socket.disconnect()
        $cookies.remove('iffirst')
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
  $scope.messagepage=function(to_user){
    $scope.showmessagepage=1
    // console.log('******************');
    $scope.to_user=to_user
    // console.log($scope.to_user);
    // console.log($scope.user);
    // console.log($scope.allmessages);
    $scope.messages=[]
    for(i=0;i<$scope.allmessages.length;i++){
      if($scope.allmessages[i].from_userid==$scope.user._id&&$scope.allmessages[i].to_userid==$scope.to_user.userid){
        $scope.messages.push($scope.allmessages[i])
      }
      else if($scope.allmessages[i].from_userid==$scope.to_user.userid&&$scope.allmessages[i].to_userid==$scope.user._id){
        $scope.messages.push($scope.allmessages[i])
      }
    }
    console.log($scope.messages);
  }
  $scope.message=function(){
    // console.log($scope.to_user);
    // console.log($scope.newtext.text);
    $scope.newmessage={}
    $scope.newmessage.from_username=$scope.user.username
    $scope.newmessage.to_username=$scope.to_user.username
    $scope.newmessage.from_userid=$scope.user._id
    $scope.newmessage.to_userid=$scope.to_user.userid
    if($scope.to_user.socketid){
      $scope.newmessage.to_socketid=$scope.to_user.socketid
    }
    $scope.newmessage.createdAt=Date.now()
    $scope.newmessage.message=$scope.newtext.text
    // console.log($scope.newmessage);
    $scope.socket.emit('newmessage',$scope.newmessage)
    $scope.allmessages.push($scope.newmessage)
    $scope.messages.push($scope.newmessage)
    $scope.newtext.text=''
  }
}])
