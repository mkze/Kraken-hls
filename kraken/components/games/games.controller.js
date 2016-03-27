'use strict';

class GamesController {

    constructor($mdToast, api, user, player) {

        this.$toast = $mdToast;

        this.api = api;
        this.player = player;
        this.user = user;

        this.selectedGame = '';
        this.header = 'Top Games';
        this.titles = [];
        this.streams = [];

        this.titleCount = 0;
        this.streamCount = 0;

        this.titleOffset = 0;
        this.streamOffset = 0;
        this.limit = 25;

        this.loadGames();
        this.attachScrollHandler();

    };

    attachScrollHandler() {

        angular.element(document).ready(() => {
            let ele = document.querySelector('[ng-viewport]');
            ele.onscroll = () => {
                if (this.resolved && (ele.scrollTop + ele.offsetHeight) > ele.scrollHeight) {

                    if (!this.streams.length && (this.titleOffset <= this.titles.length)) {
                        this.titleOffset += this.limit;
                        this.loadGames();
                    } else if (this.streamOffset <= this.streams.length) {
                        this.streamOffset += this.limit;
                        this.loadStreams(this.selectedGame);
                    }

                }
            };
        });

    }

    loadGames() {

        this.resolved = false;

        let gamesPromise = this.api.get_games(this.limit, this.titleOffset);

        gamesPromise.then((response) => {

            if (!this.titles.length) {
                this.titles = response.data.top;
            } else {
                this.titles = this.titles.concat(response.data.top);
            }

            this.titleCount = response.data._total;

        }, function () {
            this.$toast.showSimple('Error retrieving top games');
        });

        gamesPromise.finally(() => {
            this.resolved = true;
        });

    };

    loadStreams(name) {
        let encodedName = encodeURIComponent(name);

        let streamsPromise = this.api.get_streams_by_game(encodedName, this.limit, this.streamOffset);
        streamsPromise.then((response) => {

            if (!this.streams.length || this.streamOffset === 0) {
                this.streams = response.data.streams;
            } else {
                this.streams = this.streams.concat(response.data.streams);
            }

            this.streamCount = response.data._total;
        }, () => {
            this.$toast.showSimple(`Error retrieving ${name} streams`);
        });

    }

    select(index) {
        let title = this.titles[index];
        let name = title.game.name;

        this.selectedGame = name;
        this.header = name;
        this.loadStreams(name);
    };

    watch(index) {
        let stream = this.streams[index];

        this.user.stream = stream.channel.name;
        this.user.watching = true;

        this.player.buffering = true;
        let token_req = this.api.get_live_token(stream.channel.name);

        token_req.then((response) => {
            let access_token = response.data;

            let url = this.api.get_hls_link(stream.channel.name, access_token);
            this.player.play(url);

        }, () => {
            this.$toast.showSimple('Error retrieving stream access token');
        });
    };

    refresh() {
        if (!this.resolved) {
            return;
        }

        if (!this.streams.length) {
            this.titles = [];
            this.titleOffset = 0;
            this.loadGames();
        } else {
            this.streamOffset = 0;
            this.loadStreams(this.selectedGame);
        }

    }

    back() {
        this.streams = [];
        this.streamCount = 0;
        this.streamOffset = 0;
        this.header = 'Top Games';
    }

}

module.exports = GamesController;