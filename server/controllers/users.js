var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt')
var session = require('express-session')

module.exports={
  // registers Request
  register:function(req, res) {
    // console.log("POST DATA", req.body);
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation});
    // console.log(user);
    user.save(function(err,userobj) {
      context={}
      info={}
      if(err) {
        if(user.errors){
          if ('username' in user.errors){
            info.username=user.errors.username.message
          }
          if ('passwordHash' in user.errors){
            info.password=user.errors.passwordHash.message
          }
          context.info=info
        }
        else{
          if(err.message.indexOf('duplicate key error')>-1){
            info.username='the username has existed!'
            context.info=info
          }
        }
      } else {
        req.session.user=userobj
        req.session.save()
        info='successfully registration!'
        context.info=info
        context.user=userobj
        // console.log(userobj);
      }
      res.json(context)
    })
  },
  // Login Request
  login:function(req, res,io) {
    // console.log("POST DATA", req.body);
    var username= req.body.username
    var password=req.body.password
    if(!username && !password){
      res.json({info:{lusername:'please input username',lpassword:'please input password'}})
    } else if(!username){
      res.json({info:{lusername:'please input username'}})
    } else if(!password){
      res.json({info:{lpassword:'please input password'}})
    } else {
      User.findOne({username:username}).exec(function(err,user) {
        context={}
        info={}
        if(err) {
          // console.log(err);
          context.info=User.errors
        } else {
          // console.log(user);
          if(!user){
            info.lusername='username does not exist!'
            context.info=info
          }
          else if(bcrypt.compareSync(password, user.passwordHash)){
            for(var i=0;i<sessionusers.length;i++){
              if(String(sessionusers[i].userid)==String(user._id)){  // this user have logged in , you need kick it out
                sessionusers.splice(i,1)   //delete old login session info
                // console.log(currentusers);
                for(i=0;i<currentusers.length;i++){
                  if(currentusers[i].userid==user._id){
                    //if the user has logined somewhere else, then send a kickout message to that login. that login will logout 5 seconds after get the kickout message. in this way, for each user, only one login at the same time.
                    io.to(currentusers[i].socketid).emit('kickout','This user has logged in somewhere else. This login will be kicked out in 5 seconds')
                  }
                }
              }
            }
            info='successfully login!'
            req.session.user=user
            sessionusers.push({userid:user._id,sessionid:req.session.id})
            // console.log(sessionusers);
            req.session.save()
            context.info=info
            context.user=user
          } else {
            info.lpassword='invalid password'
            context.info=info
          }
        }
        // console.log(context);
        // io.emit('newuser', { user: context.user.username });
        res.json(context)
      })
    }

  },
  //check whether the user has logined (has session in server)
  checkstatus:function(req,res){
    if(req.session.user){
      res.json(req.session.user)
    } else {
      res.json(null)
    }
  },
  //logout request
  logout:function(req, res) {
    sessionid=req.session.id
    req.session.destroy()
    console.log(sessionusers.length);
    //remove user from session users list
    for(i=0;i<sessionusers.length;i++){
      if(sessionusers[i].sessionid==sessionid){
        sessionusers.splice(i,1)
      }
    }
    console.log(sessionusers.length);
    res.json({info:'successfully logout'})
    // res.redirect('/')
  },

}
