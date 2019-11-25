import SerialPort from 'serialport';
import { prototype } from 'events';

//import * as serialport from 'serialport'

const coords = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

const COM_PORT = "COM4";

console.log(SerialPort.list());

var arduinoSerialPort = new SerialPort(COM_PORT, { baudRate: 9600 });
var parser = arduinoSerialPort.pipe(new SerialPort.parsers.Readline({ delimiter: '\n' }));

// arduinoSerialPort.open((err) => {
//     if (err) {
//         console.log("Error: ", err.message);
//     }

//     console.log("Opening port...");
// });

arduinoSerialPort.on('open', function () {
    console.log("Arduino Connected on " + COM_PORT);
});

setTimeout( () => {
    coords.forEach(element => {
        arduinoSerialPort.write(element + " ", (err) => {
            if (err) {
                console.log("Err: ", err.message);
            }

            console.log("message sent");
        });
    })
    arduinoSerialPort.write('\n');
}, 4000);

// arduinoSerialPort.write("hello, there!", (err) => {
//     if (err) {
//         console.log("Error: ", err.message);
//     }

//     console.log("message sent");
// })

arduinoSerialPort.on('error', function (err) {
    console.log('Error: ', err.message)
});

arduinoSerialPort.on('readable', () => { console.log('Data: ', arduinoSerialPort.read(16)); });

arduinoSerialPort.on('data', (data) => { console.log(data); });


parser.on('data', (data: String) => {
    if (data) {
        console.log("data:", data);
    }

    console.log("msg received");
});