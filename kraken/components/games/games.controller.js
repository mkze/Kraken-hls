
"use strict";

function GamesController ($mdToast, api, user, player) {

    this.$toast = $mdToast;

    this.api = api;
    this.player = player;
    this.user = user;

    this.titles = [];
    this.streams = [];

    this.loadGames();

};

GamesController.prototype.loadGames = function () {

    var _this = this;
    var gamesPromise = this.api.get_games(25, 0);

    gamesPromise.then(function (response) {
        _this.titles = response.data.top;

    }, function () {
        this.$toast.showSimple("Error retrieving top games");
    });

};

GamesController.prototype.select = function (index) {

    var _this = this;
    var game = this.titles[index];
    var name = encodeURIComponent(game.game.name);

    var streamsPromise = this.api.get_streams_by_game(name);
    streamsPromise.then(function (response) {
        _this.streams = response.data.streams;
    }, function () {
        _this.$toast.showSimple("Error retrieving " + game + " streams");
    });

};

GamesController.prototype.watch = function (index) {
    var _this = this;
    var stream = this.streams[index];

    this.user.stream = stream.channel.name;
    this.user.watching = true;

    this.player.buffering = true;
    var token_req = this.api.get_live_token(stream.channel.name);

    token_req.then(function (response) {
        var access_token = response.data;
        var hls_req = _this.api.get_hls_links(stream.channel.name, access_token);

        hls_req.then(function (response) {
            var M3U_data = response.data;
            var url = _this.api.parse_m3u(M3U_data, "chunked");
            _this.player.play(url);

        }, function () {
            _this.$toast.showSimple("Error retrieving stream HLS links");
        });

    }, function () {
        _this.$toast.showSimple("Error retrieving stream access token");
    });
};



kraken.controller("GamesController", GamesController);