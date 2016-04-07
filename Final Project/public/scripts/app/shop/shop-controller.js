(function () {
    'use strict';

    function ShopController(shop) {
        var vm = this;
        var user = currentUser;

        vm.buyGold = function(item) {
            shop.buy(item, user)
                .then(function(){
                    //TODO
                }, function(err){
                    //TODO
                });
        }
    }

    angular.module('gameApp.controllers')
        .controller('ShopController', ['shop', ShopController]);
})();
