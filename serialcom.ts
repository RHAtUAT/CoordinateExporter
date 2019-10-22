import SerialPort from 'serialport';

//import * as serialport from 'serialport'

const coords = [ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

const COM_PORT = "COM4";

var arduinoSerialPort = new SerialPort(COM_PORT, { baudRate: 9600 });
var parser = arduinoSerialPort.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }));

arduinoSerialPort.on('open', function () {
    console.log("Arduino Connected on " + COM_PORT);
});

coords.forEach(element => {
    arduinoSerialPort.write(element + " ", )
});

parser.on('data', (data: String) => {
    console.log(data);
});