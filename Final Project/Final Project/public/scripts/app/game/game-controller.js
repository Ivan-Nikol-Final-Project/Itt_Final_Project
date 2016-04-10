(function(){
    "use strict";

    function GameController(game, identity) {
        var vm = this;

        vm.startGame = function() {
            var currentUser;
            identity.getUser()
                .then(function(user){
                    game.startGame(user);
                    currentUser = user;
                });
        };

    }

    angular.module('gameApp.controllers')
        .controller('GameController', ['game','identity', GameController]);
})();
