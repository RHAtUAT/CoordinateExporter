import { MapService } from "./mapservice";
import { Points } from "./geojson";
import { Feature } from "geojson";

// Show coordinates on screen
map.on('mousemove', function (e) {
    document.getElementById('coordinates').innerHTML =
        `Mouse Coordinates on screen ${e.point.x}, ${e.point.y}  <br />Longitude: ${e.lngLat.lng} <br />Latitude: ${e.lngLat.lat}`;
});

// For changing the map style with the options,

var layerList: HTMLElement | null = document.getElementById('map-types');
var inputs: HTMLCollectionOf<HTMLElement> = layerList.getElementsByTagName('input');
let mapStyles: string[];


function switchStyle(e: MouseEvent) {
    if (e == null) return;
    var target = <HTMLInputElement>e.target!;
    var targetId = target.id
    map.setStyle('mapbox://styles/mapbox/' + targetId);
    //Broken, does nothing but cause errors
    for(let element of Points.geojson.features){
        MapService.removePoint(element.properties.id);
    }
    Points.getSavedPoints();
    Points.displaySavedPoints();
    
}
for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchStyle;
}
