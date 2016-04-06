(function(){

    'use strict'

    function config($routeProvider) {

        var CONTROLLER_VIEW_MODEL_NAME = 'vm';

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home/home.html',
                controller: 'HomeController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .when('/identity/register', {
                templateUrl: 'partials/identity/register.html',
                controller: 'RegisterController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .when('/identity/login', {
                templateUrl: 'partials/identity/login.html',
                controller: 'LoginController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .when('/game/start', {
                templateUrl: 'partials/game/game.html',
                controller: 'GameController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .when('/game/rating', {
                templateUrl: 'partials/game/game-rating.html',
                controller: 'GameRatingController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .when('/shop', {
                templateUrl: 'partials/shop/shop.html',
                controller: 'ShopController',
                controllerAs: CONTROLLER_VIEW_MODEL_NAME
            })
            .otherwise({ redirectTo: '/'})
    }

    function  run($http, $cookies, auth) {
        if(auth.isAuthenticated()) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + token$cookies.get('authentication');
            auth.getIdentity();
        }
    }

    angular.module('gameApp.services', []);

    angular.module('gameApp.controllers', ['gameApp.services']);

    angular.module('gameApp', ['ngRoute', 'ngCookies', 'gameApp.controllers'])
        .config(['$routeProvider', config])
        .run(['$http', '$cookies', 'auth', run])
        .constant('baseUrl', '');
})();
