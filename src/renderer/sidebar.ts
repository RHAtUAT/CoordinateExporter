import { App } from './';
import { Point } from './points';
import { SerialCom } from './serialcom';
import Pickr from '@simonwep/pickr';
import $ from 'jquery';

export const Templates = {
	sidebarPointItem: $('#sidebarPointItem').contents()
};

const sidebarButton = $('#side-nav-btn');
const optionsSidebarButton = $('#options-btn');
const pointsSidebarButton = $('#points');

const coordinateSwitch = $('#coordinate-switch');
const coordinateText = $('#coordinates');

const pointListElement = $('#point-list');
const initialTextElement = $('#initialText');

export class Sidebar {

	private _pointListItems: { [id: string]: JQuery<any> } = {};

	public constructor() {
		sidebarButton.on('click', () => this._toggleSidebar());
		optionsSidebarButton.on('click', () => this._toggleMenuDropDown('options-tab'));
		pointsSidebarButton.on('click', () => this._toggleMenuDropDown('points-tab'));

		coordinateSwitch.on('click', () => this._toggleCoordinates());
	}

	/**
	 * Updates the coordinates on the screen overlay.
	 */
	public updateCoordinates(lat: number, long: number) {
		coordinateText.html(`Latitude: ${lat.toFixed(4)}<br>Longitude: ${long.toFixed(4)}`);
	}

	/**
	 * Adds the given point to the sidebar.
	 */
	public addPoint(point: Point) {
		const id = point.properties.id!;
		const li = Templates.sidebarPointItem.clone();
		const [long, lat] = point.geometry.coordinates;

		// Updates coordinates
		li.find('.list-item').text(`(${lat.toFixed(4)}, ${long.toFixed(4)})`);

		// Bind to click events
		li.find('.export').on('click', e => this._onExportClick(e, point));
		li.find('.delete').on('click', e => this._onDeleteClick(e, point));
		li.find('.flyImage').on('click', e => this._onFlyToClick(e, point));

		// Hide the initial text
		initialTextElement.hide();

		// Add to the unordered list
		li.appendTo(pointListElement);

		// Initialize the color picker
		this._initColorPicker(li, point);

		// Save the list item
		this._pointListItems[id] = li;
	}

	/**
	 * Handles clicks of the "export" button.
	 */
	private _onExportClick(e: JQuery.ClickEvent<any>, point: Point) {
		const [ longitude, latitude ] = point.geometry.coordinates; // incorrect order
        SerialCom.writeToArduino(longitude, latitude);
	}

	/**
	 * Handles clicks of the "delete" button.
	 */
	private _onDeleteClick(e: JQuery.ClickEvent<any>, point: Point) {
		App.map.pointManager.removePoint(point);
		App.map.pointManager.savePoints();
	}

	/**
	 * Handles clicks of the "fly to" button.
	 */
	private _onFlyToClick(e: JQuery.ClickEvent<any>, point: Point) {
		const [ latitude, longitude ] = point.geometry.coordinates;

		App.map.instance.flyTo({
			center: [ latitude, longitude ]
		});
	}

	/**
	 * Removes the given point from the sidebar.
	 */
	public removePoint(point: Point) {
		const id = point.properties.id!;

		if (id in this._pointListItems) {
			this._pointListItems[id].remove();

			delete this._pointListItems[id];
		}
	}

	private _initColorPicker(li: JQuery<any>, point: Point) {
		const color = point.properties!.color!;
		const id = point.properties!.id!;

		const pickr = Pickr.create({
			// Color picker options
			el: li.find('.color-picker')[0],
			theme: 'nano',
			lockOpacity: true,
			closeOnScroll: false,
			default: color,
			swatches: [
				'rgb(244, 67, 54)',
				'rgb(233, 30, 99)',
				'rgb(156, 39, 176)',
				'rgb(103, 58, 183)',
				'rgb(63, 81, 181)',
				'rgb(33, 150, 243)',
				'rgb(3, 169, 244)',
				'rgb(0, 188, 212)',
				'rgb(0, 150, 136)',
				'rgb(76, 175, 80)',
				'rgb(139, 195, 74)',
				'rgb(205, 220, 57)',
				'rgb(255, 235, 59)',
				'rgb(255, 193, 7)'
			],
			components: {
				// Main components
				preview: true,
				opacity: true,
				hue: true,

				// Input / output Options
				interaction: {
					hex: true,
					rgba: false,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: true,
					clear: false,
					save: true
				}
			}
		});

		pickr.on('change', () => {
			// Get the color from the color picker
			let color = '#' + pickr.getColor().toHEXA().join('');
			// Set the circle-color of the layer on the map
			App.map.instance.setPaintProperty(id, 'circle-color', color);
		});

		pickr.on('save', () => {
			// Get the color from the color picker
			let pickedColor = '#' + pickr.getColor().toHEXA().join('');
			// Save the new color to the JSON file
			point.properties.color = pickedColor;
			App.map.pointManager.savePoints();
		});

		pickr.on('hide', () => {
			// Set the circle-color of the layer on the map
			App.map.instance.setPaintProperty(id, 'circle-color', point.properties.color);
		});
	}

	private _toggleSidebar() {
		if (document.getElementById('sideNav')!.style.width == '30%' &&
			document.getElementById('side-nav-btn')!.style.marginLeft == '30%') {
			document.getElementById('sideNav')!.style.width = '0';
			document.getElementById('side-nav-btn')!.style.marginLeft = '0';
			document.getElementById('coordinates')!.style.marginLeft = '0';
			document.getElementById('info-label')!.style.width = '0';
		}
		else {
			document.getElementById('sideNav')!.style.width = '30%';
			document.getElementById('side-nav-btn')!.style.marginLeft = '30%';
			document.getElementById('coordinates')!.style.marginLeft = '30%';
			document.getElementById('info-label')!.style.width = '30%';
		}
	}

	private _toggleMenuDropDown(id: string) {
		if (document.getElementById(id)!.style.display == 'none' || document.getElementById(id)!.style.display == '') {
			document.getElementById(id)!.style.display = 'block';

			if (id == "options-tab") {
				document.getElementById("options-btn")!.style.backgroundColor = "#000";
				document.getElementById("options-btn")!.style.color = "white";
			}
			else if (id == "points-tab") {
				document.getElementById("points")!.style.backgroundColor = "#000";
				document.getElementById("points")!.style.color = "white";
			}
		}
		else {
			document.getElementById(id)!.style.display = 'none';

			if (id == "options-tab") {
				document.getElementById("options-btn")!.style.backgroundColor = "#303030";
				document.getElementById("options-btn")!.style.color = "#818181";
			}
			else if (id == "points-tab") {
				document.getElementById("points")!.style.backgroundColor = "#303030";
				document.getElementById("points")!.style.color = "#818181";
			}
		}
	}

	private _toggleCoordinates() {
		let input = <HTMLInputElement>document.getElementById('coordinate-switch');
		if (input.checked == true) document.getElementById('coordinates')!.style.display = 'block';
		else document.getElementById('coordinates')!.style.display = 'none';
	}

}
