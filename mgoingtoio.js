//Create new div and load map there with current location marker
var map;
var myPosition;
var markers=[];
var oldSouthWest;
var oldNorthEast;
var coin = 'coin.png';
var diamond;
var android;
var coords;
var randLocations = []; //This will not be defined until drawCoins is called and done with it's job
var snappedLocations = [];
var distances = [];
var directionsService;
var score = 0;
var R = 6371; // radius of earth in km
var index = 0;

//Called if geolocation is supported by browser
function success(position) {
	window.clearInterval(intervalId);
	console.log("inside success");
	//Create Map Container
	var mapcanvas = document.createElement('div');
	mapcanvas.id = 'mapcontainer';
	resizeElementHeight(mapcanvas);  
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
	map = new google.maps.Map(mapcanvas, options);
	console.log("inside success 3");
	
	//Put Marker for current position 
	myPosition = new google.maps.Marker({
		position: coords,
		map: map,
		icon: android,
		title:"Yo!"
	});
	directionsService = new google.maps.DirectionsService();
	diamond = new google.maps.MarkerImage(
    'diamond.png',
    null, /* size is determined at runtime */
    null, /* origin is 0,0 */
    null, /* anchor is bottom center of the scaled image */
    new google.maps.Size(30, 40)
	);
	android = new google.maps.MarkerImage(
    'android.png',
    null,null,null,
    new google.maps.Size(40, 40)
	); 
	google.maps.event.addListenerOnce(map, 'idle', drawCoins);
	console.log("inside success 4");

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
	window.clearInterval(intervalId);
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


//Snap location to nearest street
function snapToNearestStreet(){
	for (var i = 0; i < 10; i++) {
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

//initialize coins on map when it's done loading
function drawCoins(){
	var initialBounds = map.getBounds();
	oldSouthWest = initialBounds.getSouthWest();
	oldNorthEast = initialBounds.getNorthEast();
	var lngSpan = oldNorthEast.lng() - oldSouthWest.lng();
	var latSpan = oldNorthEast.lat() - oldSouthWest.lat();

	//Generate 5 coin markers and place them on randLocations
	for (var i = 0; i < 10; i++) {
		randLocations[i] = new google.maps.LatLng(oldSouthWest.lat() + latSpan * Math.random(),
		oldSouthWest.lng() + lngSpan * Math.random());
		/*markers[i] = new google.maps.Marker({
					position: randLocations[i],
					map: map});*/
	}
	//Draw the coins on the nearest street
	snapToNearestStreet();
}


//Check if geolocation is supported by browser
//If yes, call success function
var intervalId;
console.log("Hello World");
if (navigator.geolocation) {
  console.log("Hello World 2");
  intervalId = setInterval(function(){
	navigator.geolocation.getCurrentPosition(success);
  	navigator.geolocation.watchPosition(updateLocation);  // Return curret position and continues to return it as it changes
  	console.log("hayny");
  },1000);
} 
else { console.log("Location not supported")}
