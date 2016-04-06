(function(){
    "use strict";

    function RegisterController($location, auth) {
        var vm = this;

        vm.register = function(user, registerForm) {
            console.log(user);
            if(registerForm.$valid) {
                auth.register(user)
                    .then(function () {
                        $location.path('/identity/login');
                    });
            }
        }
    }

    angular.module('gameApp.controllers')
        .controller('RegisterController', ['$location', 'auth', RegisterController]);

})();
