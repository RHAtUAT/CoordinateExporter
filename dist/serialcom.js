"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
//import * as serialport from 'serialport'
const coords = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
const COM_PORT = "COM4";
var arduinoSerialPort = new serialport_1.default(COM_PORT, { baudRate: 9600 });
var parser = arduinoSerialPort.pipe(new serialport_1.default.parsers.Readline({ delimiter: '\n' }));
arduinoSerialPort.on('open', function () {
    console.log("Arduino Connected on " + COM_PORT);
});
coords.forEach(element => {
    arduinoSerialPort.write(element + " ");
});
parser.on('data', (data) => {
    console.log(data);
});
