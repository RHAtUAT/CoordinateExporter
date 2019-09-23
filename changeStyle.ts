import { Layer, CustomLayerInterface, AnySourceData, GeoJSONSource, AnySourceImpl, Point } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { MapService } from './mapservice';
import { MapBox } from "./mapbox";
import { Feature, FeatureCollection, GeoJsonObject } from "geojson";


//-----------------------------------------------------------------------

//-----------------------------------------------------------------------

//---------------------------------------------------------------------------------
//Load dragable point


// Simple example, see optional options for more configuration.



// var geojson = {
//     "type": "FeatureCollection",
//     "features": [{
//         "type": "Feature",
//         "properties": { "id": "", 'color': '#000' },
//         "geometry": {
//             "type": "Point",
//             "coordinates": [0, 0]
//         }
//     }]
// } as FeatureCollection;

map.on('load', function () {

    // Get the points from the save file
    let geojson : FeatureCollection = MapService.readPoints();

    // Error handling for reading from the file
    if (!('features' in geojson)) console.log('Starting from blank save file.');
    else if (!geojson.features.length) console.log('No points were saved.');
    else console.log('Loaded %d points.', geojson.features.length);

    // Add a single point to the map
    map.addSource('geojson', {
        type: "geojson",
        data: geojson
    });

    // Add points to the map
    map.addLayer({
        id: 'points' ,
        type: 'circle',
        source: 'geojson',
        paint: {
            'circle-radius': 5,
            'circle-color': ['get', 'color']
        },
        filter: ['in', '$type', 'Point']
    });

    geojson.features.forEach(element => {
        
        console.log(`point.properties.id ${element.properties.id}`);
        // Add a list element for each point on the map
        MapService.newListElement(element.properties.id, element.geometry.coordinates[0], element.geometry.coordinates[1]);
        //Replace the default color picker window with the custom one
        MapService.buildColorPicker( element.properties.id, element.properties.color);
    });


    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
        var point: Feature;
        
        // Allow a max of 100 points 
        if (geojson.features.length > 100) geojson.features.pop();

        // If a feature(point) was clicked, remove it from the map
        if (features.length) {
            var id = features[0].properties.id;
            geojson.features = geojson.features.filter(function (point) {
                return point.properties.id !== id;
            });
        } 
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
                    "id": String(new Date().getTime()),
                    "color": "#" + randomColor() + randomColor() + randomColor()
                }
            };
            console.log(`point.properties.id${point.properties.id}`);
            MapService.newListElement(point.properties.id, point.geometry.coordinates[0], point.geometry.coordinates[1]);
            MapService.buildColorPicker( point.properties.id, point.properties.color);
            geojson.features.push(point);
        }
        
        var source = <GeoJSONSource>map.getSource('geojson');
        source.setData(geojson);
        MapService.writePoints(geojson);


    });

});

// Create new list element using loaded points

// Show coordinates
map.on('mousemove', function (e) {
    document.getElementById('coordinates').innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        // e.lngLat is the longitude, latitude geographical position of the event
        //JSON.stringify(e.lngLat.wrap()
        `Mouse Coordinates on screen ${e.point} <br />Longitude: ${e.lngLat.lng} <br />Latitude: ${e.lngLat.lat}`;
});

//---------------------------------------------------------------------------------------------
// For changing the map style

var layerList: HTMLElement | null = document.getElementById('map-types');

var inputs: HTMLCollectionOf<HTMLElement> = layerList.getElementsByTagName('input');

function switchLayer(e: MouseEvent) {


    if (e == null) return;
    var target = <HTMLInputElement>e.target!;
    var targetId = target.id
    map.setStyle('mapbox://styles/mapbox/' + targetId);

}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}
