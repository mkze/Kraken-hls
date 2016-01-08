
"use strict";

function PlayerService($timeout) {

    var _hls = new Hls();
    var _video = document.getElementById('video');

    var service = {

        play: function (url) {
            
            _hls.loadSource(url);
            _hls.attachMedia(_video);
            _hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
        }
    };

    return service; 
}

kraken.factory('player', ["$timeout", PlayerService]);
