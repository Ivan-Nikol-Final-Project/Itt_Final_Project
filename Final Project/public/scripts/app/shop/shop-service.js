(function () {
    'use strict';

    function ShopService($http, $q, baseUrl) {

        function buy(item, user) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/api/v1/payment', {
                id: user.id,
                name: item,
                price: 1.00,
                currency: 'EUR',
                gold: 100
            }).then(function(response){
                deferred.resolve(response);
            }, function(err){
                deferred.reject(err);
            })
        }

        return {
            buy: buy
        }
    };

    angular.module('gameApp.services')
        .factory('shop', ['$http', '$q', 'baseUrl', ShopService])

})();

