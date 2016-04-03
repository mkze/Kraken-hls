
"use strict";

class SettingsController {

    constructor(user) {
        this.user = user;
        this.themes = [
            'dark',
            'light'
        ];

        this.setAnimations();
    }

    toggleAnimations() {
        this.setAnimations();
    }

    setAnimations() {
        let ele = document.getElementById('noanimate');
        if (this.user.animations) {
            ele.setAttribute('disabled', true);
        } else {
            ele.removeAttribute('disabled');
        }
    }

}

module.exports = SettingsController;