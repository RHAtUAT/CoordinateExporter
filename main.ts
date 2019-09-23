const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow } = electron;

function createWindow(fileName: string): void {

    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    //load the stylization for the app
    win.loadURL(url.format({
        pathname: fileName,
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', function () {
    createWindow('index.html');
    
}); 