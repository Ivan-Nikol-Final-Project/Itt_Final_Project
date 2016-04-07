(function(){
    "use strict";

    function HomeController() {
        var vm = this;

        vm.hi = 'Hi';
    }

    angular.module('gameApp.controllers')
        .controller('HomeController', [HomeController]);

})();
