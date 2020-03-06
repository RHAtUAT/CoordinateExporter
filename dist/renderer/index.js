"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("./map");
const sidebar_1 = require("./sidebar");
const settings_1 = require("./settings");
const jquery_1 = __importDefault(require("jquery"));
class App {
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._settings = new settings_1.Settings('settings.json');
            this._map = new map_1.Map();
            this._sidebar = new sidebar_1.Sidebar();
            yield this._waitForConnection();
            this._setLoadingText('Loading map...');
            yield this._map.start();
            this._hideLoadingScreen();
        });
    }
    static get map() {
        return this._map;
    }
    static get sidebar() {
        return this._sidebar;
    }
    static get settings() {
        return this._settings;
    }
    static _hideLoadingScreen() {
        jquery_1.default('.connection-check').fadeOut(500, 'linear');
    }
    static _setLoadingText(text) {
        jquery_1.default('.connection-check p').text(text);
    }
    static _waitForConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Waiting for an internet connection...');
            if (!(yield this._isConnected())) {
                yield new Promise(r => setTimeout(r, 1000));
                yield this._waitForConnection();
            }
        });
    }
    static _isConnected() {
        return new Promise(resolve => {
            require('dns').resolve('google.com', (err) => resolve(!err));
        });
    }
}
exports.App = App;
