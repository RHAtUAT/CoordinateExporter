"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeoJson {
    constructor(coordinates, properties) {
        this.properties = properties;
        this.type = 'Feature';
        this.geometry = {
            type: 'Point',
            coordinates: coordinates
        };
    }
}
exports.GeoJson = GeoJson;
class FeatureCollection {
    constructor(features) {
        this.features = features;
        this.type = 'FeatureCollection';
    }
}
exports.FeatureCollection = FeatureCollection;
