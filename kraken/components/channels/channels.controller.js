'use strict';

class ChannelsController {

    constructor($mdToast, api, player, user) {

        this.$api = api;
        this.$player = player;
        this.$toast = $mdToast;

        this.user = user;
        this.streams = [];
        this.count = 0;

        this.loadStreams();
    };

    loadStreams() {
        let channels_req = this.$api.get_channels();

        channels_req.then((response) => {
            this.streams = response.data.streams;
            this.count = response.data._total;
        }, () => {
            this.$toast.showSimple('Failed to retrieve channels');
        });

    };

    watch(index) {
        let stream = this.streams[index];

        this.user.stream = stream.channel.name;
        this.user.watching = true;

        this.$player.buffering = true;
        let token_req = this.$api.get_live_token(stream.channel.name);

        token_req.then((response) => {
            let access_token = response.data;
            let url = this.$api.get_hls_link(stream.channel.name, access_token);
            this.$player.play(url);
        }, () => {
            this.$toast.showSimple('Error retrieving stream access token');
        });
    };

}

module.exports = ChannelsController;