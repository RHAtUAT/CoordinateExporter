import { App } from './';
import { Map } from './map';
import $ from 'jquery';

const mapTypesList = $('#map-types');
const mapTypeInputs = mapTypesList.find('input');

export class MapOptions {

	private _map: Map;

	public constructor(map: Map) {
		this._map = map;

		// Listen for change of style
		mapTypeInputs.on('change', () => this._updateMapType());

		// Set the current style
		const style = App.settings.get('style', 'streets-v11');
		mapTypesList.find('#' + style).prop('checked', true);
	}

	private async _updateMapType() {
		const selectedType = mapTypesList.find('input:checked');

		console.log('Changing style to', selectedType.val());
		this._map.clearAllPoints();
		this._map.instance.setStyle('mapbox://styles/mapbox/' + selectedType.attr('id'));
		App.settings.set('style', selectedType.attr('id'));

		console.log('Waiting for map to reload...');
		await this._map.waitUntilLoaded();

		console.log('Redrawing points...');
		await new Promise(r => setTimeout(r, 1000));
		this._map.renderAllPoints();
	}

}
