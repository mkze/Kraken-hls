'use strict';

 function ApiService($http) {

    return {
        get_channels: () => {
            return $http.get('https://api.twitch.tv/kraken/streams');
        },
        get_games: (limit, offset) => {
            return $http.get('https://api.twitch.tv/kraken/games/top?limit=' + limit + '&offset=' + offset);
        },
        get_user: (oauth_token) => {
            return $http.get('https://api.twitch.tv/kraken/user?oauth_token=' + oauth_token);
        },
        get_streams: (oauth_token) => {
            return $http.get('https://api.twitch.tv/kraken/streams/followed?oauth_token=' + oauth_token);
        },
        get_streams_by_game: (game) => {
            return $http.get('https://api.twitch.tv/kraken/streams?game=' + game);
        },
        get_live_token: (channel) => {
            return $http.get('https://api.twitch.tv/api/channels/' + channel + '/access_token');
        },
        get_hls_links: (channel, access_token) => {
            return $http.get(`http://usher.twitch.tv/api/channel/hls/${channel}.m3u8?allow_source=true&allow_audio_only=true&type=any&private_code=null&player=twitchweb&token=${access_token.token}&sig=${access_token.sig}`);
        },
        parse_m3u: (data, quality) => {
            var url = '';
            var arr = data.split('\n');

            arr.forEach((line) => {
                if (line.indexOf('://') != -1 && line.indexOf(quality) != -1) {
                    url = line;
                }
            });

            return url;
        }
    };

};

kraken.factory('api', ApiService);