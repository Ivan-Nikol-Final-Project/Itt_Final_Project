(function () {
    'use strict';

    function MainController(auth, identity, $location) {
        var vm = this;

        waitForLogin();

        vm.logout = function() {
            vm.currentUser = undefined;
            auth.logout();
            $location.path('/');
            waitForLogin();
        };

        function waitForLogin() {
            identity.getUser()
                .then(function(user) {
                    vm.currentUser = user;
                });
        };
    }

    angular.module('gameApp')
        .controller('MainController', ['auth', 'identity', '$location', MainController]);

})();
