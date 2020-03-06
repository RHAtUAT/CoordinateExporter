"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Settings {
    constructor(filePath) {
        this._filePath = filePath;
        this._load();
    }
    _load() {
        if (!fs_1.default.existsSync(this._filePath)) {
            this._data = {};
            return;
        }
        const contents = fs_1.default.readFileSync(this._filePath).toString();
        if (!contents.trim().length) {
            this._data = {};
            return;
        }
        this._data = JSON.parse(contents);
    }
    has(key) {
        if (!this._data) {
            throw new Error('Attempt to find value from unloaded settings object');
        }
        return key in this._data;
    }
    get(key, defaultValue) {
        if (!this._data) {
            throw new Error('Attempt to get value from unloaded settings object');
        }
        return this._data[key] || defaultValue;
    }
    set(key, value) {
        if (!this._data) {
            throw new Error('Attempt to set value on unloaded settings object');
        }
        this._data[key] = value;
        this._save();
    }
    _save() {
        fs_1.default.writeFileSync(this._filePath, JSON.stringify(this._data, null, 4));
    }
}
exports.Settings = Settings;
