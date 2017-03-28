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
currentusers={}
io.sockets.on('connection', function (socket) {
  socket.on("newuser", function (data){
      if(! (data.userid in currentusers)){
        currentusers[data.userid]=data.username
      }
      console.log(currentusers);
      console.log('newuser login!  user: ' + data.username +data.userid);
        io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' online now!'});
    })
  socket.on("logout",function(data){
      console.log("**************************");
      delete currentusers[data.userid]
      console.log(currentusers);
      socket.disconnect()
      io.emit('currentusers', {users:currentusers,iomessage:'User '+data.username+' offline now!'});
    })
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  //all the socket code goes in here!
})
