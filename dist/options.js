"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
const geojson_1 = require("./geojson");
// Show coordinates on screen
map.on('mousemove', function (e) {
    document.getElementById('coordinates').innerHTML =
        `Mouse Coordinates on screen ${e.point.x}, ${e.point.y}  <br />Longitude: ${e.lngLat.lng} <br />Latitude: ${e.lngLat.lat}`;
});
// For changing the map style with the options,
var layerList = document.getElementById('map-types');
var inputs = layerList.getElementsByTagName('input');
let mapStyles;
function switchStyle(e) {
    if (e == null)
        return;
    var target = e.target;
    var targetId = target.id;
    map.setStyle('mapbox://styles/mapbox/' + targetId);
    //Broken, does nothing but cause errors
    for (let element of geojson_1.Points.geojson.features) {
        mapservice_1.MapService.removePoint(element.properties.id);
    }
    geojson_1.Points.getSavedPoints();
    geojson_1.Points.displaySavedPoints();
}
for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchStyle;
}
