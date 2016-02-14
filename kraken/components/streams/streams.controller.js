'use strict';

class StreamsController {

    constructor($http, $mdToast, api, player, user) {

        this.$http = $http;
        this.$toast = $mdToast;
        this.$api = api;
        this.$player = player;

        this.streams = {};
        this.user = user;

        this.loadStreams();
    }

    loadStreams() {

        let _this = this;

        let streams_req = _this.$api.get_streams(_this.user.access_token);
        streams_req.then((response) => {
            _this.streams = response.data.streams;
        }, () => {
            _this.$toast.showSimple('Failed to retrieve streams');
        });
    }

    watch(index) {

        let _this = this;
        let stream = this.streams[index];

        this.user.stream = stream.channel.name;
        this.user.watching = true;

        let token_req = _this.$api.get_live_token(stream.channel.name);

        token_req.then((response) => {
            let access_token = response.data;
            let hls_req = _this.$api.get_hls_links(stream.channel.name, access_token);

            hls_req.then((response) => {
                let M3U_data = response.data;
                let url = _this.$api.parse_m3u(M3U_data, _this.user.quality);
                _this.$player.play(url);

            }, () => {
                _this.$toast.showSimple('Error retrieving stream HLS links');
            });

        }, () => {
            _this.$toast.showSimple('Error retrieving stream access token');
        });
    }

}


module.exports = StreamsController;