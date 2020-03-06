"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
class Points {
    static displaySavedPoints() {
        Points.geojson.features.forEach((element) => {
            if (element.properties.id != undefined) {
                map.addSource(element.properties.id, {
                    type: "geojson",
                    data: element
                });
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
                mapservice_1.MapService.newListElement(element.properties.id, element.geometry.coordinates[0], element.geometry.coordinates[1]);
                mapservice_1.MapService.buildColorPicker(element, element.properties.color, Points.geojson);
            }
        });
    }
    static getSavedPoints() {
        Points.geojson = mapservice_1.MapService.readPoints();
        if (!('features' in Points.geojson))
            console.log('Starting from blank save file.');
        else if (!Points.geojson.features.length)
            console.log('No points were saved.');
        else
            console.log('Loaded %d points.', Points.geojson.features.length);
    }
}
exports.Points = Points;
