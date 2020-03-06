import fs from 'fs';

export class Settings<T extends Object> {

	private _filePath: string;
	private _data?: T;

	public constructor(filePath: string) {
		this._filePath = filePath;
		this._load();
	}

	private _load() {
		// If the file doesn't exist, use a default object
		if (!fs.existsSync(this._filePath)) {
			this._data = {} as T;
			return;
		}

		// Read the file contents as a string
		const contents = fs.readFileSync(this._filePath).toString();

		// If the contents are blank, use a default object
		if (!contents.trim().length) {
			this._data = {} as T;
			return;
		}

		// Try to parse JSON
		this._data = JSON.parse(contents);
	}

	/**
	 * Returns `true` if the specified setting exists.
	 */
	public has<K extends keyof T>(key: K) : boolean {
		if (!this._data) {
			throw new Error('Attempt to find value from unloaded settings object');
		}

		return key in this._data;
	}

	/**
	 * Returns the value of the specified setting.
	 */
	public get<K extends keyof T>(key: K, defaultValue ?: T[K]) : T[K] | undefined {
		if (!this._data) {
			throw new Error('Attempt to get value from unloaded settings object');
		}

		return this._data[key] || defaultValue;
	}

	/**
	 * Returns the value of the specified setting.
	 */
	public set<K extends keyof T>(key: K, value?: T[K]) {
		if (!this._data) {
			throw new Error('Attempt to set value on unloaded settings object');
		}

		this._data[key] = value as T[K];
		this._save();
	}

	/**
	 * Writes to the save file.
	 */
	private _save() {
		fs.writeFileSync(this._filePath, JSON.stringify(this._data, null, 4));
	}

}
