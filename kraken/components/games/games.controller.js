'use strict';

class GamesController {

    constructor($mdToast, api, user, player) {

        this.$toast = $mdToast;

        this.api = api;
        this.player = player;
        this.user = user;

        this.titles = [];
        this.streams = [];

        this.loadGames();

    };

    loadGames() {
        let gamesPromise = this.api.get_games(25, 0);

        gamesPromise.then((response) => {
            this.titles = response.data.top;
        }, function() {
            this.$toast.showSimple('Error retrieving top games');
        });

    };

    select(index) {
        let title = this.titles[index];
        let name = encodeURIComponent(title.game.name);

        let streamsPromise = this.api.get_streams_by_game(name);
        streamsPromise.then((response) => {
            this.streams = response.data.streams;
        }, () => {
            this.$toast.showSimple('Error retrieving ' + name + ' streams');
        });

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

}

module.exports = GamesController;