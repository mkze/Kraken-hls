'use strict';

class UserService {
    constructor() {
        let user = JSON.parse(localStorage.getItem('user'));

        let defaultUser = {
            name: '',
            access_token: '',
            watching: false,
            stream: '',
            volume: 0.5,
            quality: 'medium',
            buffer: 10,
            theme: 'dark',
            animations: true
        };

        return user || defaultUser;
    }
}

module.exports = UserService;