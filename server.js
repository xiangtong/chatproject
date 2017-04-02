var mongoose = require( 'mongoose' ),
    express  = require( 'express' ),
    bp       = require('body-parser'),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    app      = express();
    server   = require('http').createServer(app)
    io       = require('socket.io').listen(server)
var bcrypt = require('bcrypt')
var session = require('express-session')
app.use( express.static( path.join( root, 'client' )));
app.use( express.static( path.join( root, 'node_modules')));
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie:{secure:false}
}))
require('./server/config/mongoose.js')
require('./server/config/routes.js')(app,io)

server.listen( port, function() {
  console.log( `server running on port ${ port }` );
});
currentusers=[]
sessionusers=[]
io.sockets.on('connection', function (socket) {
  socket.on("newuser", function (data){
      // console.log('*****************');
      // console.log(data);
      var temp=null
      for(i=0;i<currentusers.length;i++){
        if(data.userid==currentusers[i].userid){
          temp=1
        }
      }
      if(! temp){
        currentusers.push({userid:data.userid,username:data.username,socketid:socket.id})
        // console.log('newuser login!  user: ' + data.username+ ':'+data.userid+':'+socket.id);
        io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' online now!'});
      }
      io.emit('currentusers', {users:currentusers,iomessage:''});
      // console.log(currentusers);
    })
  socket.on("logout",function(data){
      console.log(data);
      for(i=0;i<currentusers.length;i++){
        if(currentusers[i].userid==data.userid){
          currentusers.splice(i,1)
        }
      }
      console.log(currentusers);
      socket.disconnect()
      io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' offline now!'});
    })
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
  socket.on("publicmessage",function(data){
      // console.log("**************************");
      socket.broadcast.emit('publicmessageupdate',data)
    })
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!
})
