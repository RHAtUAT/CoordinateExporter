"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const electron_1 = require("electron");
const { dialog } = electron_1.remote;
class SerialCom {
    static getConnectedArduino() {
        setInterval(() => {
            if (SerialCom.arduinoPort != null)
                return;
            console.log('Searching for arduino...');
            let comPorts;
            serialport_1.default.list().then(portArray => {
                comPorts = portArray;
                comPorts.forEach((port) => {
                    if (port.manufacturer.includes('arduino')) {
                        SerialCom.arduinoPort = port.path;
                        SerialCom.openPort(SerialCom.arduinoPort);
                    }
                });
            }).catch(console.error);
        }, 1000);
    }
    static openPort(COM_PORT) {
        if (COM_PORT != null)
            console.log("Arduino Found on Port: " + COM_PORT);
        console.log(`Opening Connection on Port...`);
        SerialCom.arduinoSerialPort = new serialport_1.default(COM_PORT, { baudRate: 9600 });
        let parser = SerialCom.arduinoSerialPort.pipe(new serialport_1.default.parsers.Readline({ delimiter: '\n' }));
        SerialCom.arduinoSerialPort.open(function () {
            console.log('Connection Open and Waiting...');
        });
        SerialCom.arduinoSerialPort.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        parser.on('data', (data) => {
            if (data) {
                console.log("parsing data:", data);
            }
            console.log("bytes received");
        });
        SerialCom.arduinoSerialPort.on('open', () => {
            this.connected = true;
            document.getElementById('arduino-info').innerText = `Arduino Connected on Port: ${COM_PORT}`;
            console.log('Connected');
        });
        SerialCom.arduinoSerialPort.on('close', (err) => {
            if (err.disconnected === true) {
                this.connected = false;
                document.getElementById('arduino-info').innerText = `Arduino Disconnected`;
                console.log("Disconnected");
                console.log('Searching for arduino...');
                setInterval(() => {
                    if (SerialCom.arduinoSerialPort.isOpen)
                        return;
                    SerialCom.arduinoSerialPort.open();
                }, 1000);
            }
        });
    }
    static writeToArduino(longitude, latitude) {
        let coords = [longitude.toFixed(20), latitude.toFixed(20)];
        console.log('Sending (%s) to device...', coords.join(', '));
        if (!this.connected) {
            dialog.showErrorBox('No Arduino Connected', 'Please ensure that your Arduino is properly connected before trying to export coordinates.');
        }
        else {
            setTimeout(() => {
                SerialCom.arduinoSerialPort.write(coords.join(' '), (err) => {
                    if (err) {
                        console.log('Error communicating with device:', err.message);
                    }
                    console.log('Sent!');
                });
                SerialCom.arduinoSerialPort.write('\n');
            }, 4000);
            SerialCom.arduinoSerialPort.on('error', function (err) {
                console.log('Error: ', err.message);
            });
        }
    }
}
exports.SerialCom = SerialCom;
SerialCom.coords = [-1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
