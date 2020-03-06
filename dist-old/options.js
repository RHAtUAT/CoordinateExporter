"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
const geojson_1 = require("./geojson");
class Options {
    constructor() {
        this.layerList = document.getElementById('map-types');
        this.inputs = this.layerList.getElementsByTagName('input');
    }
    TrackMouse() {
        map.on('mousemove', function (e) {
            document.getElementById('coordinates').innerHTML =
                `Mouse Coordinates on screen ${e.point.x}, ${e.point.y}  <br />Longitude: ${e.lngLat.lng} <br />Latitude: ${e.lngLat.lat}`;
        });
    }
    switchStyle(e) {
        if (e == null)
            return;
        var target = e.target;
        var targetId = target.id;
        map.setStyle('mapbox://styles/mapbox/' + targetId);
        for (let element of geojson_1.Points.geojson.features) {
            mapservice_1.MapService.removePoint(element.properties.id);
        }
        geojson_1.Points.getSavedPoints();
        geojson_1.Points.displaySavedPoints();
    }
    for() { }
}
exports.Options = Options;
var i = 0;
i < inputs.length;
i++;
{
    inputs[i].onclick = switchStyle;
}
