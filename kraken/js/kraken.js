'use strict';

let path = require('path');

let NavController = require(path.resolve('./kraken/components/nav/nav.controller.js'));
let HomeController = require(path.resolve('./kraken/components/home/home.controller.js'));
let PlayerController = require(path.resolve('./kraken/components/player/player.controller.js'));
let StreamsController = require(path.resolve('./kraken/components/streams/streams.controller.js'));
let ChannelsController = require(path.resolve('./kraken/components/channels/channels.controller.js'));
let GamesController = require(path.resolve('./kraken/components/games/games.controller.js'));

const kraken = angular.module('kraken', ['ngMaterial', 'ngNewRouter'])
                    .controller('NavController', NavController)
                    .controller('HomeController', HomeController)
                    .controller('PlayerController', PlayerController)
                    .controller('StreamsController', StreamsController)
                    .controller('ChannelsController', ChannelsController)
                    .controller('GamesController', GamesController);

kraken.config(($locationProvider) => {
    //enable html5 mode routing
    $locationProvider.html5Mode(true);
});