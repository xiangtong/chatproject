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
currentusers=[]   // all socket online users info, include userid, username and socketid. the server use this array to mapping userid and socketid.
sessionusers=[]   // all logined users info, include userid, sessionid. the array is to make sure each user could not have more than one login. the array be used in login and logout.
require('./server/config/mongoose.js')
require('./server/config/routes.js')(app,io)   //pass app and io object to user controller. in this way, login function could use io to send message.

server.listen( port, function() {
  console.log( `server running on port ${ port }` );
});

// load all socket.io code
require('./server/controllers/instantmessage.js')(app,io)
