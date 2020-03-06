"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const geojson_1 = require("./geojson");
const serialcom_1 = require("./serialcom");
const Pickr = require('@simonwep/pickr');
class MapService {
    static updateLayerArrays() {
        MapService.layerIds = MapService.getPointLayers().map(element => {
            return element.id;
        });
    }
    static getPointLayers() {
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
    static readPoints() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.getSaveFile()).toString());
        }
        catch (err) {
            console.error('Failed to read %s file due to error: %s', this.getSaveFile(), err.message);
            return {};
        }
    }
    static writePoints(data) {
        fs_1.default.writeFileSync(this.getSaveFile(), JSON.stringify(data, null, 4));
    }
    static newListElement(id, longitude, latitude) {
        let initialText = document.getElementById('initialText');
        if (initialText != null) {
            initialText.replaceWith('');
        }
        let ul = document.getElementById('point-list');
        let lng = longitude.toFixed(4);
        let lat = latitude.toFixed(4);
        let colorPicker = `<input class='color-picker'>`;
        let coordinatesLabel = `<label class='list-item'>(${lng}, ${lat})</label>`;
        let exportButton = `<button id=Export-Button-${id} class='export'>Export</button>`;
        let deleteButton = `<button id=Delete-Button-${id} class='delete'>Delete</button>`;
        let flyToButton = `
        <span class='fly'> 
            <span class='tooltip'>
                    <img id='fly-to-${id}' class='flyImage' src='/images/send.svg'>    
                <span class="tooltiptext">Fly to point</span>
            </span>
        </span>`;
        let newItem = `<li id=${id}>
        ${colorPicker}
        ${coordinatesLabel}
        ${flyToButton}
        <br>
        ${exportButton}
        ${deleteButton}
        </li>`;
        ul.insertAdjacentHTML('beforeend', newItem);
        MapService.addFlyToListener(id, longitude, latitude);
        document.getElementById(`Delete-Button-${id}`).addEventListener('click', function () {
            MapService.removePoint(id);
        });
        document.getElementById(`Export-Button-${id}`).addEventListener('click', function () {
            MapService.exportPoint(longitude, latitude);
        });
    }
    static addFlyToListener(id, longitude, latitude) {
        document.getElementById(`fly-to-${id}`).addEventListener('click', function () {
            map.flyTo({ center: [longitude, latitude] });
        });
    }
    static removeListElement(id) {
        let listElement = document.getElementById(id);
        listElement.replaceWith('');
    }
    static exportPoint(longitude, latitude) {
        serialcom_1.SerialCom.writeToArduino(longitude, latitude);
    }
    static removePoint(id) {
        console.log("RemovePoint");
        MapService.removeListElement(id);
        map.removeLayer(id);
        map.removeSource(id);
        geojson_1.Points.geojson.features = geojson_1.Points.geojson.features.filter(function (element) {
            return element.properties.id !== id;
        });
        MapService.updateLayerArrays();
        MapService.writePoints(geojson_1.Points.geojson);
    }
    static buildColorPicker(feature, color, featureCollection) {
        const pickr = Pickr.create({
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
                preview: true,
                opacity: true,
                hue: true,
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
            let color = '#' + pickr.getColor().toHEXA().join('');
            map.setPaintProperty(feature.properties.id, 'circle-color', color);
        });
        pickr.on('save', () => {
            let color = '#' + pickr.getColor().toHEXA().join('');
            feature.properties.color = color;
            MapService.writePoints(featureCollection);
        });
        pickr.on('hide', () => {
            map.setPaintProperty(feature.properties.id, 'circle-color', feature.properties.color);
        });
    }
}
exports.MapService = MapService;
