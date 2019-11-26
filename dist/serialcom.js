"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const electron_1 = require("electron");
const { dialog } = electron_1.remote;
class SerialCom {
    // Finds the port that the arduino is plugged into so that we can open a connection
    static getConnectedArduino() {
        setInterval(() => {
            if (SerialCom.arduinoPort != null)
                return;
            console.log('Searching for arduino...');
            // Get a list of all the comPorts
            let comPorts;
            serialport_1.default.list().then(portArray => {
                comPorts = portArray;
                //console.log(comPorts);
                // Check all the ports to see if the arduino is connected
                comPorts.forEach((port) => {
                    if (port.manufacturer.includes('arduino')) {
                        SerialCom.arduinoPort = port.comName;
                        SerialCom.openPort(SerialCom.arduinoPort);
                    }
                });
            }).catch(console.error);
        }, 1000);
    }
    // Create a connection to the port for sending and receiving data
    static openPort(COM_PORT) {
        if (COM_PORT != null)
            console.log("Arduino Found on Port: " + COM_PORT);
        console.log(`Opening Connection on Port...`);
        // Open communication to port the Arduino is connected to
        SerialCom.arduinoSerialPort = new serialport_1.default(COM_PORT, { baudRate: 9600 });
        let parser = SerialCom.arduinoSerialPort.pipe(new serialport_1.default.parsers.Readline({ delimiter: '\n' }));
        SerialCom.arduinoSerialPort.open(function () {
            console.log('Connection Open and Waiting...');
        });
        // If there's an error let us know
        SerialCom.arduinoSerialPort.on('error', function (err) {
            console.log('Error: ', err.message);
        });
        //arduinoSerialPort.on('readable', () => { console.log('Data: ', arduinoSerialPort.read(16)); });
        // When data has been sent
        //arduinoSerialPort.on('data', (data) => { console.log("Buffer: " + data); });
        parser.on('data', (data) => {
            if (data) {
                console.log("parsing data:", data);
            }
            console.log("bytes received");
        });
        // When the connection has been opened
        SerialCom.arduinoSerialPort.on('open', () => {
            this.connected = true;
            document.getElementById('arduino-info').innerText = `Arduino Connected on Port: ${COM_PORT}`;
            console.log('Connected');
        });
        // When the arduino gets unplugged
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
                    //SerialCom.getConnectedArduino();
                }, 1000);
            }
        });
    }
    static writeToArduino(longitude, latitude) {
        let coords = [longitude, latitude];
        console.log(coords);
        if (!this.connected) {
            dialog.showErrorBox('No Arduino Connected', 'Please ensure that your Arduino is properly connected before trying to export coordinates.');
        }
        else {
            setTimeout(() => {
                // The coordinates we're gonna send to the flight computer
                SerialCom.arduinoSerialPort.write(coords.join(' '), (err) => {
                    if (err) {
                        console.log("Err: ", err.message);
                    }
                    console.log("The coordinates: " + coords);
                    console.log("message sent");
                });
                // This is the delimiter, this tells the program to split the message here
                // This is how the network knows the entire message has been completely sent
                SerialCom.arduinoSerialPort.write('\n');
            }, 4000);
            // If there's an error let us know
            SerialCom.arduinoSerialPort.on('error', function (err) {
                console.log('Error: ', err.message);
            });
        }
    }
}
exports.SerialCom = SerialCom;
SerialCom.coords = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
