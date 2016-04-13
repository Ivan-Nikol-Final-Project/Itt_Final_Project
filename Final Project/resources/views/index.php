<!DOCTYPE html>
<html lang="en">
<head>
    <title>IT Talents Final Project</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/font-awesome/css/font-awesome.min.css">
    <link href='https://fonts.googleapis.com/css?family=Inconsolata:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/index.css">
    <script src="//cdn.jsdelivr.net/phaser/2.2.2/phaser.min.js"></script>
    <!--<script src="node_modules/phaser/dist/phaser.min.js"></script>-->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-route/angular-route.min.js"></script>
    <script src="node_modules/angular-cookies/angular-cookies.min.js"></script>
</head>
<body ng-app="gameApp" ng-cloak ng-controller="MainController as vm">

<div id="bg-color"></div>

<div id="wrapper">
    <nav class="navbar navbar-transparent">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle"
                        data-toggle="collapse" data-target="#myNavbar"
                        style="color: white">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </button>
                <a class="navbar-brand" href="#/">Zombie Park</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav">
                    <li ng-show="vm.currentUser"><a href="#/game/start">Game</a></li>
                    <li><a href="#/game/rating">Rating</a></li>
                    <li><a href="#/shop">Shop</a></li>
                </ul>
                <ul class="nav navbar-nav navbar-right" ng-show="!vm.currentUser">
                    <li><a href="#/identity/register"><span class="glyphicon glyphicon-user"></span> Register</a></li>
                    <li><a href="#/identity/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
                </ul>

                <ul class="nav navbar-nav navbar-right" ng-show="vm.currentUser">
                    <li><a href="">{{vm.currentUser.username}}</a></li>
                    <li><a href="#" ng-click="vm.logout()"> Logout <span class="glyphicon glyphicon-log-out"></span></a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container" ng-view>

    </div>
</div>

    <script src="scripts/app/app.js"></script>

    <script src="scripts/app/identity/auth-service.js"></script>
    <script src="scripts/app/identity/identity-service.js"></script>
    <script src="scripts/app/game/game-service.js"></script>
    <script src="scripts/app/shop/shop-service.js"></script>

    <script src="scripts/app/home/home-controller.js"></script>
    <script src="scripts/app/identity/register-controller.js"></script>
    <script src="scripts/app/identity/login-controller.js"></script>
    <script src="scripts/app/common/main-controller.js"></script>
    <script src="scripts/app/game/game-controller.js"></script>
    <script src="scripts/app/game/game-rating-controller.js"></script>
    <script src="scripts/app/shop/shop-controller.js"></script>
    <script src="scripts/app/pay-pall/pay-pall-controller.js"></script>
</body>
</html>
