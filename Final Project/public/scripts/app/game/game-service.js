(function(){
    "use strict";

    function GameService($http, $q, baseUrl, identity) {

        function getRating() {
            var deferred = $q.defer();

            $http.get(baseUrl + '/api/v1/scores')
                .then(function (response){
                    deferred.resolve(response);
                }, function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function sendResult(user) {
            var deferred = $q.defer();

            console.log('Send user id: ' + user.id + 'user last score: ' + user.lastScore);

            $http.put(baseUrl + '/api/v1/update/results',
                {
                    id: user.id,
                    lastScore: user.lastScore
                })
                .then(function(response){
                    console.log(response);
                    deferred.resolve(response);
                }, function (err) {
                    deferred.reject(err);
                });

            return deferred.promise;
        }

        function startGame(user) {

            user = user || 'guest';

            console.log(user);

            var gold = user.gold || 500;
            var score = 0;
            var bulletSpeed = 500;
            var numberOfBullets = 100;
            var numberOfRedBullets = 100;
            var numberOfMonsterPeaBullets = 100;
            var peaAvailable = 5;
            var peaMonsterAvailable = 1;
            var whiteRadishBombAvailable = 3;
            var whiteRadishBombActive = 0;
            var cobCannonAvailable = 1;
            var maxZombieInHome = 10;
            var nextSprite = 0;
            var peaMonster;
            var explosions;
            var flower;
            var isGetBonus = false;

            var scoreString = 'SCORE: ';
            var scoreText;
            var bulletText;
            var redBulletText;
            var monsterPeaBulletsText;
            var goldText;
            var availablePeaText;
            var peaMonsterAvailableText;
            var cobCannonAvailableText;
            var whiteRadishBombText;
            var maxZombieInHomeText;
            var stateText;
            var gameState = ' ';

            var buyBulletsButton;
            var buyRedBulletsButton;
            var buyMonsterBulletsButton;
            var peaModeBtn;
            var peaMonsterModeBTtn;
            var whiteRadishModeBtn;
            var cobCannonModeBtn;
            var goldImage;
            var zombieInHomeImage;

            var flowerFireLastTime = 0;
            var peaMonsterFireLastTime = 0;

            var mode = '';

            var zombieFactory = null;
            var bulletsFactory = null;

            var font = { font: '22px Inconsolata', fill: '#fff' };
            var stateFont = { font: '48px Inconsolata', fill: '#fff'};

            var ZombieFactory = function(game){

                this.game = game;

                this.health = 5;

                this.quantity = 1;

                this.nextLaughInterval = 5000;

                this.nextLaugh = 0;

                this.nextZombieInterval = 10000;

                this.zombieVelocity = -30;
            };

            ZombieFactory.prototype = {

                createZombie: function(game) {

                    if(maxZombieInHome <= 0) {
                        return;
                    }

                    if(this.game.time.now > nextSprite) {
                        this.quantity += 1;

                        if(this.quantity == 10) {
                            this.zombieVelocity -= 5;
                        }
                        else if(this.quantity == 20) {
                            this.quantity = 5;
                            this.nextZombieInterval -= 1000;
                            this.health += 1;
                            this.zombieVelocity -= 5;
                        }

                        if(this.nextZombieInterval <= 1000) {
                            gameState = 'victory';
                            victory();
                        }

                        for(var i = 0; i < this.quantity; i++) {
                            var x = game.rnd.integerInRange(game.world.width, game.world.width + 200);
                            var y = game.rnd.integerInRange(130, game.world.height - 100);

                            var zombie = game.zombies.create(x, y, 'walkingZombie');
                            zombie.anchor.setTo(0.5, 0.5);

                            zombie.checkWorldBounds = true;
                            zombie.events.onOutOfBounds.add(zombieOut, this);

                            zombie.isAlive = true;
                            zombie.health = this.health;
                            zombie.body.velocity.setTo(this.zombieVelocity, 0);

                            zombie.animations.add('zombieWalk', [0, 1, 2, 3, 4, 5], 5, true);
                            zombie.animations.play('zombieWalk');
                        }

                        if(this.quantity % 3 == 0) {
                            game.audio.zombiesCome.play();
                        }

                        nextSprite = game.time.now + this.nextZombieInterval;
                    }

                    if(game.time.now > this.nextLaugh) {
                        game.audio.zombieLaugh.play();
                        this.nextLaugh = game.time.now + this.nextLaughInterval;
                    }
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
                    monsterPeaBullet.damage = this.DAMAGE + 1;
                    monsterPeaBullet.kill();
                },
                createExplosions: function () {
                    var explosion = this.game.explosions.create(0, 0, 'explosion');
                    explosion.kill();
                }
            }

            var game = new Phaser.Game(930, 550, Phaser.AUTO, 'game-container', {
                preload: preload,
                create: create,
                update: update
            });

            function preload() {

                var basePathImage = 'assets/game/images/';
                var basePathAudio = 'assets/game/sounds/';

                game.load.image('grass', basePathImage + 'grass.png');
                game.load.image('zombie', basePathImage + 'zombie.png');
                game.load.image('pea', basePathImage + 'pea2.png');
                game.load.image('bullet', basePathImage + 'bullet.png');
                game.load.image('flower', basePathImage + 'flower.png');
                game.load.image('redBullet', basePathImage + 'bullet-red.png');
                game.load.image('monsterPeaBullet', basePathImage + 'blue-bullet2.png');
                game.load.image('buyBulletsBtn', basePathImage + 'coin_buy.png');
                game.load.image('gold', basePathImage + 'gold-box.png');
                game.load.image('peaIcon', basePathImage + 'pea-icon.png');
                game.load.image('peaMonsterIcon', basePathImage + 'pea-monster-icon.png');
                game.load.image('redBulletIcon', basePathImage + 'bullet-red-icon.png');
                game.load.image('peaMonster', basePathImage + 'pea-monster.png');
                game.load.image('whiteRadishBomb', basePathImage + 'white-radish-bomb.png');
                game.load.image('whiteRadishIcon', basePathImage + 'white-radish-icon.png');
                game.load.image('cobCannon', basePathImage + 'cob-cannon-01.png');
                game.load.image('cobCannonIcon', basePathImage + 'cob-cannon-icon.png');
                game.load.image('zombieInHome', basePathImage + 'zombie-in-home.png');
                game.load.spritesheet('explosion', basePathImage + 'explode.png', 128, 128);
                game.load.spritesheet('walkingZombie', basePathImage + 'walking-zombie-01.png', 65, 65);


                game.load.audio('zombieDie', basePathAudio + 'zombieInPain.mp3');
                game.load.audio('monsterLaugh', basePathAudio + 'monsterLaugh');
                game.load.audio('gameAudio1', basePathAudio + 'cerebrawl.mp3');
                game.load.audio('gameAudio2', basePathAudio + 'watery-graves.mp3');
                game.load.audio('zombiesCome', basePathAudio + 'monsterGrowl.mp3');
                game.load.audio('zombieLaugh', basePathAudio + 'zombieLaugh.mp3');
                game.load.audio('shoot', basePathAudio + 'shoot.ogg');
                game.load.audio('hitZombie', basePathAudio + 'hitZombie.ogg');
                game.load.audio('explosionAudio', basePathAudio + 'explosion.mp3');
            }

            function create() {

                game.add.tileSprite(0, 0, 930, 550, 'grass');

                /*userText = game.add.text(game.world.width - user.length * 15,
                    game.world.height - 30, user, font);*/
                goldText = game.add.text(45, 15, gold, font);
                scoreText = game.add.text(game.world.centerX, 15, scoreString + score, font);
                scoreText.anchor.setTo(0.5, 0);
                bulletText = game.add.text(game.world.width - 80, 15, numberOfBullets, font);
                redBulletText = game.add.text(game.world.width - 80, 45, numberOfRedBullets, font);
                monsterPeaBulletsText = game.add.text(game.world.width - 80, 75, numberOfMonsterPeaBullets, font);
                maxZombieInHomeText = game.add.text(40, game.world.height - 40, maxZombieInHome, font);
                availablePeaText = game.add.text(40, 55, peaAvailable, font);
                peaMonsterAvailableText = game.add.text(95, 55, peaMonsterAvailable, font);
                cobCannonAvailableText = game.add.text(215, 55, cobCannonAvailable, font);
                whiteRadishBombText = game.add.text(145, 55, whiteRadishBombAvailable, font);
                stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', stateFont);
                stateText.anchor.setTo(0.5, 0.5);
                stateText.visible = false;

                game.zombies = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'zombies');
                game.plants = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'plants');
                game.monsterPlants = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'monsterPlants');
                game.bullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'bullets');
                game.flowers = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'flowers');
                game.redBullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'redBullets');
                game.monsterBullets = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'monsterBullets');
                game.whiteRadishBombs = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'whiteRadishBombs');
                game.explosions = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'explosions');
                game.cobCannons = game.add.physicsGroup(Phaser.Physics.ARCADE, game.world, 'cobCannons');

                game.audio = {};
                game.audio.zombieDie = game.add.audio('zombieDie');
                game.audio.monsterLaugh = game.add.audio('monsterLaugh');
                game.audio.gamePlay = game.add.audio('gameAudio2');
                game.audio.gameOverAudio = game.add.audio('gameAudio1');
                game.audio.zombiesCome = game.add.audio('zombiesCome');
                game.audio.zombieLaugh = game.add.audio('zombieLaugh');
                game.audio.shoot = game.add.audio('shoot');
                game.audio.hitZombie = game.add.audio('hitZombie');
                game.audio.explosion = game.add.audio('explosionAudio');

                buyBulletsButton = game.add.button(game.world.width - 120, 15, 'bullet', buyBullets, this);
                buyRedBulletsButton = game.add.button(game.world.width - 115, 45, 'redBullet', buyRedBullets, this);
                buyMonsterBulletsButton = game.add.button(game.world.width - 110, 75, 'monsterPeaBullet', buyMonsterBullets, this);
                peaModeBtn = game.add.button(10, 50, 'peaIcon', addPeaMode, this);
                peaMonsterModeBTtn = game.add.button(70, 50, 'peaMonsterIcon', addMonsterPeaMode, this);
                whiteRadishModeBtn = game.add.button(120, 50, 'whiteRadishIcon', addWhiteRadishMode, this);
                cobCannonModeBtn = game.add.button(170, 50, 'cobCannonIcon', addCobCannonMode, this);

                goldImage = game.add.image(10, 10, 'gold');
                zombieInHomeImage = game.add.image(10, game.world.height - 40, 'zombieInHome');

                zombieFactory = new ZombieFactory(game);

                bulletsFactory = new BulletsFactory(game);
                bulletsFactory.init();

                flower = this.game.flowers.create(this.game.world.width / 2 - 200, this.game.world.height / 2, 'flower');
                flower.anchor.setTo(0.5, 0.5);

                game.input.onTap.add(onTapFunc, this);

                game.audio.gamePlay.loop = true;
                game.audio.gamePlay.play();
            }

            function update() {

                if(gameState == 'gameOver' || gameState == 'victory') {
                    clearField();
                }

                zombieFactory.createZombie(game);

                fireFlower();

                if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                    fireMonsterPea();
                }

                game.physics.arcade.overlap(game.flowers, game.zombies, zombieOverlapFlower, null, this);
                game.physics.arcade.overlap(game.plants, game.zombies, zombieOverlapPea, null, this);
                game.physics.arcade.overlap(game.monsterPlants, game.zombies, zombieOverlapMonster, null, this);
                game.physics.arcade.overlap(game.whiteRadishBombs, game.zombies, explosion, null, this);
                game.physics.arcade.overlap(game.bullets, game.zombies, hitZombie, null, this);
                game.physics.arcade.overlap(game.redBullets, game.zombies, hitZombie, null, this);
                game.physics.arcade.overlap(game.monsterBullets, game.zombies, hitZombie, null, this);
                game.physics.arcade.overlap(game.cobCannons, game.zombies, cobCannonOverlapZombie, null, this);

                updateInfo();

                changeIsGetBonus();
            }

            function updateInfo() {
                goldText.text = gold;
                scoreText.text = scoreString + score;
                bulletText.text = numberOfBullets;
                redBulletText.text = numberOfRedBullets;
                monsterPeaBulletsText.text = numberOfMonsterPeaBullets;
                availablePeaText.text = peaAvailable;
                peaMonsterAvailableText.text = peaMonsterAvailable;
                cobCannonAvailableText.text = cobCannonAvailable;
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
                    case 'addCobCannon': addCobCannon();
                    default:
                        break;
                }
            }

            //add mode

            function addPeaMode() {

                if(mode != 'disable') {
                    mode = 'addPea';
                }
            }

            function addMonsterPeaMode() {

                if(mode != 'disable') {
                    mode = 'addMonsterPea';
                }
            }

            function addWhiteRadishMode() {

                if(mode != 'disable') {
                    mode = 'addWhiteRadish';
                }
            }

            function addCobCannonMode() {

                if(mode != 'disable') {
                    mode = 'addCobCannon';
                }
            }

            //add shooter

            function addCobCannon() {

                if(cobCannonAvailable <= 0 || gold < 200) {
                    return;
                }

                var x = game.input.activePointer.position.x;
                var y = game.input.activePointer.position.y;

                if(x < 200 && y > 130 && y < game.world.height - 130){
                    var cobCannon = game.cobCannons.create(x, y, 'cobCannon');
                    cobCannon.anchor.setTo(0.5, 0.5);
                    game.add.tween(cobCannon).to({x: game.world.width + 200}, 2500, Phaser.Easing.Linear.None, true);
                    cobCannon.checkWorldBounds = true;
                    cobCannon.events.onOutOfBounds.add(cobCannonOut, this);
                    cobCannonAvailable -= 1;
                    gold -= 200;
                }
            }

            function addWhiteRadish() {

                if (whiteRadishBombAvailable <= 0 || gold < 50) {
                    return;
                }

                var x = game.input.activePointer.position.x;
                var y = game.input.activePointer.position.y;

                if (y > 130 && y <= game.world.height - 75) {
                    var whiteRadishBomb = game.whiteRadishBombs.create(x, y, 'whiteRadishBomb');
                    whiteRadishBomb.anchor.setTo(0.5, 0.5);
                    whiteRadishBombAvailable -= 1;
                    whiteRadishBombActive += 1;
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
                    pea.anchor.setTo(0.5, 0.5);
                    pea.shootCounter = 0;
                    peaAvailable -= 1;
                    gold -= 50;

                    pea.shootingInterval = window.setInterval(function () {
                        shootCounter += 1;
                        firePea(x, y);

                        if(shootCounter > 20) {
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
                    peaMonster.anchor.setTo(0.5, 0.5);
                    peaMonsterAvailable -= 1;
                    gold -= 500;
                }
            }

            //buy bullets

            function buyBullets() {

                if(mode == 'disable') {
                    return;
                }

                if(gold < 100) {
                    return;
                }

                numberOfBullets += 100;
                gold -= 100;
            }

            function buyRedBullets() {

                if(mode == 'disable') {
                    return;
                }

                if(gold < 100) {
                    return;
                }

                numberOfRedBullets += 100;
                gold -= 100;
            }

            function buyMonsterBullets() {

                if(mode == 'disable') {
                    return;
                }

                if(gold < 300) {
                    return;
                }

                numberOfMonsterPeaBullets += 100;
                gold -= 300;
            }

            //fire

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
                bullet.reset(shooterX + 10, shooterY - 20);
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
                        && zombie.position.x < game.world.width && zombie.isAlive) {

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
                    bullet.reset(peaMonster.position.x + 10, peaMonster.position.y);
                    bullet.checkWorldBounds = true;
                    bullet.outOfBoundsKill = true;
                    game.physics.arcade.moveToPointer(bullet, 750);
                    game.audio.shoot.play();
                    peaMonsterFireLastTime = game.time.now + 200;
                    numberOfMonsterPeaBullets -= 1;
                }

            }

            //collisions

            function zombieOverlapMonster(monsterPea, zombie) {

                if(zombie.isAlive) {
                    game.monsterPlants.remove(monsterPea);
                    zombie.isAlive = false;
                    zombie.body.velocity.setTo(150, -150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    game.audio.zombieDie.play();
                    peaMonsterAvailable += 1;
                }
            }

            function zombieOverlapPea(plant, zombie) {

                if(zombie.isAlive) {
                    plant.kill();
                    clearInterval(plant.shootingInterval);
                    zombie.isAlive = false;
                    zombie.body.velocity.setTo(-150, -150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    game.audio.zombieDie.play();
                    peaAvailable += 1;
                }
            }

            function zombieOverlapFlower(flower, zombie) {

                if(zombie.isAlive) {
                    game.audio.zombieDie.play();
                    zombie.body.velocity.setTo(-150, -150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    numberOfRedBullets = 0;
                    zombie.isAlive = false;
                }
            }

            function hitZombie (bullet, zombie) {

                var x = zombie.position.x;
                var y = zombie.position.y;

                if(!zombie.isAlive || x >= game.world.width) {
                    return;
                }

                zombie.health -= bullet.damage;
                bullet.kill();

                if(zombie.health <= 0 && zombie.isAlive) {
                    game.audio.zombieDie.play();
                    zombie.body.velocity.setTo(0, +150);
                    game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                    flyTexts(100, x, y);
                    zombie.isAlive = false;
                    score += 100;
                    gold += 20;
                }

                if(!isGetBonus) {
                    getBonus();
                }

                game.audio.hitZombie.play();
            }

            function  cobCannonOverlapZombie(cobCannon, zombie) {

                if(!zombie.isAlive || zombie.position.x >= game.world.width) {
                    return;
                }

                game.audio.zombieDie.play();
                zombie.body.velocity.setTo(0, +150);
                game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
                var x = zombie.position.x;
                var y = zombie.position.y;
                score += 100;
                gold += 20;
                if(!isGetBonus) {
                    getBonus();
                }
                flyTexts(100, x, y);
                zombie.isAlive = false;
            }

            function explosion(whiteRadish, zombie) {
                var explosion,
                    anim,
                    x,
                    y;

                if(!zombie.isAlive) {
                   return;
                }

                explosion = game.explosions.getFirstDead();
                explosion.reset(whiteRadish.position.x - 50, whiteRadish.position.y - 50);
                explosion.frame = 0;
                anim = explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 4, false);
                anim.killOnComplete = true;
                explosion.animations.play('explode');
                game.audio.explosion.play();
                whiteRadish.kill();

                whiteRadishBombAvailable += 1;

                if(whiteRadishBombAvailable + whiteRadishBombActive >= 4) {
                    whiteRadishBombActive -= 1;
                    whiteRadishBombAvailable = 3 - whiteRadishBombActive;
                }


                x = zombie.position.x;
                y = zombie.position.y;
                score += 100;
                gold += 20;
                flyTexts(100, x, y);
                zombie.isAlive = false;
                zombie.body.velocity.setTo(0, -150);
                game.add.tween(zombie).to( { angle: 3600 }, 10000, Phaser.Easing.Linear.None, true);
            }



            function zombieOut(zombie) {

                if(zombie.x <= 0 || zombie.y <= 10 || zombie.y >= game.world.height) {

                    if(zombie.x <= 0){

                        if(gameState != 'gameOver') {
                            maxZombieInHome -= 1;

                            if(maxZombieInHome < 1) {
                                maxZombieInHome = 0;
                                gameState = 'gameOver';
                                gameOver();
                            }
                        }
                    }

                    game.zombies.remove(zombie);
                }

            }

            function cobCannonOut(cobCannon) {
                cobCannonAvailable += 1;
                game.cobCannons.remove(cobCannon);
            }

            function flyTexts(text, x, y) {
                x =  x || game.rnd.integerInRange(200, game.world.width - 200);
                y = y || game.rnd.integerInRange(200, game.world.height - 200);
                var textAdded = game.add.text(x, y, '+' + text,
                    { font: "28px Inconsolata", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
                textAdded.anchor.set(0.5, 0.5);
                game.add.tween(textAdded).to({ alpha: 0, y: y-50 }, 1000, Phaser.Easing.Linear.None, true);
            }

            function clearField() {
                game.zombies.forEach(function(zombie){
                    game.zombies.remove(zombie);
                }, this);
                game.whiteRadishBombs.forEach(function(whiteRadish) {
                    game.whiteRadishBombs.remove(whiteRadish);
                }, this);
                game.plants.forEach(function (plant) {
                    game.plants.remove(plant)
                }, this);
                game.monsterPlants.forEach(function (monster) {
                    game.monsterPlants.remove(monster);
                }, this);
            }

            function gameOver() {

                stateText.text = 'GAME OVER';
                stateText.visible = true;
                game.audio.gamePlay.stop();
                game.audio.gameOverAudio.play();
                mode = 'disable';
                sendResult({
                    id: user.id,
                    lastScore: score
                });
            }

            function victory() {

                stateText.text = 'YOU WIN';
                stateText.visible = true;
                game.audio.gamePlay.stop();
                mode = 'disable';
                sendResult({
                    id: user.id,
                    lastScore: score
                });
            }

            function getBonus() {

                switch (score) {
                    case 1000:
                        gold += 100;
                        flyTexts('100 GOLD', game.world.width / 2, game.world.height / 2);
                        isGetBonus = true;
                        break;
                    case 2500:
                        gold += 250;
                        flyTexts('250 GOLD', game.world.width / 2, game.world.height / 2);
                        isGetBonus = true;
                        break;
                    case 10000:
                        gold += 500;
                        flyTexts('500 GOLD', game.world.width / 2, game.world.height / 2);
                        isGetBonus = true;
                        break;
                    case 20000:
                        gold += 1000;
                        flyTexts('1000 GOLD', game.world.width / 2, game.world.height / 2);
                        isGetBonus = true;
                        break;
                    case 50000:
                        gold += 2000;
                        flyTexts('2000 GOLD', game.world.width / 2, game.world.height / 2);
                        isGetBonus = true;
                        break;
                    default:
                        break;
                }
            }

            function changeIsGetBonus() {
                switch (score) {
                    case 1100:
                        isGetBonus = false;
                        break;
                    case 2600:
                        isGetBonus = false;
                        break;
                    case 10100:
                        isGetBonus = false;
                        break;
                    case 20100:
                        isGetBonus = false;
                        break;
                    case 50100:
                        isGetBonus = false;
                        break;
                    default:
                        break;
                }
            }
        };

        return {
            getRating: getRating,
            startGame: startGame
        };

    }

    angular.module('gameApp.services')
        .factory('game', ['$http', '$q', 'baseUrl', 'identity',  GameService]);

})();
