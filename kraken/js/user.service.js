
'use strict';

kraken.factory('user', () => {

    let user = JSON.parse(localStorage.getItem('user'));

    let defaultUser = {
        name: '',
        access_token: '',
        watching: false,
        stream: '',
        volume: 0.5,
        quality: 'medium',
        buffer: 8
    };

    return user || defaultUser;
});