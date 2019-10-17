"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
const request = require('snekfetch');
const https = require('https');
/**
 * ////////////////////////////////////////////////////////////////////////////
 * ///                                NOTE                                  ///
 * ////////////////////////////////////////////////////////////////////////////
 ******************************************************************************
 * Property 'coordinates' does not exist on type 'Geometry' error isn't correct,
 * coordinates are a valid property, but the IDE doesnt think so for some reason
 * haven't cared enough to figure out why yet
 ******************************************************************************
 */
/**
 * If you accidently delete the point-data.json file while working on it
 * or for testing, or what ever, here's the default object data that needs
 * to be in it to not cause an error, there's no error handling to auto
 * fill this into the file yet, so the geojson object that loads the points
 * will be undefined if the file is blank
 *
 *
{
    "type": "FeatureCollection",
    "features": [

    ]
}
 *
 */
let layers;
let layerIds;
let temp = '';
map.on('load', function () {
    // Get the points from the save file
    let geojson = mapservice_1.MapService.readPoints();
    // Error handling for reading from the file
    if (!('features' in geojson))
        console.log('Starting from blank save file.');
    else if (!geojson.features.length)
        console.log('No points were saved.');
    else
        console.log('Loaded %d points.', geojson.features.length);
    // Make a new source and layer for each point
    geojson.features.forEach(element => {
        if (element.properties.id != undefined) {
            map.addSource(element.properties.id, {
                type: "geojson",
                data: element
            });
            // Add points to the map
            map.addLayer({
                id: element.properties.id,
                type: 'circle',
                source: element.properties.id,
                paint: {
                    'circle-radius': 5,
                    'circle-color': ['get', 'color']
                },
                filter: ['in', '$type', 'Point']
            });
            layers = map.getStyle().layers.filter(function (layers) {
                return layers.id.includes('PointID-');
            });
            layerIds = layers.map(element => {
                return element.id;
            });
            // Add a list element for each point on the map
            mapservice_1.MapService.newListElement(element.properties.id, element.geometry.coordinates[0], element.geometry.coordinates[1]);
            //Replace the default color picker window with the custom one
            mapservice_1.MapService.buildColorPicker(element, element.properties.color, geojson);
        }
    });
    function updateLayerArrays() {
        // Get all the layers and return an array of the ones the user creates  
        layers = map.getStyle().layers.filter(function (layers) {
            return layers.id.includes('PointID-');
        });
        // Create an array of layer ids
        layerIds = layers.map(element => {
            return element.id;
        });
    }
    function getData(e) {
        // grabs the lat and long of point clicked
        var lat = e.lngLat.lat;
        var lon = e.lngLat.lng;
        let apiLink = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=6a267a38043e6b6bcd7d776c5733c62d';
        console.log(apiLink);
        // sends get request to apiLink & waits for return
        https.get(apiLink, (res) => {
            let data = '';

            res.on('data', (d) => {
                data += d;
            });

            res.on('end', () => {
                // converts temp in K to F
                temp = Math.floor(1.8 * ((JSON.parse(data).main.temp) - 273) + 32);
                addPoint(e);
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }
    function addPoint(e) {
        // Get the layer(point) with an id in the layerIds array where the mouse just clicked 
        var features = map.queryRenderedFeatures(e.point, { layers: layerIds });
        var point;
        // Allow a max of 100 points 
        if (geojson.features.length > 100)
            geojson.features.pop();
        // If a feature(point) was clicked, remove it from the map
        if (features.length) {
            var id = features[0].properties.id;
            // Remove the point from the list in the side bar
            mapservice_1.MapService.removeListElement(id);
            //Remove the layer from the map
            map.removeLayer(features[0].properties.id);
            map.removeSource(features[0].properties.id);
            // Return an array of all points except the one we clicked
            geojson.features = geojson.features.filter(function (point) {
                return point.properties.id !== id;
            });
            updateLayerArrays();
        }
        // Click on the map to create a new point
        else {
            // Create a random color for each new point
            let randomColor = () => {
                let code = (Math.floor(Math.random() * 256).toString(16));
                if (code.length < 2)
                    code = '0' + code;
                return code;
            };
            point = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        e.lngLat.lng,
                        e.lngLat.lat
                    ]
                },
                "properties": {
                    "id": 'PointID-' + String(new Date().getTime()),
                    "color": "#" + randomColor() + randomColor() + randomColor(),
                    "temp": temp
                }
            };
            geojson.features.push(point);
            // Add a new source
            map.addSource(point.properties.id, {
                type: "geojson",
                data: point
            });
            // Add the point as a new layer
            map.addLayer({
                id: point.properties.id,
                type: 'circle',
                source: point.properties.id,
                paint: {
                    'circle-radius': 5,
                    'circle-color': ['get', 'color']
                },
                filter: ['in', '$type', 'Point']
            });
            updateLayerArrays();
            // Create new list element using loaded points
            mapservice_1.MapService.newListElement(point.properties.id, point.geometry.coordinates[0], point.geometry.coordinates[1]);
            // Style the input field with the custom color picker after the element has been created
            mapservice_1.MapService.buildColorPicker(point, point.properties.color, geojson);
        }
        // Save the data
        mapservice_1.MapService.writePoints(geojson);
    }
    map.on('click', function (e) {
        getData(e);
    });
});
