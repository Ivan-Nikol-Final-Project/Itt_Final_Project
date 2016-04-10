(function(){
    "use strict";

    function GameController(game) {
        var vm = this;

        vm.startGame = game.startGame;

    }

    angular.module('gameApp.controllers')
        .controller('GameController', ['game', GameController]);
})();
