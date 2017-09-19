'use restrict';

angular.module('webApp.history', ['ngRoute', 'firebase'])

//routing set up
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/history', {
		templateUrl: 'history/history.html',
		controller: 'HistoryCtrl'
	});
}])

//controller set up
.controller('HistoryCtrl', ['$scope', '$firebase', '$firebaseArray', '$firebaseObject', 'CommonProp', '$location',
	function($scope, $firebase, $firebaseArray, $firebaseObject, CommonProp, $location){
	
	//check user log ing
	$scope.username = CommonProp.getUser();
	if($scope.username == null || $scope.username == ""){

		//redirect to home if user is not logged in
		$location('/home');
	}
	
	//set up firebase reference
	var ref = firebase.database().ref().child($scope.username +'/');

	//change the database into array.assign to locations in order to display onto HTML
	$scope.locations = $firebaseArray(ref);

	//log out
	$scope.logout = function(){
		CommonProp.logoutUser();
	}

	//check the weather of the selected data
	$scope.checkWeather = function(id){

		//get the reference of firebase
		var ref2 = firebase.database().ref().child($scope.username +'/' + id + '/');

		//once the value inside the reference is ready, process to data. 
		ref2.once('value').then(function(data){
			//prepare the address
			var address = data.val().city + ',' + data.val().state + ',' + data.val().country;
			CommonProp.storeAddress(address);
			//process to /result.(Use apply to force the refresh and direct path)
			$scope.$apply(function() { $location.path("/result"); });

			//if anything goes wrong
		})
		
	}
	
}])

//used in ng-repeat to print the data in reverse order
.filter('reverse', function(){
	return function(items){
		return items.slice().reverse();
	};
})