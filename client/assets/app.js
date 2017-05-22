var app = angular.module('myApp', ['ngRoute','ngCookies', 'ngEmoticons','luegg.directives']);
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
app.directive('hideEmojitable', function($document){
  		return {
    		restrict: 'A',
    		link: function(scope, elem, attr, ctrl) {
      			elem.bind('click', function(e) {
        			e.stopPropagation();
      			});
      			$document.bind('click', function() {
        			scope.$apply(attr.hideEmojitable);
      			})
    		}
  		}
	});
