'use strict';

class PlayerController {

    constructor($scope, $mdToast, $timeout, api, player, user) {

        let _this = this;
        this.buffering = false;
        this.playing = false;
        this.fullscreen = false;
        this.quality = user.quality;
        this.$api = api;
        this.$player = player;
        this.$timeout = $timeout;

        this.user = user;
        this.volume = Math.round(user.volume * 100) || 50;

        this.qualities = [
            { raw: 'audio_only', view: 'Audio' },
            { raw: 'mobile', view: 'Mobile' },
            { raw: 'low', view: 'Low' },
            { raw: 'medium', view: 'Medium' },
            { raw: 'high', view: 'High' },
            { raw: 'chunked', view: 'Source' }
        ];

        video.onplaying = () => {
            _this.playing = true;
            $scope.$apply();
        };

        let toolbarPromise;

        videoContainer.onmousemove = () => {

            //clear previous timeout
            _this.$timeout.cancel(toolbarPromise);

            //show toolbar
            playertoolbar.style.opacity = 1;

            //set timeout to hide toolbar again
            toolbarPromise = _this.$timeout(() => {
                playertoolbar.style.opacity = 0;
            }, 1500);
        };

        //videoContainer.onmousewheel  (event) {
        //    video.volume += Math.round(event.deltaY < 0 ? (video.volume >= 0.1 ? 0.1 : 0.0) : (video.volume <= 1.0 ? -0.1 : 0.0));
        //    console.log(video.volume);
        //};

    };

    togglePlayback() {

        if (video.paused)
            video.play();
        else
            video.pause();

        this.playing = !this.playing;

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
        localStorage.setItem('user', JSON.stringify(this.user));
    };

}

module.exports = PlayerController;