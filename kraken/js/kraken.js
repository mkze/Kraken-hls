'use strict';

let path = require('path');

let AppController = require(path.resolve('./kraken/js/app.controller.js'));

let NavController = require(path.resolve('./kraken/components/nav/nav.controller.js'));
let HomeController = require(path.resolve('./kraken/components/home/home.controller.js'));
let PlayerController = require(path.resolve('./kraken/components/player/player.controller.js'));
let StreamsController = require(path.resolve('./kraken/components/streams/streams.controller.js'));
let ChannelsController = require(path.resolve('./kraken/components/channels/channels.controller.js'));
let GamesController = require(path.resolve('./kraken/components/games/games.controller.js'));
let SettingsController = require(path.resolve('./kraken/components/settings/settings.controller.js'));

let ApiService = require(path.resolve('./kraken/js/api.service.js'));
let UserService = require(path.resolve('./kraken/js/user.service.js'));
let PlayerService = require(path.resolve('./kraken/js/player.service.js'));

const kraken = angular.module('kraken', ['ngMaterial', 'ngNewRouter'])
                    .controller('AppController', AppController)
                    .controller('NavController', NavController)
                    .controller('HomeController', HomeController)
                    .controller('PlayerController', PlayerController)
                    .controller('StreamsController', StreamsController)
                    .controller('ChannelsController', ChannelsController)
                    .controller('GamesController', GamesController)
                    .controller('SettingsController', SettingsController)
                    .factory('api', ApiService)
                    .factory('user', UserService)
                    .factory('player', PlayerService);

kraken.config(($locationProvider) => {
    //enable html5 mode routing
    $locationProvider.html5Mode(true);
});