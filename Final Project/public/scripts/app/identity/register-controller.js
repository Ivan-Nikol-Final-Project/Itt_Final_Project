(function(){
    "use strict";

    function RegisterController($location, auth) {
        var vm = this;
        vm.errorRegistration = false;

        vm.register = function(user, registerForm) {
            console.log(user);
            if(registerForm.$valid) {
                auth.register(user)
                    .then(function (res) {
                        vm.errorRegistration = false;
                        $location.path('/identity/login');
                    }, function(err) {
                        vm.errorRegistration = true;
                    });
            }
        }
    }

    angular.module('gameApp.controllers')
        .controller('RegisterController', ['$location', 'auth', RegisterController]);

})();
