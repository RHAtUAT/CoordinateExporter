"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
/**
 * A reference to the FeatureCollection of points
 * this way the reference can be passed between different files
 */
class Points {
    static displaySavedPoints() {
        // Make a new source and layer for each point
        Points.geojson.features.forEach((element) => {
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
                        'circle-radius': 7,
                        'circle-color': ['get', 'color']
                    },
                    filter: ['in', '$type', 'Point']
                });
                mapservice_1.MapService.updateLayerArrays();
                mapservice_1.MapService.getPointSources();
                // Add a list element for each point on the map
                mapservice_1.MapService.newListElement(element.properties.id, element.geometry.coordinates[0], element.geometry.coordinates[1]);
                //Replace the default color picker window with the custom one
                mapservice_1.MapService.buildColorPicker(element, element.properties.color, Points.geojson);
            }
        });
    }
    static getSavedPoints() {
        // Get the points from the save file
        Points.geojson = mapservice_1.MapService.readPoints();
        // Error handling for reading from the file
        if (!('features' in Points.geojson))
            console.log('Starting from blank save file.');
        else if (!Points.geojson.features.length)
            console.log('No points were saved.');
        else
            console.log('Loaded %d points.', Points.geojson.features.length);
    }
}
exports.Points = Points;
