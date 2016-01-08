

function ChannelsController($mdToast, api, player, user) {

    this.$api = api;
    this.$player = player;
    this.$toast = $mdToast;

    this.user = user;
    this.streams = [];
    this.count = 0;
    
    this.loadStreams();
};

ChannelsController.prototype.loadStreams = function () {

    var _this = this;
    var channels_req = this.$api.get_channels();

    channels_req.then(function (response) {
        _this.streams = response.data.streams;
        _this.count = response.data._total;
    }, function () {
        _this.$toast.showSimple("Failed to retrieve channels");
    });

};

ChannelsController.prototype.watch = function (index) {

    var _this = this;
    var stream = this.streams[index];

    this.user.stream = stream.channel.name;
    this.user.watching = true;

    this.$player.buffering = true;
    var token_req = this.$api.get_live_token(stream.channel.name);

    token_req.then(function (response) {
        var access_token = response.data;
        var hls_req = _this.$api.get_hls_links(stream.channel.name, access_token);

        hls_req.then(function (response) {
            var M3U_data = response.data;
            var url = _this.$api.parse_m3u(M3U_data, "chunked");
            _this.$player.play(url);

        }, function () {
            _this.$toast.showSimple("Error retrieving stream HLS links");
        });

    }, function () {
        _this.$toast.showSimple("Error retrieving stream access token");
    });
};



kraken.controller("ChannelsController", ChannelsController);