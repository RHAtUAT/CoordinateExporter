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
const electron_1 = require("electron");
const toolbar_1 = require("./toolbar");
const url_1 = __importDefault(require("url"));
class Program {
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._waitForReady();
            yield this._createWindow();
            yield this._loadWindow();
            this._createToolbar();
            this._window.show();
            this._window.webContents.openDevTools();
        });
    }
    static _waitForReady() {
        return new Promise(resolve => {
            electron_1.app.on('ready', resolve);
        });
    }
    static _createWindow() {
        return __awaiter(this, void 0, void 0, function* () {
            this._window = new electron_1.BrowserWindow({
                show: false,
                width: 1200,
                height: 800,
                webPreferences: {
                    nodeIntegration: true
                }
            });
        });
    }
    static _loadWindow() {
        return new Promise(resolve => {
            this._window.loadURL(url_1.default.format({
                pathname: 'resources/html/index.html',
                protocol: 'file:',
                slashes: true
            }));
            this._window.on('ready-to-show', resolve);
        });
    }
    static _createToolbar() {
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(toolbar_1.Toolbar));
    }
}
exports.Program = Program;
Program.start().catch(console.error);
