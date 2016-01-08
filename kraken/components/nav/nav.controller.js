
"use strict";

function NavController($scope) {

    this.maximized = false;

    this.bindHandlers($scope);

};

NavController.prototype.bindHandlers = function ($scope) {
    
};


kraken.controller("NavController", ["$scope", NavController]);
