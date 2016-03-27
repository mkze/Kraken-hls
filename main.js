'use strict';

const electron = require('electron');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', () => {

    electron.protocol.registerFileProtocol('app', (request, callback) => {
        let url = request.url.substr(6);
        let target = path.join(__dirname, url);
        callback({
            path: path.normalize(target)
        });
    }, (error) => {
        if (error)
            console.error('Failed to register app:// protocol');
    });

    let windowOptions = {
        width: 1280,
        height: 720,
        minWidth: 300,
        minHeight: 500,
        center: true,
        frame: false,
        webPreferences: {
            webSecurity: false
        }
    };

    mainWindow = new BrowserWindow(windowOptions);

    mainWindow.loadURL('app://kraken/main.html');

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

});