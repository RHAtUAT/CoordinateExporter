"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const internetservice_1 = require("./internetservice");
const mapbox_gl_1 = __importDefault(require("mapbox-gl"));
mapbox_gl_1.default.accessToken = 'pk.eyJ1Ijoic2lzdGFqc29kdG5vZmFzZGYiLCJhIjoiY2swZDQzb3gwMDJ2bzNjcXg0Yms3ajkxciJ9.IlQsvqC_5gRUyyjPLjAj0g';
internetservice_1.InternetService.CheckConnection().then(() => {
    global.map = new mapbox_gl_1.default.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-111.97588, 33.37751],
        zoom: 9
    });
}).catch(() => {
    console.log('No internet,');
});
