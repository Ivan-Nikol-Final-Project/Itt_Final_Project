(function() {
    "use strict";

    function GameRatingController(game, baseUrl, identity) {
        var vm = this;
        vm.url = baseUrl + '/api/v1/scores?page=';

        vm.navigateToPage = function (url) {

            game.getRating(url)
                .then(function(response){
                    vm.rating = response.data.data;
                    vm.currentPage = response.data.current_page;
                    vm.lastPage = response.data.last_page;
                    vm.nextPage = vm.currentPage + 1 > vm.lastPage ? vm.lastPage : vm.currentPage + 1;
                    vm.previousPage = vm.currentPage - 1 <= 0 ? 1 : vm.currentPage - 1;
                }, function(err) {
                });
        };

        vm.getRating = function (number) {

            var url = vm.url + number;
            vm.navigateToPage(url);
        };

        identity.getUser()
            .then(function (response) {

                vm.user = {
                    highScore: response.statistic.high_score
                }
            });

        vm.getRating(1);
    }

    angular.module('gameApp.controllers')
        .controller('GameRatingController', ['game', 'baseUrl', 'identity', GameRatingController]);

})();
