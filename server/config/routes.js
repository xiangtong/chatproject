var users = require('../controllers/users.js');
// var messages = require('../controllers/messages.js');

module.exports = function(app,io){
  app.post('/register', function(req, res) {
    // console.log(req.body);
    users.register(req, res);
  });
  app.post('/login', function(req, res) {
    // console.log(req.body);
    users.login(req, res,io);
  });
  app.get('/logout', function(req, res) {
    // console.log(req.body);
    users.logout(req, res);
  });
  app.get('/profile/:userid', function(req, res) {
  users.profile(req, res);
});
  // app.get('/messages', function(req, res) {
  //   messages.index(req, res);
  // });
  // app.post('/messages', function(req, res) {  //create new message
  //   messages.createmessage(req, res);
  // });
  // app.post('/messages/:id', function(req, res) {  //create new comment for a message
  //   messages.createcomment(req, res);
  // });
  app.get('/checkstatus', function(req, res) {
    users.checkstatus(req, res);
  });
}
