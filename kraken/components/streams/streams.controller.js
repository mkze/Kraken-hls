'use strict';

class StreamsController {

    constructor($http, $mdToast, api, player, user) {

        this.$http = $http;
        this.$toast = $mdToast;
        this.$api = api;
        this.$player = player;

        this.streams = [];
        this.resolved = false;
        this.user = user;

        this.header = 'Live Streams';

        this.loadStreams();
    }

    loadStreams() {

        this.resolved = false;
        this.streams = [];

        let streams_req = this.$api.get_streams(this.user.access_token);

        streams_req.then((response) => {
            this.streams = response.data.streams;

            if (!this.streams || !this.streams.length) {
                this.header = 'No Live Streams';
            }

        }, () => {
            this.$toast.showSimple('Failed to retrieve streams');
        });

        streams_req.finally(() => {
            this.resolved = true;
        });
    }

    watch(index) {

        let stream = this.streams[index];

        this.user.stream = stream.channel.name;
        this.user.watching = true;

        let token_req = this.$api.get_live_token(stream.channel.name);

        token_req.then((response) => {
            let access_token = response.data;
            
            let url = this.$api.get_hls_link(stream.channel.name, access_token);
            this.$player.play(url);

        }, () => {
            this.$toast.showSimple('Error retrieving stream access token');
        });
    }

}


module.exports = StreamsController;