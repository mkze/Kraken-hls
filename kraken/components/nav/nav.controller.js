
"use strict";

function NavController($scope) {

    this.remote = require('remote');
    this.maximized = false;

    this.bindHandlers();

};

NavController.prototype.bindHandlers = function () {
    
    let _this = this;
    let window = this.remote.getCurrentWindow();

    let closeButton = document.getElementById("close");
    let minimizeButton = document.getElementById("minimize");
    let maximizeButton = document.getElementById("maximize");
    let unmaximizeButton = document.getElementById("unmaximize");

    closeButton.onclick = function () {
        window.close();
    };

    minimizeButton.onclick = function () {
        window.minimize();
    };

    maximizeButton.onclick = function () {
        window.maximize();
        _this.maximized = !_this.maximized;
    };

    unmaximizeButton.onclick = function () {
        window.unmaximize();
        _this.maximized = !_this.maximized;
    };

};


kraken.controller("NavController", ["$scope", NavController]);
