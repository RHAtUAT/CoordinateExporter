"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = [
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
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }
];
