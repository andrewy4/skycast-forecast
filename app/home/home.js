'use strict';

angular.module('webApp.home', ['ngRoute', 'firebase'])

//routing set up
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/home', {
		templateUrl: 'home/home.html',
		controller: 'HomeCtrl'
	});
}])

//controller set up
.controller('HomeCtrl', ['$scope', '$firebaseAuth', '$location', 'CommonProp', function($scope, $firebaseAuth, $location, CommonProp){
	
	//sign in function
	$scope.signIn = function(){

		//get username and password
		var username = $scope.user.email;
		var password = $scope.user.password;

		//set up firebase authoriztion
		var auth = $firebaseAuth();

		//sign in with username and password
		auth.$signInWithEmailAndPassword(username, password).then(function(){
			//successful

			//store username into variable in case of crashing
			CommonProp.setUser($scope.user.email.substring(0, $scope.user.email.indexOf('@')));

			//go to welcome page if successful
			$location.path('/welcome');

		//anything goes wrong with logging in
		}).catch(function(error){

			//set error message to true
			$scope.errMsg = true;

			//display error message
			$scope.errorMessage = error.message;
		});
	}

}])


//Common Property functions that are useful for the entired website
.service('CommonProp', ['$location', '$firebaseAuth', '$http', function( $location, $firebaseAuth, $http){

	//user vairable
	var user = "";

	//firebase authorization variable
	var auth = $firebaseAuth();

	//address variable
	var address = "";

	return{
		//Used to check if a user is sign in
		getUser: function(){
			if(user == "" || user == null){
				//check local storage also in case of browser refresh
				user = localStorage.getItem("userEmail");
			}
			return user;
		},

		//set user for future checking
		setUser: function(value){

			//also store in local storage in case of browser refresh
			localStorage.setItem("userEmail", value);
			user = value;
		},

		//log out
		logoutUser: function(){
			auth.$signOut();
			console.log("Logget Out");

			//clear both user variable and local storage to prevent direct access from HTTP link
			user = "";
			localStorage.removeItem('userEmail');

			//go to log in page
			$location.path('/home');
			$location.replace();
		},

		//store the address for googleGeoAPi used
		storeAddress: function(value){
			//store in local storage also in case of refreshing
			localStorage.setItem("searchAddress", value);
			address = value;
		},

		//get the address for googleGeoAPi used
		getAddress: function(){
			if(address == "" || address == null){
				//check local storage also in case of refreshing
				address = localStorage.getItem("searchAddress");
			}
			return address;
		},
	}

}])