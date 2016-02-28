'use strict';

class PlayerService {

    constructor($timeout, user) {

        let HLS = {};
        
        const HLS_OPTS = {
            //debug: true,
            autoStartLoad: false,
            maxBufferLength: user.buffer
        };
        
        let destroyContext = () => {
            HLS.detachMedia();
            HLS.destroy();
        };
        
        let setQuality = () => {
            HLS.levels.forEach((level, index) => {
                if (level.attrs.VIDEO === user.quality) {
                    //HLS.autoLevelCapping = index;
                    HLS.loadLevel = index;
                    console.info('set quality: %s', user.quality);
                }
            });
        };

        let service = {

            play: (url) => {

                video.dispatchEvent(new Event('buffering'));

                if (HLS.initialized) {
                    destroyContext();
                }

                HLS = new Hls(HLS_OPTS);
                HLS.loadSource(url);
                HLS.attachMedia(video);
                HLS.initialized = true;

                HLS.on(Hls.Events.MANIFEST_PARSED, (event, data) => {

                    //set start quality
                    HLS.levels.forEach((level, index) => {
                        if (level.attrs.VIDEO === user.quality) {
                            //HLS.autoLevelCapping = index;
                            HLS.startLevel = index;
                            HLS.loadLevel = index;
                            console.info('auto level enabled: %s', HLS.autoLevelEnabled);
                            console.info('set start quality: %s', index);
                        }
                    });

                    HLS.startLoad();

                    //custom video events
                    video.removeEventListener('destroy', destroyContext);
                    video.removeEventListener('level_switch', setQuality);
                    
                    video.addEventListener('destroy', destroyContext);
                    video.addEventListener('level_switch', setQuality);
                    
                    video.volume = user.volume;
                    video.play();

                });

                HLS.on(Hls.Events.FRAG_CHANGED, () => {
                    video.dispatchEvent(new Event('play'));
                })

                HLS.on(Hls.Events.FPS_DROP, (event, data) => {
                    console.info('FPS drop');
                    console.info(`${event}: ${data}`);
                })

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
                            video.dispatchEvent(new Event('buffering'));
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
