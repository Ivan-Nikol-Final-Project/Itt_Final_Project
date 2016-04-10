(function () {
    'use strict';

    function MainController(auth, identity) {
        var vm = this;

        waitForLogin();

        vm.logout = function() {
            vm.currentUser = undefined;
            auth.logout();
            waitForLogin();
        };

        /*vm.getRating = function () {
            game.getRating()
                .then(function(rating){
                    vm.rating = rating;
                }, function(err) {
                    //TODO
                });
        };*/


        function waitForLogin() {
            identity.getUser()
                .then(function(user) {
                    vm.currentUser = user;
                });
        };
    }

    angular.module('gameApp')
        .controller('MainController', ['auth', 'identity', MainController]);

})();
