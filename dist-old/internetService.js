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
const jquery_1 = __importDefault(require("jquery"));
const fadeOutTime = 1000;
class InternetService {
    static isConnected() {
        return new Promise(resolve => {
            require('dns').resolve('google.com', (err) => resolve(!err));
        });
    }
    static CheckConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            InternetService.isConnectedTointernet = yield InternetService.isConnected();
            console.log("PingCheck: " + InternetService.isConnectedTointernet);
            if (InternetService.isConnectedTointernet) {
                jquery_1.default('.connection-check').fadeOut(fadeOutTime);
            }
            else {
                yield new Promise(r => setTimeout(r, 1000));
                yield InternetService.CheckConnection();
            }
        });
    }
}
exports.InternetService = InternetService;
InternetService.isConnectedTointernet = false;
jquery_1.default(InternetService.CheckConnection);
