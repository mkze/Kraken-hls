
"use strict";

function PlayerController($scope, $mdToast, $timeout, api, player, user) {

    var _this = this;
    this.buffering = false;
    this.playing = false;
    this.fullscreen = false;
    this.quality = user.quality;
    this.$api = api;
    this.$player = player;
    this.$timeout = $timeout;

    this.user = user;
    this.volume = user.volume || 50;

    this.qualities = [
        { raw: 'audio_only', view: 'Audio' },
        { raw: 'mobile', view: 'Mobile' },
        { raw: 'low', view: 'Low' },
        { raw: 'medium', view: 'Medium' },
        { raw: 'high', view: 'High' },
        { raw: 'chunked', view: 'Source' }
    ];
};


kraken.controller("PlayerController", ["$scope", "$mdToast", "$timeout", "api", "player", "user", PlayerController]);