'use strict';

class PlayerController {

    constructor($scope, $mdToast, $timeout, api, player, user, settings) {

        this.buffering = false;
        this.playing = false;
        this.fullscreen = false;
        this.quality = user.quality;
        this.$api = api;
        this.$player = player;
        this.$timeout = $timeout;

        this.user = user;
        this.settings = settings;
        this.volume = Math.round(this.user.volume * 100);

        this.qualities = [
            { raw: 'chunked', view: 'Source' },
            { raw: 'high', view: 'High' },
            { raw: 'medium', view: 'Medium' },
            { raw: 'low', view: 'Low' },
            { raw: 'mobile', view: 'Mobile' }
        ];

        this.events = {
            mousemove: new Event('mousemove'),
            destroy: new Event('destroy'),
            levelswitch: new Event('level_switch')
        };

        let toolbarPromise = undefined;

        let videoPlaying = () => {
            this.playing = true;
            this.buffering = false;
            $scope.$digest();
        }

        let videoBuffering = () => {
            this.playing = true;
            this.buffering = true;
            $scope.$digest();
        }

        video.addEventListener('play', videoPlaying, false);
        video.addEventListener('buffering', videoBuffering, false);

        videoContainer.onmousemove = () => {

            //clear previous timeout
            this.$timeout.cancel(toolbarPromise);

            //show toolbar
            playertoolbar.style.opacity = '1';
            video.style.cursor = 'default';

            //set timeout to hide toolbar again
            toolbarPromise = this.$timeout(() => {
                playertoolbar.style.opacity = '0';
                video.style.cursor = 'none';
            }, 1500);
        };

        videoContainer.onwheel = (e) => {

            //scroll speed
            const speed = 0.02;
            
            let delta = e.deltaY;
            let volume = video.volume;
            
            if (delta < 0 && (volume >= 0.0 && volume <= (1.0 - speed))) {
                //up
                volume = Math.round((volume + speed) * 100) / 100;
            } else if (delta > 0 && (volume >= speed && volume <= 1.0)) {
                //down
                volume = Math.round((volume - speed) * 100) / 100;
            }
            
            this.volume = Math.round(volume * 100);
            video.volume = volume;
            this.user.volume = volume;
            
            videoContainer.dispatchEvent(this.events.mousemove);
            
            //save user object to local storage
            this.settings.save();
            
            $scope.$digest();
        };

    };

    togglePlayback() {

        if (video.paused)
            video.play();
        else
            video.pause();

        this.playing = !this.playing;

    }
    
    stopPlayback() {
        video.dispatchEvent(this.events.destroy);
    }
    
    toggleFullscreen() {

        if (document.webkitCurrentFullScreenElement) {
            document.webkitCancelFullScreen();
        } else {
            videoContainer.webkitRequestFullScreen();
        }

        this.fullscreen = !this.fullscreen;

    }

    toggleMute() {

        if (this.volume > 0) {
            this.volume = 0.0;
            video.volume = 0.0;
        } else {
            this.volume = Math.round(this.user.volume * 100);
            video.volume = this.user.volume;
        }

    }

    volumeChanged() {

        //set volume to slider value
        video.volume = this.volume / 100;
        this.user.volume = this.volume / 100;

        //unfocus the volume slider
        volumeslider.blur();

        //save user object to local storage
        this.settings.save();
    };

    qualityChanged() {

        if (this.quality === this.user.quality)
            return;

        this.quality = this.user.quality;
        this.settings.save();
                
        video.dispatchEvent(this.events.levelswitch);
    }

}

module.exports = PlayerController;