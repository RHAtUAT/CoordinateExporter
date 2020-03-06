"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const serialcom_1 = require("./serialcom");
const pickr_1 = __importDefault(require("@simonwep/pickr"));
const jquery_1 = __importDefault(require("jquery"));
exports.Templates = {
    sidebarPointItem: jquery_1.default('#sidebarPointItem').contents()
};
const sidebarButton = jquery_1.default('#side-nav-btn');
const optionsSidebarButton = jquery_1.default('#options-btn');
const pointsSidebarButton = jquery_1.default('#points');
const coordinateSwitch = jquery_1.default('#coordinate-switch');
const coordinateText = jquery_1.default('#coordinates');
const pointListElement = jquery_1.default('#point-list');
const initialTextElement = jquery_1.default('#initialText');
class Sidebar {
    constructor() {
        this._pointListItems = {};
        sidebarButton.on('click', () => this._toggleSidebar());
        optionsSidebarButton.on('click', () => this._toggleMenuDropDown('options-tab'));
        pointsSidebarButton.on('click', () => this._toggleMenuDropDown('points-tab'));
        coordinateSwitch.on('click', () => this._toggleCoordinates());
    }
    updateCoordinates(lat, long) {
        coordinateText.html(`Latitude: ${lat.toFixed(4)}<br>Longitude: ${long.toFixed(4)}`);
    }
    addPoint(point) {
        const id = point.properties.id;
        const li = exports.Templates.sidebarPointItem.clone();
        const [long, lat] = point.geometry.coordinates;
        li.find('.list-item').text(`(${lat.toFixed(4)}, ${long.toFixed(4)})`);
        li.find('.export').on('click', e => this._onExportClick(e, point));
        li.find('.delete').on('click', e => this._onDeleteClick(e, point));
        li.find('.flyImage').on('click', e => this._onFlyToClick(e, point));
        initialTextElement.hide();
        li.appendTo(pointListElement);
        this._initColorPicker(li, point);
        this._pointListItems[id] = li;
    }
    _onExportClick(e, point) {
        const [longitude, latitude] = point.geometry.coordinates;
        serialcom_1.SerialCom.writeToArduino(longitude, latitude);
    }
    _onDeleteClick(e, point) {
        _1.App.map.pointManager.removePoint(point);
        _1.App.map.pointManager.savePoints();
    }
    _onFlyToClick(e, point) {
        const [latitude, longitude] = point.geometry.coordinates;
        _1.App.map.instance.flyTo({
            center: [latitude, longitude]
        });
    }
    removePoint(point) {
        const id = point.properties.id;
        if (id in this._pointListItems) {
            this._pointListItems[id].remove();
            delete this._pointListItems[id];
        }
    }
    _initColorPicker(li, point) {
        const color = point.properties.color;
        const id = point.properties.id;
        const pickr = pickr_1.default.create({
            el: li.find('.color-picker')[0],
            theme: 'nano',
            lockOpacity: true,
            closeOnScroll: false,
            default: color,
            swatches: [
                'rgb(244, 67, 54)',
                'rgb(233, 30, 99)',
                'rgb(156, 39, 176)',
                'rgb(103, 58, 183)',
                'rgb(63, 81, 181)',
                'rgb(33, 150, 243)',
                'rgb(3, 169, 244)',
                'rgb(0, 188, 212)',
                'rgb(0, 150, 136)',
                'rgb(76, 175, 80)',
                'rgb(139, 195, 74)',
                'rgb(205, 220, 57)',
                'rgb(255, 235, 59)',
                'rgb(255, 193, 7)'
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
            _1.App.map.instance.setPaintProperty(id, 'circle-color', color);
        });
        pickr.on('save', () => {
            let pickedColor = '#' + pickr.getColor().toHEXA().join('');
            point.properties.color = pickedColor;
            _1.App.map.pointManager.savePoints();
        });
        pickr.on('hide', () => {
            _1.App.map.instance.setPaintProperty(id, 'circle-color', point.properties.color);
        });
    }
    _toggleSidebar() {
        if (document.getElementById('sideNav').style.width == '30%' &&
            document.getElementById('side-nav-btn').style.marginLeft == '30%') {
            document.getElementById('sideNav').style.width = '0';
            document.getElementById('side-nav-btn').style.marginLeft = '0';
            document.getElementById('coordinates').style.marginLeft = '0';
            document.getElementById('info-label').style.width = '0';
        }
        else {
            document.getElementById('sideNav').style.width = '30%';
            document.getElementById('side-nav-btn').style.marginLeft = '30%';
            document.getElementById('coordinates').style.marginLeft = '30%';
            document.getElementById('info-label').style.width = '30%';
        }
    }
    _toggleMenuDropDown(id) {
        if (document.getElementById(id).style.display == 'none' || document.getElementById(id).style.display == '') {
            document.getElementById(id).style.display = 'block';
            if (id == "options-tab") {
                document.getElementById("options-btn").style.backgroundColor = "#000";
                document.getElementById("options-btn").style.color = "white";
            }
            else if (id == "points-tab") {
                document.getElementById("points").style.backgroundColor = "#000";
                document.getElementById("points").style.color = "white";
            }
        }
        else {
            document.getElementById(id).style.display = 'none';
            if (id == "options-tab") {
                document.getElementById("options-btn").style.backgroundColor = "#303030";
                document.getElementById("options-btn").style.color = "#818181";
            }
            else if (id == "points-tab") {
                document.getElementById("points").style.backgroundColor = "#303030";
                document.getElementById("points").style.color = "#818181";
            }
        }
    }
    _toggleCoordinates() {
        let input = document.getElementById('coordinate-switch');
        if (input.checked == true)
            document.getElementById('coordinates').style.display = 'block';
        else
            document.getElementById('coordinates').style.display = 'none';
    }
}
exports.Sidebar = Sidebar;
