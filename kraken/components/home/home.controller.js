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
        let remote = require('remote');
        let BrowserWindow = remote.BrowserWindow;
        let authWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            nodeIntegration: false
        });

        let clientID = 'dpns6ijfs3228myzqg1593j8p27dn8h';
        let redirectURL = encodeURIComponent('app://kraken/');
        let authUrl = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=${clientID}&redirect_uri=${redirectURL}&scope=user_read`;
        authWindow.loadURL(authUrl);
        authWindow.show();

        authWindow.webContents.on('will-navigate', (event, url) => {
            this.parseAuth(url, authWindow);
        });

        authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            this.parseAuth(newUrl, authWindow);
        });

    };

    redirect() {
        this.$timeout(() => {
            this.$location.path('/kraken/streams');
        });
    }

    parseAuth(url, window) {
        if (!url.includes('#access_token=')) {
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
            this.$toast.showSimple('Successfully Authenticated');

            //get user data from response
            let user_data = response.data;
            this.user.name = user_data.display_name;
            this.user.access_token = access_token;
            this.user.watching = false;

            //save user object to local storage
            localStorage.setItem('user', JSON.stringify(this.user));

            //redirect to streams
            this.redirect();

        }, (error) => {
            this.$toast.showSimple('Failed to retrieve user object');
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