(function(){
    'use strict';

    function PayPallController(auth) {
        auth.getUser();
    }

    angular.module('gameApp.controllers')
        .controller('PayPallController', ['auth', PayPallController]);

})();
