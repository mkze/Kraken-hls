'use strict';

class AppController {
    constructor($location, user) {
        this.$location = $location;
        this.user = user;
        this.menuOpen = false;
    };

    return () {
        this.user.watching = true;
    }

    redirect(path) {
        this.user.watching = false;
        this.$location.path(path);
        this.menuOpen = false;
    };
}

AppController.$routeConfig = [
  { path: 'kraken/main.html', component: 'home' },
  { path: 'kraken/streams', component: 'streams' },
  { path: 'kraken/channels', component: 'channels' },
  { path: 'kraken/games', component: 'games' }
];

module.exports = AppController;