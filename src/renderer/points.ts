import { Feature } from 'geojson';
import { Map } from './map';
import { EventEmitter } from 'events';

import fs from 'fs';
import path from 'path';

export class PointManager extends EventEmitter {

	private _map: Map;
	private _points: Point[] = [];

	public constructor(map: Map) {
		super();
		this._map = map;
	}

	/**
	 * Starts the point manager and loads saved points.
	 */
	public async start() {
		this._points = await this._loadPoints();

		console.log('Loaded %d points.', this._points.length);
	}

	/**
	 * Returns all points on the map.
	 */
	public getPoints() {
		return this._points;
	}

	/**
	 * Adds a point.
	 */
	public addPoint(point: Point) {
		if (!point.properties) {
			point.properties = {};
		}

		this._points.push(point);
		this.emit('add', point);

		return point;
	}

	/**
	 * Removes a point.
	 */
	public removePoint(point: Point) {
		// Remove the point
		this._points = this._points.filter(p => p !== point);

		// Emit a remove event with the point for rendering
		this.emit('remove', point);
	}

	/**
	 * Applies edits to the point.
	 */
	public editPoint(point: Point) {
		this.emit('edit', point);
	}

	/**
	 * Finds and returns the point matching the specified id, or `undefined` if not found.
	 */
	public getPoint(id: string) {
		for (const point of this._points) {
			if (point.properties.id === id) {
				return point;
			}
		}
	}

	/**
	 * Writes all points to the save file.
	 */
	public async savePoints() {
		await new Promise((resolve, reject) => {
			const contents = JSON.stringify(this._points, null, '\t');
			fs.writeFile(this._getSavePath(), contents, err => err ? reject(err) : resolve());
		});

		this.emit('save');
	}

	/**
	 * Loads points from the data file.
	 */
	private _loadPoints(): Promise<Point[]> {
		return new Promise((resolve, reject) => {
			// Make sure the file exists (stat will throw an error if it doesn't)
			fs.stat(this._getSavePath(), err => {
				if (err) {
					console.error('Failed to access the points data file:', err);
					return resolve([]);
				}

				// Read the file asynchronously
				fs.readFile(this._getSavePath(), (err, data) => {
					if (err) {
						console.error('Failed to read the points data file:', err);
						return reject(err);
					}

					// Try to parse (json will throw an error if it's invalid)
					try {
						const parsed = JSON.parse(data.toString());
						Array.isArray(parsed) ? resolve(parsed) : [];
					}
					catch (err) {
						console.error('Failed to parse the points data file:', err);
						resolve([]);
					}
				});
			});
		});
	}

	/**
	 * Returns the absolute path to the save file.
	 */
	private _getSavePath() {
		const fileName = 'point-data.json';
		return path.join(process.cwd(), fileName);
	}

	public on(event: 'add', fn: (point: Point) => void): this;
	public on(event: 'remove', fn: (point: Point) => void): this;
	public on(event: 'edit', fn: (point: Point) => void): this;
	public on(event: string, fn: (...args: any[]) => void): this;
	public on(event: string, fn: (...args: any[]) => void) {
		return super.on(event, fn);
	}

}

export type Point = Feature & {
	geometry: {
		// gee, i'm a tree
		coordinates: number[]
	},
	properties: {
		id?: string;
		color?: string;
		temp?: string | number;
	};
};
