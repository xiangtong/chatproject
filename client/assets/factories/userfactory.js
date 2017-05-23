app.factory('userFactory',['$http','$location', function($http,$location){
   var factory = {};
   factory.checkstatus=function(callback){
     $http.get('/checkstatus').then(
       function(res){
         if(!res.data){
           $location.url('/')
         } else {
           console.log(res.data);
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
   // below codes are for emojo
   var privateoptions = [':blush:',':kissing_closed_eyes:',':heart_eyes:',':smiley:',':smirk:',   ':relaxed:',':facepunch:',':laughing:']
   var options = [':bouquet:',':cherry_blossom:',':tulip:',':taurus:',':apple:',':sunrise:', ':money_with_wings:',':couplekiss:',':sunglasses:',':herb:',':sunflower:']
   var funoptions = [':japanese_goblin:',':shipit:',':hankey:',':sushi:',':pouting_cat:',':hurtrealbad:',
   ':rage1:',':ghost:',':fist:',':hourglass_flowing_sand:']

  factory.getprivateoptions=function(){
    return privateoptions
  }
  factory.getoptions=function(){
    return options
  }
  factory.getfunoptions=function(){
    return funoptions
  }

  var faviconurl="images/icon.png"
  var unreadmessagenumber=null

  factory.getfaviconurl=function(){
    return faviconurl
  }
  factory.getunreadmessagenumber=function(){
    return unreadmessagenumber
  }
  factory.setfaviconurl=function(newurl){
    faviconurl=newurl
    console.log("faviconurl="+faviconurl);
  }
  factory.setunreadmessagenumber=function(newnumber){
    unreadmessagenumber=newnumber
    console.log("unreadmessagenumber:"+unreadmessagenumber);
  }

   return factory;
}])
