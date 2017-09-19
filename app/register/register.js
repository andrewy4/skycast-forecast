'use strict';

angular.module('webApp.register', ['ngRoute', 'firebase'])

//routing set up
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/register', {
		templateUrl: 'register/register.html',
		controller: 'RegisterCtrl'
	});
}])

//controller set up
.controller('RegisterCtrl', ['$scope', '$firebaseAuth', '$location','CommonProp', function($scope, $firebaseAuth, $location, CommonProp){

	//sign up function
	$scope.signUp = function(){

		//get username and password
		var username = $scope.user.email;
		var password = $scope.user.password;

		//check both username and password if correctly loaded
		if(username && password){

			//set up firebase authoriztion
			var auth = $firebaseAuth();

			//create a new user
			auth.$createUserWithEmailAndPassword(username, password).then(function(){

				//sign in with the newly created user
				auth.$signInWithEmailAndPassword(username, password).then(function(){

					//store the username into variable in case of crashing
					CommonProp.setUser($scope.user.email.substring(0, $scope.user.email.indexOf('@')));

					//redirect to welcome page
					$location.path('/welcome');

				//if anything goes wrong, go back to home
				}).catch(function(error){
					$location.path('/home');
				});

				//set the errMsg display in HTML to false
				$scope.errMsg = false;

			//if anything that is related to sign up goes wrong
			}).catch(function(error){

				//set display to true
				$scope.errMsg = true;

				//print the error message
				$scope.errorMessage = error.message;
			});
		}
	}

}])