//Welcome homepage's angularJS file
'use strict';

angular.module('webApp.welcome', ['ngRoute', 'firebase'])

//routing set up
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/welcome',{
		templateUrl: 'welcome/welcome.html',
		controller: 'WelcomeCtrl'
	});
}])

//controller set up
.controller('WelcomeCtrl', ['$scope', '$location', 'CommonProp','$firebase','$firebaseArray', function($scope, $location, CommonProp, $firebase, $firebaseArray, $timeout){
	
	


	//get User name from Common prop and check if user is logged, if fail, redirect back to home page
	$scope.username = CommonProp.getUser();
	if($scope.username == null || $scope.username == ""){
		$location('/home');
	}
	
	//set up reference to database
	var ref = firebase.database().ref($scope.username + '/');
	$scope.location = $firebaseArray(ref);

	//store data into firebase and redirect to result
	$scope.geoCodeAndSave = function(){

		//set up data to be stored
		var city = $scope.address.city;
		var state = $scope.address.state;
		var country = $scope.address.country;

		//set up date
		var date = new Date();
		date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

		//add into database
		$scope.location.$add({
			city: city,
			state: state,
			country: country,
			date: date,

		}).then(function(ref){
			//set up and store the address into commonprop for future use
			var address = city.split(' ').join('+')+','+state.split(' ').join('+')+','+country.split(' ').join('+');
			CommonProp.storeAddress(address);

			//direct to #/result to display result
			$location.path("/result");

			//check any potential error, log out and return to login page if happen
		}, function(error){
			console.log(error);
			//log out
			CommonProp.logoutUser();
			$location.path('/home');
		});
	}
	//on.click log out function
	$scope.logout = function(){
			CommonProp.logoutUser();
		}
}])





