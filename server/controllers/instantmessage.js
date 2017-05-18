module.exports = function(app,io){
  io.sockets.on('connection', function (socket) {
    //when a user login, server will get newuser message with info of that user. server will add user info into currentusers list and broadcast to all other users.
    socket.on("newuser", function (data){
        // console.log('*****************');
        // console.log(data);
        var temp=null
        for(i=0;i<currentusers.length;i++){
          if(data.userid==currentusers[i].userid){    // the user has logined somewhere else. then delete the old login info from currentuser list.
            currentusers.splice(i,1)
            temp=1
          }
        }
        //add new login info into currentusers list .
        currentusers.push({userid:data.userid,username:data.username,socketid:socket.id})
        // console.log('newuser login!  user: ' + data.username+ ':'+data.userid+':'+socket.id);
        if(!temp){
          io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' online now!'});
        } else {
          io.emit('currentusers', {users:currentusers,iomessage:''});
        }
        // console.log(currentusers);
      })
    //when a user logout, server will get logout message with info of that user. server will remove user info from currentusers list and broadcast to all other users.
    socket.on("logout",function(data){
        console.log(data);
        if(data.kickout==1){     // the kickout logout. in newuser message function, new login has replace the kickout login info in currentusers. then, just disconnect current (old) socket.
          socket.disconnect()
          console.log(currentusers);
        }
        else{    //normal logout. remove user from currentusers list and notify other users.
          for(i=0;i<currentusers.length;i++){
            if(currentusers[i].userid==data.userid){
              currentusers.splice(i,1)
            }
          }
          console.log(currentusers);
          socket.disconnect()
          io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' offline now!'});
        }
      })
    //when a user A send a private message to another user B, server will find B's socketid in currentusers list and forward that message to the socketid.
    socket.on("newmessage",function(data){
        // console.log("**************************");
          for(i=0;i<currentusers.length;i++){
            // if(currentusers[i].socketid==data.to_socketid){
            //   io.to(data.to_socketid).emit('messageupdate',data)
            // } else
            if(currentusers[i].userid==data.to_userid){
              io.to(currentusers[i].socketid).emit('messageupdate',data)
            }
          }
      })
    //when a user send a public message, the server will forward it to all users.
    socket.on("publicmessage",function(data){
        // console.log("**************************");
        socket.broadcast.emit('publicmessageupdate',data)
      })
    console.log("WE ARE USING SOCKETS!");
    console.log(socket.id);
    //all the socket code goes in here!
  })
}
