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
        }

        function sendRequestPayPall(response) {
            var formId = 'form' + response.id;
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

