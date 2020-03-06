"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
class MapRenderer {
    constructor(map) {
        this._layers = [];
        this._map = map;
    }
    get layers() {
        return this._layers;
    }
    renderPoint(point) {
        if (point.properties.id && this._map.autoAddPoints) {
            const id = point.properties.id;
            this._map.instance.addSource(id, {
                type: 'geojson',
                data: point
            });
            _1.App.sidebar.addPoint(point);
            this._map.instance.addLayer({
                id: id,
                type: 'circle',
                source: id,
                paint: {
                    'circle-radius': 7,
                    'circle-color': ['get', 'color']
                },
                filter: ['in', '$type', 'Point']
            });
            this._updateLayers();
        }
    }
    clearPoint(point) {
        _1.App.sidebar.removePoint(point);
        this._map.instance.removeLayer(point.properties.id);
        this._map.instance.removeSource(point.properties.id);
        this._updateLayers();
    }
    _updateLayers() {
        const layers = this._map.instance.getStyle().layers.filter(layers => layers.id.includes('PointID-'));
        this._layers = layers.map(layer => layer.id);
    }
}
exports.MapRenderer = MapRenderer;
