import { Menu, MenuItemConstructorOptions, app, BrowserWindow } from 'electron';
import { Toolbar } from './toolbar';
import url from 'url';
import path from 'path';

export class Program {

	private static _window: BrowserWindow;

	public static async start() {
		await this._waitForReady();
		await this._createWindow();
		await this._loadWindow();

		this._createToolbar();
		this._window.show();

		// Un-comment the below line to automatically open developer tools
		 this._window.webContents.openDevTools();
	}

	private static _waitForReady() {
		return new Promise(resolve => {
			app.on('ready', resolve);
		});
	}

	private static async _createWindow() {
		this._window = new BrowserWindow({
			show: false,
			width: 1200,
			height: 800,
			webPreferences: {
				nodeIntegration: true
			}
		});
	}

	private static _loadWindow() {
		return new Promise(resolve => {
			this._window.loadURL(url.format({
				pathname: 'resources/html/index.html',
				protocol: 'file:',
				slashes: true
			}));

			this._window.on('ready-to-show', resolve);
		});
	}

	private static _createToolbar() {
		Menu.setApplicationMenu(Menu.buildFromTemplate(Toolbar));
	}

}

Program.start().catch(console.error);

