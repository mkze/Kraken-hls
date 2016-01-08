
"use strict";

var kraken = angular.module('kraken', ['ngMaterial', 'ngNewRouter']);

kraken.config(function ($locationProvider) {

    //enable html5 mode routing
    $locationProvider.html5Mode(true);
});
