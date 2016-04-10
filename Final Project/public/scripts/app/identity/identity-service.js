(function () {
    'use strict';

    var identityService = function identityService($q, $cookies) {
        var deferred = $q.defer();
        var theBigDay = new Date();
        theBigDay.setHours(theBigDay.getHours() + 72);

        return {
            getUser: function () {
                if (this.isAuthenticated()) {
                    return $q.resolve($cookies.getObject('user'));
                }

                return deferred.promise;
            },
            isAuthenticated: function () {
                return $cookies.get('authentication');
            },
            setUser: function (user) {
                $cookies.putObject('user', user);
                deferred.resolve(user);
            },
            removeUser: function () {
                $cookies.remove('user');
                deferred = $q.defer();
            }
        };
    };

    angular
        .module('gameApp.services')
        .factory('identity', ['$q', '$cookies', identityService]);
}());