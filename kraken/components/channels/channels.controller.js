'use strict';

class ChannelsController {

    constructor($mdToast, api, player, user) {

        this.$api = api;
        this.$player = player;
        this.$toast = $mdToast;

        this.limit = 25;
        this.offset = 0;

        this.user = user;
        this.streams = [];
        this.count = 0;
        this.resolved = false;

        this.loadStreams();
        this.attachScrollHandler();
    };

    attachScrollHandler() {

        angular.element(document).ready(() => {
            let ele = document.querySelector('[ng-viewport]');
            ele.onscroll = () => {
                if (this.resolved && (this.offset <= this.streams.length) && (ele.scrollTop + ele.offsetHeight) > ele.scrollHeight) {
                    this.offset += this.limit;
                    this.loadStreams();
                }
            };
        });

    }

    loadStreams() {

        this.resolved = false;

        let channels_req = this.$api.get_channels(this.limit, this.offset);

        channels_req.then((response) => {

            if (!this.streams.length) {
                this.streams = response.data.streams;
            } else {
                this.streams = this.streams.concat(response.data.streams);
            }

            this.count = response.data._total;
        }, () => {
            this.$toast.showSimple('Failed to retrieve channels');
        });

        channels_req.finally(() => {
            this.resolved = true;
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

    refresh() {
        if (!this.resolved) {
            return;
        }

        this.streams = [];
        this.offset = 0;
        this.loadStreams();
    }

}

module.exports = ChannelsController;