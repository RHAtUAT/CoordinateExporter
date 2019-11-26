"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importStar(require("electron"));
const url = require('url');
const path = require('path');
const { app, BrowserWindow } = electron_1.default;
function createWindow(fileName) {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load the stylization for the app
    win.loadURL(url.format({
        pathname: fileName,
        protocol: 'file:',
        slashes: true
    }));
}
app.on('ready', function () {
    createWindow('index.html');
    // Insert our custom toolbar instead of the default one.
    const toolBar = electron_1.Menu.buildFromTemplate(toolBarTemplate);
    electron_1.Menu.setApplicationMenu(toolBar);
});
// Menu template
const toolBarTemplate = [
    {
        label: 'File',
        submenu: [
            { label: 'Import File' },
            { label: 'Export File' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }
];
