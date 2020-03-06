import { App } from './';
import { PointManager, Point } from './points';
import { MapRenderer } from './map.renderer';
import { MapOptions } from './map.options';
import { Temperature } from './temperature';
import mapboxgl from 'mapbox-gl';

// Set the access token
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lzdGFqc29kdG5vZmFzZGYiLCJhIjoiY2swZDQzb3gwMDJ2bzNjcXg0Yms3ajkxciJ9.IlQsvqC_5gRUyyjPLjAj0g';

export class Map {

	private _map?: mapboxgl.Map;
	private _points: PointManager;
	private _renderer: MapRenderer;
	private _options: MapOptions;

	public autoAddPoints = false;

	public constructor() {
		this._points = new PointManager(this);
		this._renderer = new MapRenderer(this);
		this._options = new MapOptions(this);
	}

	/**
	 * Starts the map.
	 */
	public async start() {
		console.log('Starting the map...');

		// Load the style from database
		const style = App.settings.get('style', 'streets-v11');

		// Create the map instance
		this._map = new mapboxgl.Map({
			container: 'map',								// Container id
			style: 'mapbox://styles/mapbox/' + style,		// Theme
			center: [-111.97588, 33.37751], 				// Initial position
			zoom: 9 										// Initial zoom
		});

		// Wait for the map to load
		await new Promise(r => this._map!.on('load', r));
		this.autoAddPoints = true;

		// Load the points
		await this._points.start();

		// Listen for rendering events
		this._listen();

		// Initial rendering of all points
		this.renderAllPoints();
	}

	/**
	 * Returns the map renderer instance.
	 */
	public get renderer() {
		return this._renderer;
	}

	/**
	 * Returns the point manager for this map instance.
	 */
	public get pointManager() {
		return this._points;
	}

	/**
	 * Registers and draws all points on the map.
	 */
	public renderAllPoints() {
		this.autoAddPoints = true;
		for (const point of this._points.getPoints()) {
			this.renderer.renderPoint(point);
		}
	}

	/**
	 * Clears all points on the map.
	 */
	public clearAllPoints() {
		this.autoAddPoints = false;
		for (const point of this._points.getPoints()) {
			this.renderer.clearPoint(point);
		}
	}

	/**
	 * Listens to events from the point manager and map instance.
	 */
	private _listen() {
		this._points.on('add', point => this.renderer.renderPoint(point));
		this._points.on('edit', point => this.renderer.renderPoint(point));
		this._points.on('remove', point => this.renderer.clearPoint(point));

		this.instance.on('click', e => this._onMapClick(e));
		this.instance.on('mousemove', e => {
			App.sidebar.updateCoordinates(e.lngLat.lat, e.lngLat.lng);
		});
	}

	/**
	 * Handles the click event on the map.
	 */
	private _onMapClick(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
		const { lat, lng } = e.lngLat;
        const features = this.instance.queryRenderedFeatures(e.point, { layers: this.renderer.layers });

		// If a point was clicked, remove it from the map
		if (features.length > 0) {
			const id = features[0].properties!.id;
			const clicked = this.pointManager.getPoint(id);

			if (clicked) {
				this.pointManager.removePoint(clicked);
				this.pointManager.savePoints();
			}

			return;
		}

		// Create a new point at the current position
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

		// Save immediately
		this.pointManager.savePoints();

		// Fetch the temperature
		Temperature.fetch(point);
	}

	/**
	 * Returns the MapBoxGl instance for this map.
	 */
	public get instance() {
		return this._map!;
	}

	/**
	 * Returns a random hexadecimal color with # prefixed.
	 */
	private _getRandomColor() {
		const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
		const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
		const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

		return '#' + r + g + b;
	}

	/**
	 * Returns a promise which resolves only after the map is loaded.
	 */
	public async waitUntilLoaded() {
		if (!this.instance.loaded()) {
			await new Promise(r => setTimeout(r, 10));
			await this.waitUntilLoaded();
		}
	}

}
