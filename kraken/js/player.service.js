'use strict';

function PlayerService($timeout, user) {

    const HLS = new Hls({
        maxBufferLength: user.buffer
    });

    let service = {

        play: (url) => {

            HLS.detachMedia();
            HLS.loadSource(url);
            HLS.attachMedia(video);
            HLS.on(Hls.Events.MANIFEST_PARSED, () => {
                video.volume = user.volume;
                video.play();
            });

            HLS.on(Hls.Events.ERROR, (event, data) => {
                
                let msg = `${data.fatal ? 'FATAL':''} ERROR: ${data.type} - ${data.details}`;
                
                console.error(msg);

                if (data.fatal) {
                    alert(msg);
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('fatal network error encountered, trying to recover');
                            HLS.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('fatal media error encountered, trying to recover');
                            HLS.recoverMediaError();
                            break;
                        default:
                            console.error('fatal media error encountered, CANNOT recover');
                            HLS.destroy();
                            break;
                    }
                    
                }
            });
        }
    };

    return service;
}

kraken.factory('player', ['$timeout', 'user', PlayerService]);