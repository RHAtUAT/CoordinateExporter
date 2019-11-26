import electron, { Menu, MenuItemConstructorOptions } from 'electron';
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

    // Load the stylization for the app
    win.loadURL(url.format({
        pathname: fileName,
        protocol: 'file:',
        slashes: true
    }))
}

app.on('ready', function () {
    createWindow('index.html');
    
    // Insert our custom toolbar instead of the default one.
    const toolBar = Menu.buildFromTemplate(toolBarTemplate);
    Menu.setApplicationMenu(toolBar);
}); 


// Menu template
const toolBarTemplate : Electron.MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu:[
            { label: 'Import File' },
            { label: 'Export File' }

        ]
    },
    {
        label: 'View',
         submenu:  [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ] as MenuItemConstructorOptions[]
    }
];