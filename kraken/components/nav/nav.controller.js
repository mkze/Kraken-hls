'use strict';

class NavController {

    constructor($scope) {

        this.maximized = false;
        this.bindHandlers($scope);
    }

    bindHandlers(scope) {

        const remote = require('remote');
        let window = remote.getCurrentWindow();

        let closeButton = document.getElementById('close');
        let minimizeButton = document.getElementById('minimize');
        let maximizeButton = document.getElementById('maximize');
        let unmaximizeButton = document.getElementById('unmaximize');

        window.on('maximize', () => {
            this.maximized = true;
            scope.$digest();
        });

        window.on('unmaximize', () => {
            this.maximized = false;
            scope.$digest();
        });

        closeButton.onclick = () => {
            window.close();
        };

        minimizeButton.onclick = () => {
            window.minimize();
        };

        maximizeButton.onclick = () => {
            window.maximize();
            this.maximized = !this.maximized;
        };

        unmaximizeButton.onclick = () => {
            window.unmaximize();
            this.maximized = !this.maximized;
        };
    }

}

module.exports = NavController;
