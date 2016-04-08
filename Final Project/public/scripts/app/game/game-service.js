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

        function startGame(user) {

            var game = new Phaser.Game(980, 550, Phaser.AUTO, 'game-container', {
                preload: preload,
                create: create,
                update: update
            });

            var ZombieFactory = function(game, health){
                this.health = health;
                this.game = game;
                this.zombieVelocity = -30;
                this.createZombieInterval;
                this.playLaughInterval;
            };

            ZombieFactory.prototype = {
                init: function () {

                    var quantity = 1;
                    var interval = 10000;
                    var _this = this;

                    _this.createZombie(_this.game, quantity);

                    _this.playLaughInterval = window.setInterval(function() {
                        _this.lauphing(_this.game);
                    }, 5000);

                    this.createZombieInterval = window.setInterval(function () {

                        quantity += 1;

                        if(quantity == 10) {
                            _this.zombieVelocity -= 5;
                        }
                        else if(quantity == 20) {
                            quantity = 5
                            interval -= 500;
                            _this.health += 1;
                            _this.zombieVelocity -= 5;
                        }

                        _this.createZombie(_this.game, quantity);

                        if(interval <= 500) {
                            clearInterval(_this.createZombieInterval);
                            clearInterval(_this.playLaughInterval);
                            //todo you win
                        }
                    }, interval);
                },
                createZombie: function(game, quantity) {
                    for(var i = 0; i < quantity; i++) {
                        var x = game.rnd.integerInRange(game.world.width, game.world.width + 200);
                        var y = game.rnd.integerInRange(100, game.world.height - 100);

                        var zombie = game.zombies.create(x, y, 'zombie');
                        zombie.anchor.setTo(0.5, 0.5);

                        zombie.checkWorldBounds = true;
                        zombie.events.onOutOfBounds.add(zombieOut, this);

                        zombie.isAlive = true;
                        zombie.health = this.health;
                        zombie.body.velocity.setTo(this.zombieVelocity, 0);
                    }

                    if(quantity % 3 == 0) {
                        game.audio.zombiesCome.play();
                    }
                },
                lauphing: function(game) {
                    game.audio.zombieLaugh.play();
                }
            };

            var BulletsFactory = function (game) {
                this.NUMBER_OF_BULLETS = 100;
                this.DAMAGE = 1;
                this.game = game;
            };

            BulletsFactory.prototype = {
                init: function () {
                    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {

                        this.createBullet();

                        this.createRedBullet();

                        this.createMonsterPeaBullet();

                        this.createExplosions();
                    }
                },
                createBullet: function() {
                    var bullet = this.game.bullets.create(0, 0, 'bullet');
                    bullet.damage = this.DAMAGE + 1;
                    bullet.kill();
                },
                createRedBullet: function() {
                    var redBullet = this.game.redBullets.create(0, 0, 'redBullet');
                    redBullet.damage = this.DAMAGE;
                    redBullet.kill();
                },
                createMonsterPeaBullet: function() {
                    var monsterPeaBullet = this.game.monsterBullets.create(0, 0, 'monsterPeaBullet');
                    monsterPeaBullet.damage = this.DAMAGE + 3;
                    monsterPeaBullet.kill();
                },
                createExplosions: function () {
                    var explosion = this.game.explosions.create(0, 0, 'explosion');
                    explosion.kill();
                }
            }

            function preload() {

                var basePathImage = 'assets/game/images/';
                var basePathAudio = 'assets/game/sounds/';

                game.load.image('grass', 'assets/game/images/grass.png');
                game.load.image('zombie', 'assets/game/images/zombie.png');
                game.load.image('pea', 'assets/game/images/pea2.png');
                game.load.image('bullet', 'assets/game/images/bullet.png');
                game.load.image('flower', 'assets/game/images/flower.png');
                game.load.image('redBullet', 'assets/game/images/bullet-red.png');
                game.load.image('monsterPeaBullet', 'assets/game/images/blue-bullet2.png');
                game.load.image('buyBulletsBtn', 'assets/game/images/coin_buy.png');
                game.load.image('gold', 'assets/game/images/gold-box.png');
                game.load.image('peaIcon', 'assets/game/images/pea-icon.png');
                game.load.image('peaMonsterIcon', 'assets/game/images/pea-monster-icon.png');
                game.load.image('redBulletIcon', 'assets/game/images/bullet-red-icon.png');
                game.load.image('peaMonster', 'assets/game/images/pea-monster.png');
                game.load.image('whiteRadishBomb', 'assets/game/images/white-radish-bomb.png');
                game.load.image('whiteRadishIcon', 'assets/game/images/white-radish-icon.png');
                game.load.image('zombieInHome', basePathImage + 'zombie-in-home.png');
                game.load.spritesheet('explosion', 'assets/game/images/explode.png', 128, 128);


                game.load.audio('zombieDie', 'assets/game/sounds/zombieInPain.mp3');
                game.load.audio('monsterLaugh', 'assets/game/sounds/monsterLaugh');
                game.load.audio('gameAudio1', 'assets/game/sounds/cerebrawl.mp3');
                game.load.audio('zombiesCome', 'assets/game/sounds/monsterGrowl.mp3');
                game.load.audio('zombieLaugh', 'assets/game/sounds/zombieLaugh.mp3');
                game.load.audio('shoot', 'assets/game/sounds/shoot.ogg');
                game.load.audio('hitZombie', 'assets/game/sounds/hitZombie.ogg');
                game.load.audio('explosionAudio', basePathAudio + 'explosion.mp3');
            }

            var bulletSpeed = 500;
            var numberOfBullets = 100;
            var numberOfRedBullets = 100;
            var numberOfMonsterPeaBullets = 100;
            var gold = user.gold || 1000;
            var score = 0;
            var peaAvailable = 5;
            var peaMonsterAvailable = 1;
            var whiteRadishBombAvailable = 3;
            var whiteRadishBombInAction = 0;
            var maxZombieInHome = 10;
            var peaMonster;
            var explosions;
            var flower;

            var scoreString = 'Score : ';
            var scoreText;

            var bulletString = 'Pea bullets: ';
            var bulletText;

            var redBulletString = 'Flower bullets: ';
            var redBulletText;

            var monsterPeaBulletsString = 'Monster bullets: ';
            var monsterPeaBulletsText;

            var goldString = 'Gold: ';
            var goldText;

            var availablePeaText;
            var peaMonsterAvailableText;
            var whiteRadishBombText;
            var maxZombieInHomeText;

            var buyBulletsButton;
            var buyRedBulletsButton;
            var buyMonsterBulletsButton;
            var peaModeBtn;
            var peaMonsterModeBTtn;
            var whiteRadishModeBtn;
            var goldImage;
            var zombieInHomeImage;

            var flowerFireLastTime = 0;
            var peaMonsterFireLastTime = 0;

            var mode = 'addPea';

            var zombieFactory = null;
            var bulletsFactory = null;

            var font = { font: '22px Arial', fill: '#fff' };

            function create() {

                game.add.tileSprite(0, 0, 1000, 800, 'grass');

                goldText = game.add.text(40, 10, gold, font);
                scoreText = game.add.text(game.world.centerX - 100, 10, scoreString + score, font);
                bulletText = game.add.text(game.world.width - 80, 10, numberOfBullets, font);
                redBulletText = game.add.text(game.world.width - 80, 40, numberOfRedBullets, font);
                monsterPeaBulletsText = game.add.text(game.world.width - 80, 70, numberOfMonsterPeaBullets, font);
                maxZombieInHomeText = game.add.text(40, game.world.height - 30, maxZombieInHome, font);

                availablePeaText = game.add.text(40, 50, peaAvailable, font);
                peaMonsterAvailableText = game.add.text(90, 50, peaMonsterAvailable, font);
                whiteRadishBombText = game.add.text(140, 50, whiteRadishBombAvailable, font);

                game.zombies = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'zombies');
                game.plants = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'plants');
                game.monsterPlants = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'monsterPlants');
                game.bullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'bullets');
                game.flowers = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'flowers');
                game.redBullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'redBullets');
                game.monsterBullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'monsterBullets');
                game.whiteRadishBombs = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'whiteRadishBombs');
                game.explosions = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'explosions');

                game.audio = {};
                game.audio.zombieDie = game.add.audio('zombieDie');
                game.audio.monsterLaugh = game.add.audio('monsterLaugh');
                game.audio.gamePlay = game.add.audio('gameAudio1');
                game.audio.zombiesCome = game.add.audio('zombiesCome');
                game.audio.zombieLaugh = game.add.audio('zombieLaugh');
                game.audio.shoot = game.add.audio('shoot');
                game.audio.hitZombie = game.add.audio('hitZombie');
                game.audio.explosion = game.add.audio('explosionAudio');

                buyBulletsButton = game.add.button(game.world.width - 120, 10, 'bullet', buyBullets, this);
                buyRedBulletsButton = game.add.button(game.world.width - 115, 40, 'redBullet', buyRedBullets, this);
                buyMonsterBulletsButton = game.add.button(game.world.width - 110, 70, 'monsterPeaBullet', buyMonsterBullets, this);
                peaModeBtn = game.add.button(10, 50, 'peaIcon', addPeaMode, this);
                peaMonsterModeBTtn = game.add.button(70, 50, 'peaMonsterIcon', addMonsterPeaMode, this);
                whiteRadishModeBtn = game.add.button(120, 50, 'whiteRadishIcon', addWhiteRadishMode, this);

                goldImage = game.add.image(10, 10, 'gold');
                zombieInHomeImage = game.add.image(10, game.world.height - 40, 'zombieInHome');

                zombieFactory = new ZombieFactory(game, 5);
                zombieFactory.init();

                bulletsFactory = new BulletsFactory(game);
                bulletsFactory.init();

                flower = this.game.flowers.create(this.game.world.width / 2 - 200, this.game.world.height / 2, 'flower');
                flower.anchor.setTo(0.5, 0.5);

                game.input.onTap.add(onTapFunc, this);

                game.audio.gamePlay.loop = true;
                game.audio.gamePlay.play();
            }

            function update() {

                fireFlower();

                if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                    fireMonsterPea();
                }

                game.physics.arcade.overlap(game.flowers, game.zombies, flowerKillZombie, null, this);
                game.physics.arcade.overlap(game.plants, game.zombies, peaDie, null, this);
                game.physics.arcade.overlap(game.monsterPlants, game.zombies, monsterPeaDie, null, this);
                game.physics.arcade.overlap(game.whiteRadishBombs, game.zombies, explosion, null, this);
                game.physics.arcade.overlap(game.bullets, game.zombies, hitZombie, null, this);
                game.physics.arcade.overlap(game.redBullets, game.zombies, hitZombie, null, this);
                game.physics.arcade.overlap(game.monsterBullets, game.zombies, hitZombie, null, this);
                updateInfo();
            }

            function updateInfo() {
                bulletText.text = numberOfBullets;
                goldText.text = gold;
                scoreText.text = scoreString + score;
                redBulletText.text = numberOfRedBullets;
                availablePeaText.text = peaAvailable;
                peaMonsterAvailableText.text = peaMonsterAvailable;
                monsterPeaBulletsText.text = numberOfMonsterPeaBullets;
                whiteRadishBombText.text = whiteRadishBombAvailable;
                maxZombieInHomeText.text = maxZombieInHome;
            }

            function onTapFunc() {
                switch (mode) {
                    case 'addPea': addPeaShooter();
                        break;
                    case 'addMonsterPea': addMonsterPeaShooter();
                        break;
                    case 'addWhiteRadish': addWhiteRadish();
                        break;
                    default: break;
                }
            }

            function addPeaMode() {
                mode = 'addPea';
            }

            function addMonsterPeaMode() {
                mode = 'addMonsterPea';
            }

            function addWhiteRadishMode() {
                mode = 'addWhiteRadish';
            }

            function addWhiteRadish() {

                if (whiteRadishBombAvailable <= 0 || gold < 50) {
                    return;
                }

                var x = game.input.activePointer.position.x;
                var y = game.input.activePointer.position.y;

                if (y > 100 && y <= game.world.height - 75) {
                    var whiteRadishBomb = game.whiteRadishBombs.create(x, y, 'whiteRadishBomb');
                    whiteRadishBombAvailable -= 1;
                    gold -= 50;
                }
            }

            function addPeaShooter() {

                var shootCounter = 0;

                if (peaAvailable <= 0  || gold < 100) {
                    return;
                }

                var x = game.input.activePointer.position.x;
                var y = game.input.activePointer.position.y;

                if (x <= game.world.width - 200 && x >= 100 && y > 100 && y <= game.world.height - 75) {
                    var pea = game.plants.create(x, y, 'pea');
                    peaAvailable -= 1;
                    gold -= 100;

                    pea.shootingInterval = window.setInterval(function () {
                        shootCounter += 1;
                        firePea(x, y);

                        if(shootCounter > 10) {
                            window.clearInterval(pea.shootingInterval);
                            game.plants.remove(pea);
                            peaAvailable += 1;
                        }

                    }, 750);
                }
            }

            function addMonsterPeaShooter() {
                if (peaMonsterAvailable <= 0 || gold < 500) {
                    return;
                }

                var x = game.input.activePointer.position.x;
                var y = game.input.activePointer.position.y;

                if (x <= 200) {
                    peaMonster = game.monsterPlants.create(x, y, 'peaMonster');
                    peaMonsterAvailable -= 1;
                    gold -= 500;
                }
            }

            function buyBullets() {

                if(gold < 100) {
                    return;
                }

                numberOfBullets += 100;
                gold -= 100;
            }

            function buyRedBullets() {

                if(gold < 100) {
                    return;
                }

                numberOfRedBullets += 100;
                gold -= 100;
            }

            function buyMonsterBullets() {

                if(gold < 300) {
                    return;
                }

                numberOfMonsterPeaBullets += 100;
                gold -= 300;
            }

            function firePea (shooterX, shooterY) {

                var bullet = game.bullets.getFirstDead();

                if (bullet === null || bullet === undefined){
                    return;
                }

                if(numberOfBullets <= 0) {
                    return;
                }

                bullet.revive();

                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;

                bullet.reset(shooterX + 30, shooterY + 10);

                bullet.body.velocity.x = bulletSpeed;
                bullet.body.velocity.y = 0;

                numberOfBullets -= 1;

                game.audio.shoot.play();
            }

            function fireFlower() {

                if(numberOfRedBullets <= 0){
                    return;
                }

                if (game.time.now > flowerFireLastTime) {

                    var bullet = game.redBullets.getFirstDead();
                    var zombie = game.zombies.children[0];

                    if (bullet && typeof zombie != "undefined"
                        && zombie.position.x < game.world.width) {

                        bullet.reset(game.world.width / 2 - 200, game.world.height / 2);
                        bullet.checkWorldBounds = true;
                        bullet.outOfBoundsKill = true;

                        game.physics.arcade.moveToObject(bullet, zombie, 500);

                        numberOfRedBullets -= 1;

                        game.audio.shoot.play();

                    }
                    flowerFireLastTime = game.time.now + 500;
                }
            }

            function fireMonsterPea() {

                if(peaMonsterAvailable == 1 || numberOfMonsterPeaBullets == 0) {
                    return;
                }

                if (game.time.now > peaMonsterFireLastTime)
                {
                    var bullet = game.monsterBullets.getFirstDead();

                    bullet.reset(peaMonster.position.x + 30, peaMonster.position.y + 30);

                    bullet.checkWorldBounds = true;
                    bullet.outOfBoundsKill = true;

                    game.physics.arcade.moveToPointer(bullet, 750);

                    game.audio.shoot.play();

                    peaMonsterFireLastTime = game.time.now + 200;

                    numberOfMonsterPeaBullets -= 1;
                }

            }

            function monsterPeaDie(plant, zombie) {
                if(zombie.isAlive) {
                    game.monsterPlants.remove(plant);
                    zombie.isAlive = false;
                    zombie.body.velocity.setTo(150, -150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    game.audio.zombieDie.play();
                    peaMonsterAvailable += 1;
                }
            }

            function peaDie(plant, zombie) {

                if(zombie.isAlive) {
                    plant.kill();
                    clearInterval(plant.shootingInterval);
                    zombie.isAlive = false;
                    zombie.body.velocity.setTo(150, -150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    game.audio.zombieDie.play();
                    peaAvailable += 1;
                }
            }

            function flowerKillZombie(flower, zombie) {
                if(zombie.isAlive) {
                    game.audio.zombieDie.play();
                    zombie.body.velocity.setTo(0, +150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    numberOfRedBullets = 0;
                    zombie.isAlive = false;
                }
            }

            function hitZombie (bullet, zombie) {

                if(!zombie.isAlive) {
                    return;
                }

                zombie.health -= bullet.damage;
                bullet.kill();

                if(zombie.health <= 0 && zombie.isAlive) {
                    game.audio.zombieDie.play();
                    zombie.body.velocity.setTo(0, +150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    var x = zombie.position.x;
                    var y = zombie.position.y;
                    flyPoints(100, x, y);
                    zombie.isAlive = false;
                }

                score += 10;
                game.audio.hitZombie.play();
            }

            function explosion(whiteRadish, zombie) {

                var explosion = game.explosions.getFirstDead();
                explosion.reset(whiteRadish.position.x - 50, whiteRadish.position.y - 50);
                explosion.frame = 0;
                var anim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 4, false);
                anim.killOnComplete = true;
                explosion.animations.play('explode');
                game.audio.explosion.play();

                whiteRadish.kill();
                whiteRadishBombAvailable += 1;
                var x = zombie.position.x;
                var y = zombie.position.y;
                flyPoints(100, x, y);
                zombie.isAlive = false;
                zombie.body.velocity.setTo(0, -150);
                game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
            }

            function zombieOut(zombie) {
                if(zombie.x <= 50 || zombie.y <= 10 || zombie.y >= game.world.height) {
                    if(zombie.y <= 10 || zombie.y >= game.world.height) {
                        gold += 20;
                        score += 100;
                    }else {
                        maxZombieInHome -= 1;
                    }
                    game.zombies.remove(zombie);
                }

            }

            function flyPoints(points, x, y) {
                x =  x || game.rnd.integerInRange(200, game.world.width - 200);
                y = y || game.rnd.integerInRange(200, game.world.height - 200);
                var pointsAdded = game.add.text(x, y, '+' + points,
                    { font: "28px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
                pointsAdded.anchor.set(0.5, 0.5);
                game.add.tween(pointsAdded).to({ alpha: 0, y: y-50 }, 1000, Phaser.Easing.Linear.None, true);
            }

        };

        return {
            getRating: getRating,
            startGame: startGame
        };

    }

    angular.module('gameApp.services')
        .factory('game', ['$http', '$q', 'baseUrl',  GameService]);

})();
