import { App } from './';
import { Map } from './map';
import { Point } from './points';
import { Layer } from 'mapbox-gl';

export class MapRenderer {

	private _map: Map;
	private _layers: string[] = [];

	public constructor(map: Map) {
		this._map = map;
	}

	/**
	 * An array containing the ID of all layers on the map.
	 */
	public get layers() {
		return this._layers;
	}

	/**
	 * Renders a point on the screen, replacing an old version if necessary.
	 */
	public renderPoint(point: Point) {
		if (point.properties.id && this._map.autoAddPoints) {
			const id = point.properties.id;

			// Add the point as a source
			this._map.instance.addSource(id, {
				type: 'geojson',
				data: point
			});

			// Add point to the sidebar
			App.sidebar.addPoint(point);

			// Add the point to the map as its own layer
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

			// Update data
			this._updateLayers();
		}
	}

	/**
	 * Removes a point from the screen.
	 */
	public clearPoint(point: Point) {
		// Remove the list element
		App.sidebar.removePoint(point);

		// Remove from the map
		this._map.instance.removeLayer(point.properties.id!);
		this._map.instance.removeSource(point.properties.id!);

		// Update data
		this._updateLayers();
	}

	/**
	 * Updates the array of layer ids from the current map style.
	 */
	private _updateLayers() {
        const layers = this._map.instance.getStyle().layers!.filter(layers => layers.id.includes('PointID-'));
		this._layers = layers.map(layer => layer.id);
	}

}
