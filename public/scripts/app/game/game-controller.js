(function(){
    "use strict";

    function GameController(game) {
        var vm = this;

        game.startGame({gold: 100000});
    }

    angular.module('gameApp.controllers')
        .controller('GameController', ['game', GameController]);
})();
