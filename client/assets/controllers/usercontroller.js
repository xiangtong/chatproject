app.controller('UsersController',['$scope','userFactory','$location','$cookies','$routeParams','$timeout',function ($scope,userFactory,$location,$cookies,$routeParams,$timeout) {
  // get emojo prepared data
  $scope.privateoptions = userFactory.getprivateoptions()
  $scope.options = userFactory.getoptions()
  $scope.funoptions = userFactory.getfunoptions()
  $scope.custom = false
  $scope.Cpaste = function(option){
    console.log(option)
    if(!$scope.publictext){
      $scope.publictext={}
      $scope.publictext.text = option
    } else {
        $scope.publictext.text =   $scope.publictext.text + option
    }

  }
  $scope.Cpaste2 = function(option){
    console.log(option)
    if(!$scope.newtext.text){

      $scope.newtext.text = option
    } else {
        $scope.newtext.text =   $scope.newtext.text + option
    }

  }
    // console.log("enter controller");
    $scope.custom = true;
    $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true: false;
    };
    $scope.custom2 = true;
    $scope.toggleCustom2 = function() {
        $scope.custom2 = $scope.custom2 === false ? true: false;
    };
  //whether select a user to display the message between you and that user. if not, display other div
  $scope.showmessagepage=null
  $scope.newtext={}
  // $scope.defaultuser={username:'All',userid:'000000',socketid:'000000'}
  if($cookies.get('successmessage')){
      $scope.successmessage=$cookies.get('successmessage')
      $cookies.remove('successmessage')
  }
  // if request /profile page, userid is params. then begin socket.io connection.
  if($routeParams){
    if($routeParams.userid&&$location.path().indexOf('/profile')>-1){
      userFactory.checkstatus(function(data){
          $scope.user=data
          console.log('*********************');
          console.log(data);
          //iffirst is to tell whether the user enter profile through login or refresh page. if via login, then do some init work and send newuser message to server.
          if(!$cookies.get(!'iffirst')){
            $scope.allmessages=[]
            $scope.publicmessages=[]
            $scope.treeage=0
            $scope.socket = io.connect();
            console.log($scope.socket.id);
            console.log($scope.defaultuser);
            $cookies.put('iffirst',1)
            //send user info to server. then server will notify other user.
            $scope.socket.emit("newuser", {username: data.username,userid:data._id});
            //when server get newuser login, server will send new useslist to all user. then all user could update their userlist.
            $scope.socket.on('currentusers', function (sdata){
                console.log('The server says: ' + sdata);
                console.log(sdata);
                $scope.$apply(function(){
                  $scope.userlist=sdata.users
                  // $scope.userlist.push($scope.defaultuser)
                  $scope.hideualert=false;
                  $scope.iomessage=sdata.iomessage;
                  $scope.autohideualert();
                  console.log($scope.userlist);
                })
            });
            //get new private message from server
            $scope.socket.on('messageupdate', function (message){
                console.log('The server says: ' + message);
                console.log(message);
                $scope.$apply(function(){
                  $scope.allmessages.push(message)
                  console.log($scope.allmessages);
                  //if you display the message page between someone and you
                  if($scope.to_user){
                     //if the message is from that user, then juse display it
                     if(message.from_userid==$scope.to_user.userid)
                     {
                      $scope.messages.push(message)
                      console.log($scope.messages);
                      }
                    else // if the message from other user, then display notify info and add unread message number of that user
                    {
                      $scope.hidemalert=false;
                      $scope.newmessagenotify='You get new message from '+message.from_username
                      $scope.autohidemalert();
                      for(i=0;i<$scope.userlist.length;i++){
                        if($scope.userlist[i].userid==message.from_userid){
                          if(!$scope.userlist[i].unreadmessage){
                            $scope.userlist[i].unreadmessage=1
                          } else {
                            $scope.userlist[i].unreadmessage++
                          }
                        }
                      }
                    }
                  }
                  else //if you do not display message page with any one ,then when get new message, display notify info and unread message number of that user.
                  {
                      $scope.hidemalert=false;
                      $scope.newmessagenotify='You get new message from '+message.from_username
                      $scope.autohidemalert();
                      for(i=0;i<$scope.userlist.length;i++){
                        console.log('****');
                        if($scope.userlist[i].userid==message.from_userid){
                          console.log('%%%%');
                          if(!$scope.userlist[i].unreadmessage){
                            $scope.userlist[i].unreadmessage=1
                          } else {
                            $scope.userlist[i].unreadmessage++
                          }
                        }
                      }
                  }
                  console.log($scope.userlist);
                })
            });
            //get new public message from server
            $scope.socket.on('publicmessageupdate', function (message){
                console.log('The server says: ' + message);
                console.log(message);
                $scope.$apply(function(){
                  $scope.publicmessages.push(message)
                  console.log($scope.publicmessages);
                })
            });
            //if the same user login somewehre else, server will send kickout message, when current login get kickout message, it will logout 5 seconds later
            $scope.socket.on('kickout', function (message){
              // console.log('@@@@@@@@@@@@@2');
              console.log('The server says: ' + message);
              $scope.$apply(function(){
                $scope.kickoutmessage=message
                //kickout logout send different message from normal logout. then server do different process
                $timeout($scope.logout.bind(null,true),5000)
              })
            });
          }
      })
    }
  }
  //hide alert message (new message notify and new user online/offline) after 5 seconds
  $scope.autohidemalert =function (){
    $timeout(function () { $scope.hidemalert = true; }, 5000);
  }
  $scope.autohideualert =function (){
    $timeout(function () { $scope.hideualert = true; }, 5000);
  }
  // if user has loggedin, but request / (login) page again, then he will be redirect to profile.
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
      console.log(data);
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
  $scope.logout=function(ifkickout){
    userFactory.logout(function (data){
      if(data.info){
        $cookies.put('successmessage', data.info)
        console.log('*****************');
        // console.log({username: $scope.user.username,userid:$scope.user._id});
        //when kickout, add kickout attribute into to message
        if(ifkickout==true){
          $scope.socket.emit("logout", {username: $scope.user.username,userid:$scope.user._id,kickout:1});
        }
        //after logout successfully ( server has removed session), send logout message to server. then server will update online user list and notify all other users
        else {
          $scope.socket.emit("logout", {username: $scope.user.username,userid:$scope.user._id});
        }
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
  //display message div with a certain user
  $scope.messagepage=function(to_user){
    $scope.showmessagepage=1
    // console.log('******************');
    $scope.to_user=to_user
    //if current user have some unread message from that user, then change it to null (o)
    if(to_user.unreadmessage){
      for(i=0;i<$scope.userlist.length;i++){
        if($scope.userlist[i].userid==to_user.userid){
            $scope.userlist[i].unreadmessage=null
        }
      }
    }
    // console.log($scope.to_user);
    // console.log($scope.user);
    // console.log($scope.allmessages);
    $scope.messages=[]
    if($scope.allmessages){
      //select all message from that user to you or from you to that user from allmessages
      for(i=0;i<$scope.allmessages.length;i++){
        if($scope.allmessages[i].from_userid==$scope.user._id&&$scope.allmessages[i].to_userid==$scope.to_user.userid){
          $scope.messages.push($scope.allmessages[i])
        }
        else if($scope.allmessages[i].from_userid==$scope.to_user.userid&&$scope.allmessages[i].to_userid==$scope.user._id){
          $scope.messages.push($scope.allmessages[i])
        }
        // if($scope.allmessages[i].to_userid=='000000'&&$scope.to_user.userid=='000000'){
        //   $scope.messages.push($scope.allmessages[i])
        // }
      }
    }
    console.log($scope.messages);
  }

  // send message to a certain user
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
    $scope.treeage+=30
    // $scope.myStyle={bottom: 0}
  }

  //send a public message
  $scope.publicmessage=function(){
    // console.log($scope.to_user);
    // console.log($scope.newtext.text);
    pubmessage={}
    pubmessage.from_username=$scope.user.username
    pubmessage.from_userid=$scope.user._id
    pubmessage.createdAt=Date.now()
    pubmessage.message=$scope.publictext.text
    // console.log($scope.pubmessage);
    $scope.socket.emit('publicmessage',pubmessage)
    $scope.publicmessages.push(pubmessage)
    $scope.publictext.text=''
    $scope.treeage+=30
  }
}])
