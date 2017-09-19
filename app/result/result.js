'use strict';


angular.module('webApp.result', ['ngRoute', 'firebase'])

//routing set up
.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/result', {
		templateUrl: 'result/result.html',
		controller: 'ResultCtrl'
	});
}])

//controller set up
.controller('ResultCtrl', ['$scope', 'CommonProp', '$http', '$location', '$anchorScroll', function($scope, CommonProp, $http, $location, $anchorScroll){

	//Check user log in
	$scope.username = CommonProp.getUser();
	if(!$scope.username){
		$location.path('/home');
	}else{
	//if sign in

		//set up the middle section moving grid's initial size 
		$scope.grid1 = 'col-md-4';
		$scope.grid2 = $scope.grid3 = $scope.grid4 = $scope.grid5 = 'col-md-2';

		//middle section interactive summary data, set to index 0(today's)
		var summaryData = 0;

		//prepare address to do googleGeoApi call
		var address = CommonProp.getAddress();
		
		//Http method to get googleAPi
		$http.get('https://maps.googleapis.com/maps/api/geocode/json',{
			params:{
				address: address,
				key: 'AIzaSyD3i-EXp7aZJL99UVDt-CWLdsZJAqnWyOY'
			}
		//if success
		}).then(function(response){
			//if the response is junk, back to welcome page
			if(response.data.status === "ZERO_RESULTS"){
				$location.path('/welcome');
			}else{
				//if everything is good

				//get the lenth of the response array to get the proper name of the location in case of typo
				var arrayLength = response.data.results[0].address_components.length;

				//loop through the repsonse to find the city, state, and country
	 			for(var i = 0; i < arrayLength; i++){
	 				var component = response.data.results[0].address_components[i];
	 				switch(component.types[0]) {

	 					//city
                        case 'locality':
                            	var city = component.long_name;
                            break;
                        //state
                        case 'administrative_area_level_1':
                            var state = component.short_name;
                            break;
                        //country
                        case 'country':
                            var country = component.long_name;
                            break;
                    }
	 			}

	 			//prepare the return string
	 			$scope.addressDis = "";

	 			//if an individual is undefined, dont concat into the string
	 			if(typeof city != 'undefined'){
	 				$scope.addressDis += city+', ';
	 			}
	 			if(typeof state != 'undefined'){
					$scope.addressDis += state+', ';
	 			}
	 			if(typeof country != 'undefined'){
					$scope.addressDis += country;
	 			}

	 			//get the latitude and longtitude from the response
				var lat = response.data.results[0].geometry.location.lat;
				var lng = response.data.results[0].geometry.location.lng;

				//Http call for DarkSky API
				$http.get('https://thingproxy.freeboard.io/fetch/https://api.darksky.net/forecast/7dfe6a7236493beb7f6c1dd7786802bd/' + lat +',' + lng).then(function(data) {
						//get the necessary data
						$scope.info = data.data;
						//current data
						$scope.current = $scope.info.currently;
						
						//daily data
						$scope.daily = $scope.info.daily.data;

						//hourly data
						$scope.hourly = $scope.info.hourly.data;

						
						//set the variable for HTML page used
						$scope.type = $scope.daily[0].precipType;
						$scope.temperature = $scope.daily[0].apparentTemperatureLow;
						$scope.summary = $scope.daily[0].summary;
						$scope.thisWeekForcast = $scope.info.daily.summary;


						//Skycons set up
						$scope.weatherIcon = {
							forecast: {
								currentIcon: $scope.current.icon,
								day0Icon: $scope.daily[0].icon,
								day1Icon: $scope.daily[1].icon,
								day2Icon: $scope.daily[2].icon,
								day3Icon: $scope.daily[3].icon,
								day4Icon: $scope.daily[4].icon,
								color: "white",
							}
						};

						//set up proper background color based on the weather type
						switch($scope.current.icon){
							case "clear-day":
								$scope.backgroundPicture = "http://allswalls.com/images/clear-sky-wallpaper-3.jpg";
								$scope.backgroundColor = "LightSkyBlue";
								break;
							case "wind":
								$scope.backgroundPicture = "http://wallpapercraft.net/wp-content/uploads/2016/11/Hurricane-Backgrounds-HD-1920x1080.jpg";
								$scope.backgroundColor = "LightSkyBlue";
								break;
							case "cloudy":
								$scope.backgroundPicture = "http://www.top4themes.com/data/out/31/5577297-cloud-wallpapers.jpg"
								$scope.backgroundColor = "DarkGray";
								break;
							case "partly-cloudy-day":
								$scope.backgroundPicture = "https://images.alphacoders.com/174/174331.jpg";
								$scope.backgroundColor = "DarkGray";
								break;
							case "snow":
								$scope.backgroundPicture = "https://images4.alphacoders.com/680/680463.jpg";
								$scope.backgroundColor = "DarkGray";
								break;
							case "sleet":
								$scope.backgroundPicture ="https://i.pinimg.com/originals/9b/82/7f/9b827f2189d0c10c62d7421aef1e5901.jpg";
								$scope.backgroundColor = "DarkGray";
								break;
							case "fog": 
								$scope.backgroundPicture = "https://cdn4.lensdistortions.com/lensdistortions/wp-content/uploads/2015/04/25114012/Fog-Example-31-1024x1024.jpg";
								$scope.backgroundColor = "DarkGray";
								break;
							case "rain":
								$scope.backgroundPicture = "https://images.alphacoders.com/274/274303.jpg";
								$scope.backgroundColor = "DarkGray";
								break;
							case "clear-night":
								$scope.backgroundPicture = "http://www.powerpointhintergrund.com/uploads/2017/06/night-sky-wallpaper-desktop-high-resolution-night-sky-stars-wallpaper--34.png";
								$scope.backgroundColor = "MidnightBlue";
								break;
							case "partly-cloudy-night":
								$scope.backgroundPicture = "http://geodavephotography.com/images/wallpaper-night/36495517-wallpaper-night.jpg";
								$scope.backgroundColor = "MidnightBlue";
								break;
							default:
						}
						
					//catch darkSky API error
		        	}).catch(function(error){
						console.log(error);
						CommonProp.logoutUser();
						$location.path('/home');
					});	
			}
		//catch google API error			
		}).catch(function(error){
				console.log(ex);
				CommonProp.logoutUser();
				$location.path('/home');
			});

		//log out function
		$scope.logout = function(){
			CommonProp.logoutUser();
		}

		//middle section interactive grid adjust, change the col size and printed summary based on the id sent in
		$scope.changeGrid = function(){
			var gridId = event.srcElement.attributes.id || event.currentTarget.id;
			if(gridId.value == "grid1"){
				$scope.grid1 = 'col-md-4';
				$scope.grid2 = $scope.grid3 = $scope.grid4 = $scope.grid5 = 'col-md-2';
				summaryData = 0;
			}else if(gridId.value == "grid2"){
				$scope.grid2 = 'col-md-4';
				$scope.grid1 = $scope.grid3 = $scope.grid4 = $scope.grid5 ='col-md-2';
				summaryData = 1;
			}else if(gridId.value == "grid3"){
				$scope.grid3 = 'col-md-4';
				$scope.grid1 = $scope.grid2 = $scope.grid4 = $scope.grid5 ='col-md-2';
				summaryData = 2;
			}else if(gridId.value == "grid4"){
				$scope.grid4 = 'col-md-4';
				$scope.grid1 = $scope.grid2 = $scope.grid3 = $scope.grid5 ='col-md-2';
				summaryData = 3;
			}else if(gridId.value == "grid5"){
				$scope.grid5 = 'col-md-4';
				$scope.grid1 = $scope.grid2 = $scope.grid3 = $scope.grid4 ='col-md-2';
				summaryData = 4;
			}

			//summary data for HTML used
			$scope.type = $scope.daily[summaryData].icon;
			$scope.temperature = $scope.daily[summaryData].apparentTemperatureLow;
			$scope.summary = $scope.daily[summaryData].summary;

		}

	}

}])