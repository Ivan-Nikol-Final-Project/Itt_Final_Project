(function () {
    'use strict';

    function ShopController(shop, identity) {
        var vm = this;

        vm.buyGold = function(item) {
            console.log('buy gold');

            identity.getUser()
                .then(function(user){
                    shop.buy(item, user)
                        .then(function(response){
                            vm.id = response.id;
                            sendRequestPayPall(response);

                            console.log(response);
                        }, function(err){
                            //TODO
                        });
                });
        }
    }

    angular.module('gameApp.controllers')
        .controller('ShopController', ['shop', 'identity', ShopController]);
})();
