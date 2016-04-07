(function() {
    "use strict";

    function GameRatingController(game) {
        var vm = this;

        vm.getRating = (function () {

            /*vm.rating = [
                {
                    username: 'Ivan',
                    score: 1234
                },
                {
                    username: 'Ivan',
                    score: 1234
                }
            ];*/

            game.getRating()
                .then(function(rating){
                    vm.rating = rating;
                }, function(err) {
                    //TODO
                });
        })();
    }

    angular.module('gameApp.controllers')
        .controller('GameRatingController', ['game', GameRatingController]);

})();
