(function() {
    "use strict";

    function GameRatingController(game) {
        var vm = this;

        vm.getRating = (function () {

            game.getRating()
                .then(function(response){
                    vm.rating = response.data;
                }, function(err) {
                    //TODO
                });
        })();
    }

    angular.module('gameApp.controllers')
        .controller('GameRatingController', ['game', GameRatingController]);

})();
