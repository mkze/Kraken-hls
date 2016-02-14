'use strict';

class NavController {

    constructor() {
        this.remote = require('remote');
        this.maximized = false;

        this.bindHandlers();
    }

    bindHandlers() {
        let _this = this;
        let window = this.remote.getCurrentWindow();

        let closeButton = document.getElementById('close');
        let minimizeButton = document.getElementById('minimize');
        let maximizeButton = document.getElementById('maximize');
        let unmaximizeButton = document.getElementById('unmaximize');

        window.on('maximize', () => {
            _this.maximized = true;
        });

        window.on('unmaximize', () => {
            _this.maximized = false;
        });

        closeButton.onclick = () => {
            window.close();
        };

        minimizeButton.onclick = () => {
            window.minimize();
        };

        maximizeButton.onclick = () => {
            window.maximize();
            _this.maximized = !_this.maximized;
        };

        unmaximizeButton.onclick = () => {
            window.unmaximize();
            _this.maximized = !_this.maximized;
        };
    }

}

module.exports = NavController;