
"use strict";

function StreamsController($http, $mdToast, api, player, user) {

    this.$http = $http;
    this.$toast = $mdToast;
    this.$api = api;
    this.$player = player;

    this.streams = {};
    this.user = user;

    this.loadStreams();
}

StreamsController.prototype.loadStreams = function () {

    var _this = this;

    var streams_req = _this.$api.get_streams(_this.user.access_token);
    streams_req.then(function (response) {

        _this.streams = response.data.streams;
    }, function () {
        _this.$toast.showSimple("Failed to retrieve streams");
    });
}

StreamsController.prototype.watch = function (index) {

    var _this = this;
    var stream = this.streams[index];

    this.user.stream = stream.channel.name;
    this.user.watching = true;

    var token_req = _this.$api.get_live_token(stream.channel.name);

    token_req.then(function (response) {
        var access_token = response.data;
        var hls_req = _this.$api.get_hls_links(stream.channel.name, access_token);

        hls_req.then(function (response) {
            var M3U_data = response.data;
            var url = _this.$api.parse_m3u(M3U_data, _this.user.quality);
            _this.$player.play(url);

        }, function () {
            _this.$toast.showSimple("Error retrieving stream HLS links");
        });

    }, function () {
        _this.$toast.showSimple("Error retrieving stream access token");
    });
}


kraken.controller('StreamsController', StreamsController);
