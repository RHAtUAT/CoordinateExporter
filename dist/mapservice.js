"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const geojson_1 = require("./geojson");
const Pickr = require('@simonwep/pickr');
class MapService {
    static updateLayerArrays() {
        // Create an array of layer ids
        MapService.layerIds = MapService.getPointLayers().map(element => {
            return element.id;
        });
    }
    static getPointLayers() {
        // Get all the layers and return an array of the ones the user creates  
        let layers;
        layers = map.getStyle().layers.filter(function (layers) {
            return layers.id.includes('PointID-');
        });
        return layers;
    }
    static getPointSources() {
        let sources = map.getStyle().sources;
        console.log("sources: " + sources);
        return sources;
    }
    static getSaveFile() {
        return path_1.default.join(__dirname, '../point-data.json');
    }
    // Read the points from the JSON File
    // TODO: Add error handling for if the user deletes the file
    static readPoints() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.getSaveFile()).toString());
        }
        catch (err) {
            console.error('Failed to read %s file due to error: %s', this.getSaveFile(), err.message);
            return {};
        }
    }
    // Write the points to the JSON file
    static writePoints(data) {
        fs_1.default.writeFileSync(this.getSaveFile(), JSON.stringify(data, null, 4));
    }
    // Inserts html into the 'ul' element to display the point's information
    static newListElement(id, longitude, latitude) {
        let initialText = document.getElementById('initialText');
        if (initialText != null) {
            initialText.replaceWith('');
        }
        // Inserts the HTML code for adding a new list element
        let ul = document.getElementById('point-list');
        let lng = longitude.toFixed(4);
        let lat = latitude.toFixed(4);
        let newItems = `<li id=${id}><input class='color-picker'><label class='list-item'>(${lng}, ${lat})</label><br><button class='export'>Export</button><button id=Delete-Button-${id} class='delete'>Delete</button></li>`;
        ul.insertAdjacentHTML('beforeend', newItems);
        document.getElementById(`Delete-Button-${id}`).addEventListener('click', function () {
            MapService.removePoint(id);
        });
    }
    // Remove the list element. This is called when the point is removed
    static removeListElement(id) {
        let listElement = document.getElementById(id);
        listElement.replaceWith('');
    }
    static removePoint(id) {
        console.log("RemovePoint");
        // Remove the point from the list in the side bar
        MapService.removeListElement(id);
        //Remove the layer from the map
        map.removeLayer(id);
        map.removeSource(id);
        // Return an array of all points except the one we clicked
        geojson_1.Points.geojson.features = geojson_1.Points.geojson.features.filter(function (element) {
            return element.properties.id !== id;
        });
        MapService.updateLayerArrays();
        // Save the data
        MapService.writePoints(geojson_1.Points.geojson);
    }
    // Replace the default windows color picker
    static buildColorPicker(feature, color, featureCollection) {
        const pickr = Pickr.create({
            // Color picker options
            el: '.color-picker',
            theme: 'nano',
            lockOpacity: true,
            closeOnScroll: false,
            default: color,
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)',
                'rgba(0, 150, 136, 0.75)',
                'rgba(76, 175, 80, 0.8)',
                'rgba(139, 195, 74, 0.85)',
                'rgba(205, 220, 57, 0.9)',
                'rgba(255, 235, 59, 0.95)',
                'rgba(255, 193, 7, 1)'
            ],
            components: {
                // Main components
                preview: true,
                opacity: true,
                hue: true,
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: false,
                    save: true
                }
            }
        });
        pickr.on('change', () => {
            // Get the color from the color picker
            let color = '#' + pickr.getColor().toHEXA().join('');
            // Set the circle-color of the layer on the map
            map.setPaintProperty(feature.properties.id, 'circle-color', color);
        });
        pickr.on('save', () => {
            // Get the color from the color picker
            let color = '#' + pickr.getColor().toHEXA().join('');
            // Save the new color to the JSON file
            feature.properties.color = color;
            MapService.writePoints(featureCollection);
        });
        pickr.on('hide', () => {
            // Set the circle-color of the layer on the map
            map.setPaintProperty(feature.properties.id, 'circle-color', feature.properties.color);
        });
    }
}
exports.MapService = MapService;
