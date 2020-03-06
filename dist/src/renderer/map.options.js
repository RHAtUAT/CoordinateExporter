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
const _1 = require("./");
const jquery_1 = __importDefault(require("jquery"));
const mapTypesList = jquery_1.default('#map-types');
const mapTypeInputs = mapTypesList.find('input');
class MapOptions {
    constructor(map) {
        this._map = map;
        mapTypeInputs.on('change', () => this._updateMapType());
        const style = _1.App.settings.get('style', 'streets-v11');
        mapTypesList.find('#' + style).prop('checked', true);
    }
    _updateMapType() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedType = mapTypesList.find('input:checked');
            console.log('Changing style to', selectedType.val());
            this._map.clearAllPoints();
            this._map.instance.setStyle('mapbox://styles/mapbox/' + selectedType.attr('id'));
            _1.App.settings.set('style', selectedType.attr('id'));
            console.log('Waiting for map to reload...');
            yield this._map.waitUntilLoaded();
            console.log('Redrawing points...');
            yield new Promise(r => setTimeout(r, 1000));
            this._map.renderAllPoints();
        });
    }
}
exports.MapOptions = MapOptions;
