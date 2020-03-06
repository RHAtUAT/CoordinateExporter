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
const _1 = require("./");
const https_1 = __importDefault(require("https"));
class Temperature {
    static fetch(point) {
        this._getTemperature(point).then(temperature => {
            point.properties.temp = temperature;
            _1.App.map.pointManager.savePoints();
            console.log('Updated temperature to %s for (%s, %s).', temperature, point.geometry.coordinates[1], point.geometry.coordinates[0]);
        }, function (error) {
            console.error('Failed to fetch temperature data:', error);
        });
    }
    static _getTemperature(point) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let lat = point.geometry.coordinates[1];
            let lon = point.geometry.coordinates[0];
            let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=6a267a38043e6b6bcd7d776c5733c62d';
            https_1.default.get(url, (res) => {
                let data = '';
                res.on('data', (d) => {
                    data += d;
                });
                res.on('end', () => {
                    const temp = Math.floor((1.8 * (JSON.parse(data).main.temp - 273) + 32)).toString();
                    return resolve(temp);
                });
            }).on('error', e => {
                return reject(e);
            });
        }));
    }
}
exports.Temperature = Temperature;
