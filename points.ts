import { Layer, EventData } from "mapbox-gl";
import { MapService } from './mapservice';
import { Feature, FeatureCollection } from "geojson";
import { Points } from "./geojson";
import $ from 'jquery';
import https from 'https';
import { resolve } from "path";
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
 * fill this into the file yet, so the Points.geojson object that loads the points 
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



map.on('load', function () {
    
    let temp = '';
    let styles: JQuery<string>;
    styles = $("#map-types :input").map(function () {
        console.log("Styles: " + this.id);
        return this.id;
    });

    Points.getSavedPoints();
    Points.displaySavedPoints();

    function getTemperature(e: EventData) : Promise<string> {

        return new Promise(async (resolve, reject) => {
            // Grabs the lat and long of point clicked
            let lat = e.lngLat.lat;
            let lon = e.lngLat.lng;
            let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=6a267a38043e6b6bcd7d776c5733c62d';
            console.log(url);
            
            // Sends get request to url & waits for return
            https.get(url, (res) => {
                let data = '';
                
                res.on('data', (d) => {
                    data += d;
                });
                
                res.on('end', () => {
                    // Converts temp in K to F
                    temp = Math.floor((1.8 * (JSON.parse(data).main.temp - 273) + 32)).toString();
                    console.log(temp);
                    return resolve(temp);
                });
            }).on('error', (e) => {
                console.error(e);
                return reject(new Error('Error occurred'))
            });
        })
    }

    async function pointManager(e: EventData) {
        // Get the layer(point) with an id in the layerIds array where the mouse just clicked 
        let features = map.queryRenderedFeatures(e.point, { layers: MapService.layerIds });
        let point: Feature;

        // Allow a max of 100 points 
        if (Points.geojson.features.length > 100) Points.geojson.features.pop();

        // If a feature(point) was clicked, remove it from the map
        if (features.length) {
            var id = features[0].properties.id;

            // Remove the point from the list in the side bar
            MapService.removeListElement(id);

            //Remove the layer from the map
            map.removeLayer(features[0].properties.id);
            map.removeSource(features[0].properties.id);

            // Return an array of all points except the one we clicked
            Points.geojson.features = Points.geojson.features.filter(function (point) {
                return point.properties.id !== id;
            });
            MapService.updateLayerArrays();
        }
        // Click on the map to create a new point
        else {

            // Create a random color for each new point
        
            let randomColor = () => {
                let code = (Math.floor(Math.random() * 256).toString(16));
                if (code.length < 2) code = '0' + code;
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
                    "id": 'PointID-' + new Date().getTime(),
                    "color": "#" + randomColor() + randomColor() + randomColor(),
                    "temp": await getTemperature(e)
                }
            };
            Points.geojson.features.push(point);

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
                    'circle-radius': 7,
                    'circle-color': ['get', 'color']
                },
                filter: ['in', '$type', 'Point']
            });

            MapService.updateLayerArrays();

            // Create new list element using loaded points
            MapService.newListElement(point.properties.id, point.geometry.coordinates[0], point.geometry.coordinates[1]);

            // Style the input field with the custom color picker after the element has been created
            MapService.buildColorPicker(point, point.properties.color, Points.geojson);
        }
        // Save the data
        MapService.writePoints(Points.geojson);
    }

    map.on('click', function (e) {
        pointManager(e);

    });
});