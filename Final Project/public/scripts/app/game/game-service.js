(function(){
    "use strict";

    function GameService($http, $q, baseUrl) {

        function getRating() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/rating')
                .then(function (response){
                    deferred.resolve(response);
                }, function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function startGame() {
           //TODO
        };

        return {
            getRating: getRating,
            startGame: startGame
        };

    }

    angular.module('gameApp.services')
        .factory('game', ['$http', '$q', 'baseUrl',  GameService]);

})();
