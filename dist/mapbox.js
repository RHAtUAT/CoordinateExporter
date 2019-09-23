"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="globals.d.ts" />
const mapservice_1 = require("./mapservice");
const featureCollection_1 = require("./featureCollection");
const mapbox_gl_1 = __importDefault(require("mapbox-gl"));
mapbox_gl_1.default.accessToken = 'pk.eyJ1Ijoic2lzdGFqc29kdG5vZmFzZGYiLCJhIjoiY2swZDQzb3gwMDJ2bzNjcXg0Yms3ajkxciJ9.IlQsvqC_5gRUyyjPLjAj0g';
global.map = new mapbox_gl_1.default.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-111.97588, 33.37751],
    zoom: 9 // starting zoom
});
class MapBox {
    constructor(mapService) {
        this.mapService = mapService;
        this.style = 'mapbox://styles/mapbox/outdoors-v9';
        this.lng = -111.97588;
        this.lat = 33.37751;
        this.message = 'Hello World!';
    }
    OnInit() {
        //this.points = this.mapService.getPoints()
        this.initializeMap();
    }
    initializeMap() {
        /// locate the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.map.flyTo({
                    center: [this.lng, this.lat]
                });
            });
        }
        this.buildMap();
    }
    buildMap() {
        this.map = map;
        /// Add map controls
        this.map.addControl(new mapbox_gl_1.default.NavigationControl());
        //// Add Point on Click
        this.map.on('click', (event) => {
            const coordinates = [event.lngLat.lng, event.lngLat.lat];
            const newPoint = new featureCollection_1.GeoJson(coordinates, { message: this.message });
            //this.mapService.createPoint(newPoint)
        });
        /// Add realtime firebase data on map load
        this.map.on('load', (event) => {
            console.log('MapBox');
            //this.ngOnInit();
            /// register source
            this.map.addSource('point', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });
            /// get source
            this.source = this.map.getSource('point');
            /// subscribe to realtime database and set data source
            //var subscribe = new Promise(function(resolve, reject){
            //let data = new FeatureCollection(points)
            //  resolve(data)
            //})
            //this.points.subscribe(points => {
            let data = new featureCollection_1.FeatureCollection(this.points);
            this.source.setData(data);
            //})
            /// create map layers with realtime data
            this.map.addLayer({
                id: 'point',
                source: 'point',
                type: 'symbol',
                layout: {
                    'text-field': '{message}',
                    'text-size': 24,
                    'text-transform': 'uppercase',
                    'icon-image': 'rocket-15',
                    'text-offset': [0, 1.5]
                },
                paint: {
                    'text-color': '#f16624',
                    'text-halo-color': '#fff',
                    'text-halo-width': 2
                }
            });
        });
    }
    /// Helpers
    removeMarker(point) {
        // this.mapService.removePoint(point.$key)
    }
    flyTo(data) {
        this.map.flyTo({
            center: data.geometry.coordinates
        });
    }
}
exports.MapBox = MapBox;
var mapbox = new MapBox(new mapservice_1.MapService());
//mapbox.OnInit();
//mapbox.
