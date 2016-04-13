(function () {
    'use strict';

    function LoginController($location, auth) {
        var vm = this;
        vm.errorLogin = false;

        vm.login = function(user, loginForm) {
            console.log(user);
            if (loginForm.$valid) {
                auth.login(user)
                   .then(function(){
                       $location.path('/');
                       vm.errorLogin = false;
                   }, function() {
                       vm.errorLogin = true;
                       $location.path('/identity/login');
                   });
            }
        }
    }

    angular.module('gameApp.controllers')
        .controller('LoginController', ['$location', 'auth', LoginController])
})();
