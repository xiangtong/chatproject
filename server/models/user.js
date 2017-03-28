var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
   username: {
     type: String,
     required: [true, 'Please input username'],
     minlength: [2,'username must be at least 2 characters'],
     maxlength: [20,'username must be at most 20 characters'],
     unique: [true,'Email address has existed!'],
    //  validate: {
    //    validator: function( value ) {
    //      return /^[a-zA-Z0-9_]+$/.test( value );
    //    },
    //    message: "{VALUE} is not valid. Username contain alpha-numeric characters and underscore"
    //  }
   },
  //  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  //  messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
   passwordHash: {
     type: String,
     required: [true, 'Please input password'],
     validate:[
       {
         validator: function( value ) {
           return this._password == this._passwordConfirmation;
         },
         message: "Password does not match confirmation"
       },
       {
         validator: function( value ) {
           if(this._password.length<6){
             return false
           };
           return true
         },
         message: "Password is at least 6 characters long"
       },
      ]
   },
  }, { timestamps: true
})

UserSchema.virtual('password')
    .get(function() {
     return this._password;
    })
    .set(function(value) {
        this._password = value;
      if(value){
        var salt =bcrypt.genSaltSync(12);
        this.passwordHash = bcrypt.hashSync(value, salt);
      }
});

UserSchema.virtual('passwordConfirmation')
  .get(function() {
   return this._passwordConfirmation;
  })
  .set(function(value) {
   this._passwordConfirmation = value;
  });

var User=mongoose.model('User', UserSchema);
