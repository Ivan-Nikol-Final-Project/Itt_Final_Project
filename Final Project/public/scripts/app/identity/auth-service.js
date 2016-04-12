(function () {
    'use strict';

    var authService = function authService($http, $q, $cookies, identity, baseUrl, $location) {
        var TOKEN_KEY = 'authentication'; //cookie key
        var deferred = $q.defer();

        var register = function(user) {
            var defered = $q.defer();

            $http.post(baseUrl + '/api/v1/register', { username: user.username, email: user.email, password:user.password, password2: user.confirmPassword})
                .then(function(){
                    defered.resolve(true);
                }, function (err) {
                    defered.reject(err);
                })

            return defered.promise;
        }

        var login = function login(user) {
            var deferred = $q.defer();

            $http.post(baseUrl + '/api/v1/login', {username: user.username, password: user.password })
                .then(function (response) {
                    var tokenValue = response.data.api_token;

                    var theBigDay = new Date();
                    theBigDay.setHours(theBigDay.getHours() + 72);

                    $cookies.put(TOKEN_KEY, tokenValue, { expires: theBigDay });

                    $http.defaults.headers.common.Authorization = 'X-Api-Token ' + tokenValue;

                    identity.setUser(response);
                    deferred.resolve(response);

                }, function (err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        return {
            register: register,
            login: login,
            isAuthenticated: function () {
                return !!$cookies.get(TOKEN_KEY);
            },
            logout: function () {
                $cookies.remove(TOKEN_KEY);
                $http.defaults.headers.common.Authorization = null;
                identity.removeUser();
                deferred = $q.defer();
            },
        };
    };

    angular
        .module('gameApp.services')
        .factory('auth', ['$http', '$q', '$cookies', 'identity', 'baseUrl', '$location', authService]);
}());