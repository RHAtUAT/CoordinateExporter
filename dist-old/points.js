"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mapservice_1 = require("./mapservice");
const serialcom_1 = require("./serialcom");
const geojson_1 = require("./geojson");
const jquery_1 = __importDefault(require("jquery"));
const https_1 = __importDefault(require("https"));
map.on('load', function () {
    let id = null;
    let temp = '';
    let styles;
    styles = jquery_1.default("#map-types :input").map(function () {
        console.log("Styles: " + this.id);
        return this.id;
    });
    geojson_1.Points.getSavedPoints();
    geojson_1.Points.displaySavedPoints();
    serialcom_1.SerialCom.getConnectedArduino();
    function getTemperature(e) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let lat = e.lngLat.lat;
            let lon = e.lngLat.lng;
            let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=6a267a38043e6b6bcd7d776c5733c62d';
            console.log(url);
            https_1.default.get(url, (res) => {
                let data = '';
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    temp = Math.floor((1.8 * (JSON.parse(data).main.temp - 273) + 32)).toString();
                    console.log(temp);
                    return resolve(temp);
                });
            }).on('error', (e) => {
                console.error(e);
                return reject(new Error('Error occurred'));
            });
        }));
    }
    function pointManager(e) {
        return __awaiter(this, void 0, void 0, function* () {
            let features = map.queryRenderedFeatures(e.point, { layers: mapservice_1.MapService.layerIds });
            let point;
            if (geojson_1.Points.geojson.features.length > 100)
                geojson_1.Points.geojson.features.pop();
            if (features.length) {
                var id = features[0].properties.id;
                mapservice_1.MapService.removeListElement(id);
                map.removeLayer(features[0].properties.id);
                map.removeSource(features[0].properties.id);
                geojson_1.Points.geojson.features = geojson_1.Points.geojson.features.filter(function (point) {
                    return point.properties.id !== id;
                });
                mapservice_1.MapService.updateLayerArrays();
            }
            else {
                let randomColor = () => {
                    let code = (Math.floor(Math.random() * 256).toString(16));
                    if (code.length < 2)
                        code = '0' + code;
                    return code;
                };
                point = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [
                            e.lngLat.lng,
                            e.lngLat.lat
                        ]
                    },
                    properties: {
                        id: 'PointID-' + new Date().getTime(),
                        color: "#" + randomColor() + randomColor() + randomColor(),
                        temp: yield getTemperature(e)
                    }
                };
                geojson_1.Points.geojson.features.push(point);
                map.addSource(point.properties.id, {
                    type: "geojson",
                    data: point
                });
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
                mapservice_1.MapService.updateLayerArrays();
                mapservice_1.MapService.newListElement(point.properties.id, point.geometry.coordinates[0], point.geometry.coordinates[1]);
                mapservice_1.MapService.buildColorPicker(point, point.properties.color, geojson_1.Points.geojson);
            }
            mapservice_1.MapService.writePoints(geojson_1.Points.geojson);
        });
    }
    map.on('click', function (e) {
        pointManager(e);
    });
});
