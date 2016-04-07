(function(){
    "use strict";

    function GameController() {
        var vm = this;

        vm.game = 'This is the game';
    }

    angular.module('gameApp.controllers')
        .controller('GameController', [GameController]);
})();
