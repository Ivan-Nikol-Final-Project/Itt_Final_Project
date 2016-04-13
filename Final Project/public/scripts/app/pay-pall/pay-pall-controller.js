(function(){

    function PayPallController(paypall, identity) {
        identity.getUser();
    }

    angular.module('gameApp.controllers')
        .controller('PayPallController', ['payPall', 'identity', ShopController]);

})();
