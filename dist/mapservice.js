"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Pickr = require('@simonwep/pickr');
class MapService {
    constructor() {
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
        let lng = longitude.toFixed(4);
        let lat = latitude.toFixed(4);
        var ul = document.getElementById('point-list');
        var newItems = `<li id=${id}><input class='color-picker'><label class='list-item'>(${lng}, ${lat})</label><br><button class='export'>Export</button><button class='delete'>Delete</button></li>`;
        ul.insertAdjacentHTML('beforeend', newItems);
        // $( "<input class='color-picker'><label class='list-item'>(-111.2231, 33.123)</label><br><button class='export'>Export</button><button class='delete'>Delete</button></li>" ).appendTo(".point-list");
    }
    static removeListElement(id) {
        var listElement = document.getElementById(id);
        listElement.replaceWith('');
    }
    static buildColorPicker(id, color) {
        var pickers = document.getElementsByClassName('color-picker');
        var pickersToArr = Array.from(pickers);
        for (let index = 0; index < pickersToArr.length; index++) {
            const pickr = Pickr.create({
                // Options
                el: '.color-picker',
                theme: 'nano',
                lockOpacity: true,
                // Nested scrolling is currently not supported and as this would be really sophisticated to add this
                // it's easier to set this to true which will hide pickr if the user scrolls the area behind it.
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
                        save: false
                    }
                }
            });
            pickr.on('change', () => {
                let color = '#' + pickr.getColor().toHEXA().join('');
                map.setPaintProperty('points', 'circle-color', color);
                //color =
            });
        }
    }
}
exports.MapService = MapService;
