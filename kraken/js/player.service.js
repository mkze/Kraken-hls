
"use strict";

function PlayerService($timeout, user) {

    var _hls = new Hls({
        maxBufferLength: user.buffer
    });

    var service = {

        play: function (url) {

            _hls.detachMedia();
            _hls.loadSource(url);
            _hls.attachMedia(video);
            _hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.volume = user.volume;
                video.play();
            });

            _hls.on(Hls.Events.ERROR, function (event, data) {

                var errorType = data.type;
                var errorDetails = data.details;
                var errorFatal = data.fatal;

                console.error("ERROR: ");
                console.log(errorType);
                console.log(errorDetails);
                console.log("fatal: " + errorFatal);

                if (data.fatal) {
                    alert(errorType + ": " + errorDetails);
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log("fatal network error encountered, try to recover");
                            _hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log("fatal media error encountered, try to recover");
                            _hls.recoverMediaError();
                            break;
                        default:
                            console.log("fatal media error encountered, CANNOT recover");
                            _hls.destroy();
                            break;
                    }
                }
            });
        }
    };

    return service; 
}

kraken.factory('player', ["$timeout", "user", PlayerService]);
