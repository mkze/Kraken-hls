'use strict';

class PlayerService {

    constructor($timeout, user) {
        let HLS = {};

        let switchQuality = () => {
            HLS.levels.forEach((level, index) => {
                if (level.attrs.VIDEO === user.quality) {
                    HLS.loadLevel = index;
                    console.info('set quality: %s', user.quality);
                }
            });
        };

        let service = {

            play: (url) => {

                if (HLS.destroy)
                    HLS.destroy();

                HLS = new Hls({
                    maxBufferLength: user.buffer
                });
                HLS.detachMedia();
                HLS.loadSource(url);
                HLS.attachMedia(video);

                HLS.on(Hls.Events.MANIFEST_PARSED, (event, data) => {

                    //set initial quality
                    switchQuality();

                    //add event listener to video to switch qualities
                    video.removeEventListener('level_switch', switchQuality);
                    video.addEventListener('level_switch', switchQuality);

                    video.volume = user.volume;
                    video.play();

                });

                HLS.on(Hls.Events.ERROR, (event, data) => {

                    switch (data.details) {
                        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                            console.error('manifest failed to load');
                            break;
                        case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                            console.error('manifest timed out while loading');
                            break;
                        case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                            console.error('manifest parsing failed');
                            break;
                        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                            console.error('selected quality level failed to load');
                            break;
                        case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                            console.error('selected quality level timed out while loading');
                            break;
                        case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                            console.error('failed to switch to selected quality');
                            break;
                        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                            console.error('fragment failed to load');
                            break;
                        case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                            console.error('fragment being requested in a loop');
                            break;
                        case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                            console.error('fragment timed out while loading');
                            break;
                        case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                            console.error('fragment failed to be decrypted');
                            break;
                        case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                            console.error('fragment failed to be parsed');
                            break;
                        case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                            console.error('buffer failed to prepare for appending');
                            break;
                        case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
                            console.error('buffer failed during appending');
                            break;
                        case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                            console.error('buffer failed to load next segment before playback ended');
                            break;
                        default:
                            console.error('unknown error occured');
                            break;
                    }

                    if (data.fatal) {
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


}

module.exports = PlayerService;