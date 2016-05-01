
class ChatController {

    constructor($sce, $scope, user) {

        //watch the user.stream variable
        //to update the iframe source
        $scope.$watch(() => {
            return user.stream;
        }, (oldValue, newValue) => {
            if (oldValue !== newValue && user.chat && user.stream && user.watching) {
                let url = $sce.trustAsResourceUrl(`http://twitch.tv/${user.stream}/chat`);
                this.src = url;

                if (user.bttv) {
                    this.loadBttv();
                }
            }
        });
    }

    loadBttv() {
        let frame = document.getElementById('chat');
        frame.onload = () => {
            let bttv = 'https://nightdev.com/betterttv/other/betterttv.user.js';
            let script = document.createElement('script');
            script.src = bttv;
            frame.contentDocument.head.appendChild(script);
        };
    }

}

module.exports = ChatController;