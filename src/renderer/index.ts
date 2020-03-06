import { Map } from './map';
import { Sidebar } from './sidebar';
import { Settings } from './settings';
import $ from 'jquery';

export class App {

	private static _map: Map;
	private static _sidebar: Sidebar;
	private static _settings: Settings<AppSettings>;

	/**
	 * Starts the app.
	 */
	public static async start() {
		this._settings = new Settings('settings.json');
		this._map = new Map();
		this._sidebar = new Sidebar();

		// Wait for a connection
		await this._waitForConnection();

		this._setLoadingText('Loading map...');
		await this._map.start();

		this._hideLoadingScreen();
	}

	/**
	 * Returns the current map instance.
	 */
	public static get map() {
		return this._map;
	}

	/**
	 * Returns the current sidebar instance.
	 */
	public static get sidebar() {
		return this._sidebar;
	}

	/**
	 * Returns the current settings instance.
	 */
	public static get settings() {
		return this._settings;
	}

	/**
	 * Fades the loading screen out.
	 */
	private static _hideLoadingScreen() {
		$('.connection-check').fadeOut(500, 'linear');
	}

	/**
	 * Changes the text of the loading screen.
	 */
	private static _setLoadingText(text: string) {
		$('.connection-check p').text(text);
	}

	/**
	 * Waits for an internet connection.
	 */
	private static async _waitForConnection() {
		console.log('Waiting for an internet connection...');

		if (!await this._isConnected()) {
			await new Promise(r => setTimeout(r, 1000));
			await this._waitForConnection();
		}
	}

	/**
	 * Checks if the user is connected to internet by looking up google.com's DNS record.
	 */
    private static _isConnected(): Promise<boolean> {
        return new Promise(resolve => {
            require('dns').resolve('google.com', (err: any) => resolve(!err));
        });
    }

}

interface AppSettings {
	style: string;
}
