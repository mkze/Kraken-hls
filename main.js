'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const path = require('path');
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

    var protocol = electron.protocol;
    protocol.registerStandardSchemes(["app"]);
    protocol.registerFileProtocol('app', function(request, callback) {
      var url = request.url.substr(6);
      callback({path: path.normalize(__dirname + '/' + url)});
    }, function (error) {
      if (error)
        console.error('Failed to register app:// protocol');
    });
    
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 720, webPreferences: { webSecurity: false }});

  // and load the index.html of the app.
  mainWindow.loadURL('app://kraken/main.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
