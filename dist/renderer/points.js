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
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PointManager extends events_1.EventEmitter {
    constructor(map) {
        super();
        this._points = [];
        this._map = map;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._points = yield this._loadPoints();
            console.log('Loaded %d points.', this._points.length);
        });
    }
    getPoints() {
        return this._points;
    }
    addPoint(point) {
        if (!point.properties) {
            point.properties = {};
        }
        this._points.push(point);
        this.emit('add', point);
        return point;
    }
    removePoint(point) {
        this._points = this._points.filter(p => p !== point);
        this.emit('remove', point);
    }
    editPoint(point) {
        this.emit('edit', point);
    }
    getPoint(id) {
        for (const point of this._points) {
            if (point.properties.id === id) {
                return point;
            }
        }
    }
    savePoints() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                const contents = JSON.stringify(this._points, null, '\t');
                fs_1.default.writeFile(this._getSavePath(), contents, err => err ? reject(err) : resolve());
            });
            this.emit('save');
        });
    }
    _loadPoints() {
        return new Promise((resolve, reject) => {
            fs_1.default.stat(this._getSavePath(), err => {
                if (err) {
                    console.error('Failed to access the points data file:', err);
                    return resolve([]);
                }
                fs_1.default.readFile(this._getSavePath(), (err, data) => {
                    if (err) {
                        console.error('Failed to read the points data file:', err);
                        return reject(err);
                    }
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
    _getSavePath() {
        const fileName = 'point-data.json';
        return path_1.default.join(process.cwd(), fileName);
    }
    on(event, fn) {
        return super.on(event, fn);
    }
}
exports.PointManager = PointManager;
