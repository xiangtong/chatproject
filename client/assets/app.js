var app = angular.module('myApp', ['ngRoute','ngCookies', 'ngEmoticons']);
app.config(function ($routeProvider) {
// Routes to load your new and edit pages with new and edit controllers attached to them!
$routeProvider
  .when('/',{
      templateUrl: '../partials/regandlogin.html',
  })
  .when('/profile/:userid',{
      templateUrl: '../partials/profile.html',
  })
  // .when('/message/:userid',{
  //     templateUrl: '../partials/message.html',
  // })
  .otherwise({
    redirectTo: '/'
  });
});
