//Create new div and load map there with current location marker
var map;
var coords; //Player's location
var myPosition; //Player location's marker
var android; //Icon of player's position
var markers=[]; //Items to be acquired by player
var diamond; //Icon of items 
var randLocations = []; //Random location around player
var distances = []; //Distances between player's location and items around him
var score = 0;
var R = 6371; // radius of earth in km
var index = 0; //Start index of distances array

//Called if geolocation is supported by browser
function success(position) {
	console.log("inside success");
	
	//Create Map Container
	var mapcanvas = document.createElement('div');
	mapcanvas.id = 'mapcontainer';
	resizeElementHeight(mapcanvas);  //Full screen for map
	document.querySelector('#container').appendChild(mapcanvas);

	console.log("inside success 2");

	//Initialize map in map Canvas
	//Sets center to current location 
	coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var options = {
		zoom: 19,
		center: coords,
		disableDefaultUI: true,          //disableDefaultUI on maps
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	//Initialize map
	map = new google.maps.Map(mapcanvas, options); 
	//Define marker's icon for the player position
	android = new google.maps.MarkerImage(
    'android.png',
    null,null,null,
    new google.maps.Size(40, 40)
	); 	
	//Put Marker for current position 
	myPosition = new google.maps.Marker({
		position: coords,
		map: map,
		icon: android,
		title:"Yo!"
	});

	//Call drawCoins function when map is loaded
	google.maps.event.addListenerOnce(map, 'idle', drawCoins);

	console.log("inside success 3");
} //End of success


//Resize Map Canvas element to full screen
function resizeElementHeight(element) {	
	var height = 0;
	var body = window.document.body;
	if (window.innerHeight) {height = window.innerHeight;}
	else if (body.parentElement.clientHeight) {height = body.parentElement.clientHeight;}
	else if (body && body.clientHeight) {height = body.clientHeight;}
	element.style.height = ((height - element.offsetTop) + "px");
}//End of resizeElementHeight

//Update current position of player
function updateLocation(position){
	coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	myPosition.setPosition(coords);
	map.setCenter(coords);
}//End of updateLocation

//Convert to Radian
function rad(x){
	return x*Math.PI/180;
}

//Find distance between current location and each coin and save in distance[]
function closestCoin(currentPosition, snappedLocation){
	var lat = currentPosition.lat();
	var lng = currentPosition.lng();

	var mlat = snappedLocation.lat();
	var mlng = snappedLocation.lng();

	var dLat  = rad(mlat - lat);
	var dLong = rad(mlng - lng);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	console.log(d);

	distances[index++] = d;
}

//initialize coins on map when it's done loading
function drawCoins(){
	randLocations = generateRandomPoints(coords, 500, 100);
	diamond = new google.maps.MarkerImage(
    	'diamond.png',
    	null, /* size is determined at runtime */
    	null, /* origin is 0,0 */
    	null, /* anchor is bottom center of the scaled image */
    	new google.maps.Size(30, 40)
	);
	for(var i=0; i<randLocations.length;i++){
		markers[i] = new google.maps.Marker({
		position: randLocations[i],
		icon: diamond,
		map: map});
		closestCoin(coords, randLocations[i]);	
	}
}


function initUserLocation(){
	navigator.geolocation.getCurrentPosition(success);
  	navigator.geolocation.watchPosition(updateLocation);  // Return curret position and continues to return it as it changes
	console.log("hayny");
}

//Check if geolocation is supported by browser
//If yes, call success function
if (navigator.geolocation) {
  initUserLocation();
  console.log("Hello World 2");
} 
else { console.log("Location not supported")}





/*
//Snap location to nearest street
function snapToNearestStreet(){
	for (var i = 0; i < randLocations.length; i++) {
   		var request = {
        	origin:randLocations[i], 
        	destination:randLocations[i],
        	travelMode: google.maps.DirectionsTravelMode.DRIVING,
        	avoidHighways:true
    	};

    	directionsService.route(request, function(response, status) {
      		if (status == google.maps.DirectionsStatus.OK){
          		snappedLocations[i] = response.routes[0].legs[0].start_location;
          		//console.log("I am in snapToNearestStreet " + snappedLocations[i]);	
				markers[i] = new google.maps.Marker({
					position: snappedLocations[i],
					icon: diamond,
					map: map});

				closestCoin(coords, snappedLocations[i]);
          	}
    	});
	}
	//Get distances betweenplayer location and all coins	
}
*/
