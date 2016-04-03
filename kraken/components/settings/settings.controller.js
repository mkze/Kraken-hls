
"use strict";

class SettingsController {

    constructor(user) {

        this.user = user;
        this.themes = [
            { name: 'dark', color: '#2E2E2E' },
            { name: 'red', color: '#F44336' },
            { name: 'pink', color: '#E91E63' },
            { name: 'purple', color: '#673AB7' },
            { name: 'indigo', color: '#3F51B5' },
            { name: 'blue', color: '#2196F3' },
            { name: 'cyan', color: '#00BCD4' },
            { name: 'teal', color: '#009688' },
            { name: 'green', color: '#4CAF50' },
            { name: 'orange', color: '#FF9800' }
        ];

    }

    changeTheme() {

        let styleSheets = Array.from(document.styleSheets);

        let sheet = styleSheets.filter(sheet => {
            if (sheet.href && sheet.href.includes('kraken.css')) {
                return sheet;
            }
        }).shift();

        let rules = Array.from(sheet.rules);
        rules.forEach(rule => {
            if (rule.selectorText === 'md-toolbar.themed') {
                rule.style.background = this.user.theme;
            }
        });

        localStorage.setItem('user', JSON.stringify(this.user));

    }

    toggleAnimations() {

        this.user.animations = !this.user.animations;

    }

}

module.exports = SettingsController;