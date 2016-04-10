
'use strict';

class SettingsController {

    constructor(user, settings) {
        this.user = user;
        this.settings = settings;

        this.themes = [
            'dark',
            'light'
        ];
    }

    toggleAnimations() {
        this.settings.setAnimations();
    }

}

module.exports = SettingsController;