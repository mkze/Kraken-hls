'use strict';

class HomeController {

    constructor($location, $http, $timeout, $mdToast, api, user) {

        this.$location = $location;
        this.$http = $http;
        this.$timeout = $timeout;
        this.$toast = $mdToast;

        this.api = api;
        this.user = user;

        this.checkAuth();
    }

    authenticate() {
        let _this = this;

        let remote = require('remote');
        let BrowserWindow = remote.BrowserWindow;
        let authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            'node-integration': false
        });


        let clientID = 'dpns6ijfs3228myzqg1593j8p27dn8h';
        let redirectURL = encodeURIComponent('app://kraken/');
        let authUrl = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redirectURL}&scope=user_read`;
        authWindow.loadURL(authUrl);
        authWindow.show();

        authWindow.webContents.on('will-navigate', (event, url) => {
            _this.parseAuth(url, authWindow);
        });

        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            _this.parseAuth(newUrl, authWindow);
        });

    };

    redirect() {
        let _this = this;

        //redirect after 500ms
        this.$timeout(() => {
            _this.$location.path('/kraken/streams');
        }, 500);
    }

    parseAuth(url, window) {
        let _this = this;

        if (!url.includes('#access_token=')) {
            this.$toast.showSimple('Failed to retrieve access token from auth redirect');
            return;
        }

        let hashes = url.split('&');
        let raw_token = hashes[0].split('=');
        let access_token = raw_token[1];

        window.destroy();

        //retrieve the user's data
        let user_req = this.api.get_user(access_token);
        user_req.then((response) => {

            //indicate success
            _this.$toast.showSimple('Successfully Authenticated');

            //get user data from response
            let user_data = response.data;
            _this.user.name = user_data.display_name;
            _this.user.access_token = access_token;
            _this.user.watching = false;

            //save user object to local storage
            localStorage.setItem('user', JSON.stringify(_this.user));

            //redirect to streams
            _this.redirect();

        }, (error) => {
            _this.$toast.showSimple('Failed to retrieve user object');
        });
    }

    checkAuth() {

        if (this.user.access_token) {
            //already authenticated, redirect to streams
            this.user.stream = '';
            this.user.watching = false;
            this.redirect();
        }

    };

}

module.exports = HomeController;