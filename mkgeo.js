/**
 * Generates number of random geolocation points given a center and a radius.
 * @param  {google.maps.LatLng} center The center point to generate around it.
 * @param  {number} radius Radius in meters.
 * @param {number} count Number of points to generate.
 * @return {array} Array of google.maps.LatLng.
 */
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}


/**
 * Generates number of random geolocation points given a center and a radius.
 * Reference URL: http://goo.gl/KWcPE.
 * @param  {google.maps.LatLng} center The center point to generate around it.
 * @param  {number} radius Radius in meters.
 * @return {google.maps.LatLng} The generated random points.
 */
function generateRandomPoint(center, radius) {
  var x0 = center.lng();
  var y0 = center.lat();
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  //return new google.maps.LatLng(xp+x0, y+y0);
  return new google.maps.LatLng(y+y0, xp+x0);
}