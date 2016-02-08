
"use strict";

kraken.factory('user', function () {

    var user = JSON.parse(localStorage.getItem("user"));

    var defaultUser = {
        name: '',
        access_token: '',
        watching: false,
        stream: '',
        volume: 50,
        quality: 'medium',
        buffer: 8
    };

    return user || defaultUser;
});