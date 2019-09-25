"use strict";
// Show coordinates on screen
map.on('mousemove', function (e) {
    document.getElementById('coordinates').innerHTML =
        `Mouse Coordinates on screen ${e.point} <br />Longitude: ${e.lngLat.lng} <br />Latitude: ${e.lngLat.lat}`;
});
// For changing the map style with the options,
var layerList = document.getElementById('map-types');
var inputs = layerList.getElementsByTagName('input');
function switchLayer(e) {
    if (e == null)
        return;
    var target = e.target;
    var targetId = target.id;
    map.setStyle('mapbox://styles/mapbox/' + targetId);
}
for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}
