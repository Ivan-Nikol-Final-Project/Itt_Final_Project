(function(){
    'use strict';

    function PayPallController(identity) {
        identity.getUser();
    }

    angular.module('gameApp.controllers')
        .controller('PayPallController', ['identity', PayPallController]);

})();
