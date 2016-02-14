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

        let _this = this;
        let gamesPromise = this.api.get_games(25, 0);

        gamesPromise.then((response) => {
            _this.titles = response.data.top;
        }, function() {
            this.$toast.showSimple('Error retrieving top games');
        });

    };

    select(index) {

        let _this = this;
        let title = this.titles[index];
        let name = encodeURIComponent(title.game.name);

        let streamsPromise = this.api.get_streams_by_game(name);
        streamsPromise.then((response) => {
            _this.streams = response.data.streams;
        }, () => {
            _this.$toast.showSimple('Error retrieving ' + name + ' streams');
        });

    };

    watch(index) {
        let _this = this;
        let stream = this.streams[index];

        this.user.stream = stream.channel.name;
        this.user.watching = true;

        this.player.buffering = true;
        let token_req = this.api.get_live_token(stream.channel.name);

        token_req.then((response) => {
            let access_token = response.data;
            
            let url = _this.api.get_hls_link(stream.channel.name, access_token);
            _this.player.play(url);

        }, () => {
            _this.$toast.showSimple('Error retrieving stream access token');
        });
    };

}

module.exports = GamesController;