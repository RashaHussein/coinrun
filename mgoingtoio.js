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
var diamondCount =0;

//Called if geolocation is supported
function success(position) {

	console.log("inside success");
	
	//Create Map Container
	var mapcanvas = document.createElement('div');
	mapcanvas.id = 'mapcontainer';
	resizeElementHeight(mapcanvas);  //Full screen for map
	document.querySelector('#container').appendChild(mapcanvas);

	console.log("inside success 2");


	// Create an array of styles.
  	var styles = [
    	{
      	stylers: [
        	{ hue: "#00ffe6" },
        	{ saturation: -20 },
      	]
    	},{
      	featureType: "road.local",
      	elementType: "geometry.stroke",
      	stylers: [
        	{ lightness: 100 },
        	{ visibility: "on" },
        	{ color: "#573a45" }
      	]
    	},{
      	featureType: "road",
      	elementType: "labels",
      	stylers: [
        	{ visibility: "on" }
      	]
    	}
  	];


  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  	var styledMap = new google.maps.StyledMapType(styles,
    	{name: "Styled Map"});

	//Define center of map to be teh current player location
	coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var options = {
		zoom: 19,
		center: coords,
		disableDefaultUI: true,          //disableDefaultUI on maps
		navigationControlOptions: {
			style: google.maps.NavigationControlStyle.SMALL
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControlOptions: {
      		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style'] //to style the map
    	}
	};


	//Initialize map
	map = new google.maps.Map(mapcanvas, options); 
	//Associate the styled map with the MapTypeId and set it to display.
 	map.mapTypes.set('map_style', styledMap);
  	map.setMapTypeId('map_style');

	//Define marker's icon for the player position
	avatar = new google.maps.MarkerImage(
    'avatar.png',
    null,null,null,
    new google.maps.Size(40, 40)
	); 	
	//Put Marker for current position 
	myPosition = new google.maps.Marker({
		position: coords,
		map: map,
		icon: avatar,
		optimized: false, 
		title:"Yo!"
	});
	myPosition.setMap(map);

	document.getElementById('scoreVal').innerText = diamondCount;
	//Call drawCoins function when map is loaded
	google.maps.event.addListenerOnce(map, 'idle', drawCoins);


	//Update Location
	autoUpdate();

	console.log("inside success 3");
} //End of success

//initialize coins on map when it's done loading
function drawCoins(){
	randLocations = generateRandomPoints(coords, 1000, 100);
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
		console.log(markers[i]);
	}
}

function autoUpdate() {
	console.log("Inside autoUpdate")
  	navigator.geolocation.getCurrentPosition(function(position) {  
  		enableHighAccuracy: true;
  		var accuracy = position.accuracy;
	    var newPoint = new google.maps.LatLng(position.coords.latitude, 
	                                          position.coords.longitude);
	    if (myPosition) {
	    	console.log("I am in if");
	      // Marker already created - Move it
	      myPosition.setPosition(newPoint);
	      updateScore(newPoint);
	    }
	    else {
	    	console.log("I am in else")
	      // Marker does not exist - Create it
	      myPosition = new google.maps.Marker({
	        position: newPoint,
	        optimized: false, 
	        map: map
	      });
	      updateScore(newPoint);
	    }

    // Center the map on the new position
    // map.setCenter(newPoint);
  }); 

  // Call the autoUpdate() function every 2 seconds
  setTimeout(autoUpdate, 2000);
}

/*
//Update current position of player
function updateLocation(position){
	console.log("inside updateLocation");
	coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	myPosition.setPosition(coords);
	map.setCenter(coords);
	updateScore(coords);
}//End of updateLocation*/

function updateScore(coords){
	for(var i=0; i<randLocations.length; i++){
		var dist = findDistance(coords, randLocations[i]);
		if(dist <= 0.02){
			score += 10;
			if(++diamondCount == 20) {
				message = document.createElement('div');
				message.className = 'startMenu';

				var messageTxt = document.createElement('p');
				messageTxt.textContent = "congratz. You reached the goal of collecting 20 diamonds. "+ "Your score is: "+ score;

				
				var contPlaying = document.createElement("button");
				contPlaying.type = "button";
				contPlaying.innerText = "Continue collecting diamonds";
				contPlaying.onclick = function (){
					message.style.display = "none";
				}

				message.appendChild(messageTxt);
				message.appendChild(contPlaying);
				document.querySelector('body').appendChild(message);	
				//alert ('congratz. You collected ' + diamondCount + 'diamonds ' + 'and your score is: '+ score);
			}
			removeMarker(i); //Changed Markers[i] to randLocations[i]
		}
		document.getElementById('scoreVal').innerText = diamondCount;
	}
}

//Remove marker aquired
function removeMarker(i){
	console.log("inside removeMarker");
	console.log(markers[i]);
	
	markers[i].setMap(null);
	markers.splice(i, 1);
	randLocations.splice(i, 1);
	console.log(markers);
    
    map.setZoom(20);
    map.setZoom(19);
}

//Find distance between current location and each coin and save in distance[]
function findDistance(currentPosition, itemLocation){
	var lat = currentPosition.lat();
	var lng = currentPosition.lng();

	var mlat = itemLocation.lat();
	var mlng = itemLocation.lng();

	var dLat  = rad(mlat - lat);
	var dLong = rad(mlng - lng);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = R * c;
	console.log(d);

	return d;
	//distances[index++] = d;
}

//Resize Map Canvas element to full screen
function resizeElementHeight(element) {	
	var height = 0;
	var body = window.document.body;
	if (window.innerHeight) {height = window.innerHeight;}
	else if (body.parentElement.clientHeight) {height = body.parentElement.clientHeight;}
	else if (body && body.clientHeight) {height = body.clientHeight;}
	element.style.height = ((height - element.offsetTop) + "px");
}//End of resizeElementHeight

//Convert to Radian
function rad(x){
	return x*Math.PI/180;
}


function initUserLocation(){
	startMenu.style.display = "none";
	document.getElementById('licence').style.display = "none";

	navigator.geolocation.getCurrentPosition(success);
  	//navigator.geolocation.watchPosition(updateLocation);  // Return curret position and continues to return it as it changes
}

function initializeUI(){
	displayMenu();
	initScoreUI();
}

function displayMenu(){
	startMenu = document.createElement('div');
	startMenu.className = 'startMenu';

	var welcomeTxt = document.createElement('p');
	welcomeTxt.textContent = "Welcome to Coin Run"

	var playButton = document.createElement("button");
	playButton.type = "button";
	playButton.value = "Play";
	playButton.innerText = "Start Challenge";
	playButton.onclick = function (){
		initUserLocation();
	}

	var howTo = document.createElement("button");
	howTo.type = "button";
	howTo.value = "howTo";
	howTo.innerText = "How to Play";
	howTo.onclick = function (){
		welcomeTxt.style.display = "none";
		playButton.style.display = "none";
		howTo.style.display = "none";

		var howTxt = document.createElement('p');
		howTxt.id = "hint";
		howTxt.textContent = "Collect at least 35 diamonds by physically going to places displayed on the map to increase your score and lose some weight ;-)"
		startMenu.appendChild(howTxt);

		var hint = document.createElement('p');
		hint.id = "hint";
		hint.textContent = "hint: There is a 100 diamond within a mile radius around your current location";
		startMenu.appendChild(hint);

		var mainMenu = document.createElement("button");
		mainMenu.type = "button";
		mainMenu.value = "mainMenu";
		mainMenu.innerText = "Go to Main Menu";
		mainMenu.onclick = function (){
			howTxt.style.display = "none";
			hint.style.display = "none";
			mainMenu.style.display = "none";

			welcomeTxt.style.display = "block";
			playButton.style.display = "block";
			howTo.style.display = "block";
		}
		startMenu.appendChild(mainMenu);
	}

	startMenu.appendChild(welcomeTxt);
	startMenu.appendChild(playButton);
	startMenu.appendChild(howTo);
	document.querySelector('body').appendChild(startMenu);
	

}

function initScoreUI(){
	var scoreDiv = document.getElementById("score");
	var newUL = document.createElement("ul");
	scoreDiv.appendChild(newUL);

	var imgElem = document.createElement("li");
	//Create a coin image to be displayed beside score
  	var img=document.createElement("img");
  	img.setAttribute('src', 'coin.png');
  	img.setAttribute('alt', 'na');
	img.setAttribute('height', '20');
	img.setAttribute('width', '20');

	imgElem.appendChild(img);
	newUL.appendChild(imgElem);

	//Empty Space
	var empty = document.createElement("li");
	newUL.appendChild(empty);

	//Create the area to display number of diamonds collected
	var txtElem = document.createElement("li");	
	txtElem.id = 'scoreVal';
	var scoreText = document.createTextNode(diamondCount);

	txtElem.appendChild(scoreText);
	newUL.appendChild(txtElem);
}

//Check if geolocation is supported by browser
//If yes, call success function
if (navigator.geolocation) {
  console.log("Hello World 2");
} 
else { alert("Location not supported");}





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
