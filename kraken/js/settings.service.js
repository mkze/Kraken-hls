
'use strict';

class SettingsService {

    constructor(user) {
        this.user = user;
    }

    set() {
        this.setAnimations();
    }

    save() {
        let user = JSON.stringify(this.user);
        localStorage.setItem('user', user);
    }

    setAnimations() {
        let ele = document.getElementById('noanimate');
        if (this.user.animations) {
            ele.setAttribute('disabled', true);
        } else {
            ele.removeAttribute('disabled');
        }

        this.save();
    }

}

module.exports = SettingsService;