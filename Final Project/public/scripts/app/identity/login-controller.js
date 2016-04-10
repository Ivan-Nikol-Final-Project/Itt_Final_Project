(function () {
    'use strict';

    function LoginController($location, auth) {
        var vm = this;

        vm.login = function(user, loginForm) {
            console.log(user);
            if (loginForm.$valid) {
                auth.login(user)
                   .then(function(){
                       $location.path('/');
                   });
            }
        }
    }

    angular.module('gameApp.controllers')
        .controller('LoginController', ['$location', 'auth', LoginController])
})();
