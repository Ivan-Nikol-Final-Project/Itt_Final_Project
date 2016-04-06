(function () {
    'use strict';

    function ShopService($http, $q, baseUrl) {

        function buy(item, user) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/shop', {
                username: user.username,
                password: user.password,
                item: item
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

