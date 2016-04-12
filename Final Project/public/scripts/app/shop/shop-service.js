(function () {
    'use strict';

    function ShopService($http, $q, baseUrl) {

        function buy(item, user) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/api/v1/payment', {
                id: user.id,
                gold: item
            }).then(function(response){
                deferred.resolve(response.data);
            }, function(err){
                deferred.reject(err);
            })

            return deferred.promise;
        }

        function sendRequestPayPall(response) {
            console.log(response);
            var formId = 'form' + response.order_value;
            document.getElementById(formId).submit();
        }

        return {
            buy: buy,
            sendRequestPayPall: sendRequestPayPall
        }
    };

    angular.module('gameApp.services')
        .factory('shop', ['$http', '$q', 'baseUrl', ShopService]);

})();

