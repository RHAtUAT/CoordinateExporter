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
const points_1 = require("./points");
const map_renderer_1 = require("./map.renderer");
const map_options_1 = require("./map.options");
const temperature_1 = require("./temperature");
const mapbox_gl_1 = __importDefault(require("mapbox-gl"));
mapbox_gl_1.default.accessToken = 'pk.eyJ1Ijoic2lzdGFqc29kdG5vZmFzZGYiLCJhIjoiY2swZDQzb3gwMDJ2bzNjcXg0Yms3ajkxciJ9.IlQsvqC_5gRUyyjPLjAj0g';
class Map {
    constructor() {
        this.autoAddPoints = false;
        this._points = new points_1.PointManager(this);
        this._renderer = new map_renderer_1.MapRenderer(this);
        this._options = new map_options_1.MapOptions(this);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting the map...');
            const style = _1.App.settings.get('style', 'streets-v11');
            this._map = new mapbox_gl_1.default.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/' + style,
                center: [-111.97588, 33.37751],
                zoom: 9
            });
            yield new Promise(r => this._map.on('load', r));
            this.autoAddPoints = true;
            yield this._points.start();
            this._listen();
            this.renderAllPoints();
        });
    }
    get renderer() {
        return this._renderer;
    }
    get pointManager() {
        return this._points;
    }
    renderAllPoints() {
        this.autoAddPoints = true;
        for (const point of this._points.getPoints()) {
            this.renderer.renderPoint(point);
        }
    }
    clearAllPoints() {
        this.autoAddPoints = false;
        for (const point of this._points.getPoints()) {
            this.renderer.clearPoint(point);
        }
    }
    _listen() {
        this._points.on('add', point => this.renderer.renderPoint(point));
        this._points.on('edit', point => this.renderer.renderPoint(point));
        this._points.on('remove', point => this.renderer.clearPoint(point));
        this.instance.on('click', e => this._onMapClick(e));
        this.instance.on('mousemove', e => {
            _1.App.sidebar.updateCoordinates(e.lngLat.lat, e.lngLat.lng);
        });
    }
    _onMapClick(e) {
        const { lat, lng } = e.lngLat;
        const features = this.instance.queryRenderedFeatures(e.point, { layers: this.renderer.layers });
        if (features.length > 0) {
            const id = features[0].properties.id;
            const clicked = this.pointManager.getPoint(id);
            if (clicked) {
                this.pointManager.removePoint(clicked);
                this.pointManager.savePoints();
            }
            return;
        }
        const point = this.pointManager.addPoint({
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
                color: this._getRandomColor(),
                temp: 0
            }
        });
        this.pointManager.savePoints();
        temperature_1.Temperature.fetch(point);
    }
    get instance() {
        return this._map;
    }
    _getRandomColor() {
        const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return '#' + r + g + b;
    }
    waitUntilLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance.loaded()) {
                yield new Promise(r => setTimeout(r, 10));
                yield this.waitUntilLoaded();
            }
        });
    }
}
exports.Map = Map;
