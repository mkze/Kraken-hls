
'use strict';

function AppController($location, user) {
    this.$location = $location;
    this.user = user;
    this.menuOpen = false;
};

AppController.prototype.return = () => {
    this.user.watching = true;
}

AppController.prototype.redirect = (path) => {
    this.user.watching = false;
    this.$location.path(path);
    this.menuOpen = false;
};

AppController.$routeConfig = [
  { path: 'kraken/main.html', component: 'home' },
  { path: 'kraken/streams', component: 'streams' },
  { path: 'kraken/channels', component: 'channels' },
  { path: 'kraken/games', component: 'games' }
];


kraken.controller('AppController', ['$location', 'user', AppController]);
