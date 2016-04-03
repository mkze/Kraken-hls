'use strict';

class AppController {
    constructor($location, user) {
        this.$location = $location;
        this.user = user;
        this.menuOpen = false;
        this.theme = user.theme;
    };

    back() {
        this.user.watching = true;
    }

    redirect(path) {
        this.user.watching = false;
        this.$location.path(path);
        this.menuOpen = false;
    };

    saveTheme() {
        this.user.theme = this.theme;
        localStorage.setItem('user', JSON.stringify(this.user));
    }
}

AppController.$routeConfig = [
  { path: 'kraken/main.html', component: 'home' },
  { path: 'kraken/streams', component: 'streams' },
  { path: 'kraken/channels', component: 'channels' },
  { path: 'kraken/games', component: 'games' },
  { path: 'kraken/settings', component: 'settings' }
];

module.exports = AppController;