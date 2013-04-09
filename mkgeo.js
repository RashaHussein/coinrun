/**
 * Integers that indicate directions.
 * @enum {integer}
 */
var DIRECTIONS = {
    EAST: 0,
    NORTH_EAST: 1,
    NORTH: 2,
    NORTH_WEST: 3,
    WEST: 4,
    SOUTH_WEST: 5,
    SOUTH: 6,
    SOUTH_EAST: 8
};

/**
 * Generates number of random geolocation points given a center and a radius.
 * @param  {google.maps.LatLng} center The center point to generate around it.
 * @param  {number} radius Radius in meters.
 * @param {number} count Number of points to generate.
 * @param {number} direction An integer indicating direction See mkgeo.DIRECTIONS.
 * @return {array} Array of google.maps.LatLng.
 */
function generateRandomPoints(center, radius, count, direction) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius, direction));
  }
  return points;
}


/**
 * Generates number of random geolocation points given a center and a radius.
 * Reference URL: http://goo.gl/KWcPE.
 * @param  {google.maps.LatLng} center The center point to generate around it.
 * @param  {number} radius Radius in meters.
 * @param {number} direction An integer indicating direction See mkgeo.DIRECTIONS.
 * @return {google.maps.LatLng} The generated random points.
 */
function generateRandomPoint(center, radius, direction) {
  var x0 = center.lng();
  var y0 = center.lat();
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();
  var sign = v>=0.5 ? -1 : 1;
  var w = rd * Math.sqrt(u);
  var width = Math.PI/36;

  var t = 2 * Math.PI * v; // Full circle.
  
  // If direction provided generate in that direction.
  if (direction != undefined) t = ((2 * Math.PI/36 * v) + direction*Math.PI/4);
  
  console.log('t: ' + t);
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  //return new google.maps.LatLng(xp+x0, y+y0);
  return new google.maps.LatLng(y+y0, xp+x0);
}