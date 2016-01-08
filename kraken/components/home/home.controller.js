
"use strict";

function HomeController($location, $http, $timeout, $mdToast, api, user) {

    this.$location = $location;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$toast = $mdToast;

    this.api = api;
    this.user = user;

    this.checkAuth();
}

HomeController.prototype.authenticate = function () {
    var _this = this;

    // Build the OAuth consent page URL
    var electron = require('electron');
    var remote = electron.remote;
    var BrowserWindow = remote.BrowserWindow;
    var authWindow = new BrowserWindow({ width: 800, height: 600, show: false, 'node-integration': false });

    var authUrl = "https://api.twitch.tv/kraken/oauth2/authorize?response_type=token&client_id=dpns6ijfs3228myzqg1593j8p27dn8h&redirect_uri=app%3A%2F%2Fkraken%2F&scope=user_read";
    authWindow.loadURL(authUrl);
    authWindow.show();

    authWindow.webContents.on('will-navigate', function (event, url) {
      _this.parseAuth(url, authWindow);
    });

    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
      _this.parseAuth(newUrl, authWindow);
    });

};

HomeController.prototype.redirect = function () {
    var _this = this;

    //redirect after 500ms
    this.$timeout(function () {
        _this.$location.path("/kraken/streams");
    }, 500);
}

HomeController.prototype.parseAuth = function(url, window) {
    var _this = this;
    
    if(url.indexOf("#access_token=") === -1)
        return;

    var hashes = url.split("&");
    var raw_token = hashes[0].split("=");
    var access_token = raw_token[1];
    console.log(access_token);

    window.destroy();

    //retrieve the user's data
    var user_req = this.api.get_user(access_token);
    user_req.then(function (response) {

        //indicate success
        _this.$toast.showSimple("Successfully Authenticated");

        //get user data from response
        var user_data = response.data;
        _this.user.name = user_data.display_name;
        _this.user.access_token = access_token;
        _this.user.watching = false;

        //save user object to local storage
        localStorage.setItem("user", JSON.stringify(_this.user));

        //redirect to streams
        _this.redirect();

    }, function (error) {
        _this.$toast.showSimple("Failed to retrieve user object");
    });
}

HomeController.prototype.checkAuth = function () {

    if (this.user.access_token) {

        //already authenticated, redirect to streams
        this.user.stream = '';
        this.user.watching = false;
        this.redirect();
    } 

};

kraken.controller('HomeController', HomeController);
