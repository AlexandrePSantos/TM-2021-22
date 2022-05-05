var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var enemyInfo = {
    width: 40,
    height: 20,
    count: {
        row: 5,
        col: 9
    },
    offset: {
        top: 100,
        left: 60
    },
    padding: 5
};

var move = new Howl({
    src: ['assets/move.mp3']
});

var shootSound = new Howl({
    src: ['assets/shoot.mp3']
});

var explosionSound = new Howl({
    src: ['assets/explosion.mp3']
});

var deathstarSound = new Howl({
    src: ['assets/deathstar.mp3'],
    loop: true
});

function preload() {
    this.load.image("mFalcon", "asset/falcon.png")
    this.load.image("alien", "asset/tief.png")
    this.load.image("bullet", "asset/laser_azul.png")
    this.load.image("deathstar", "asset/deathstar.png")
    this.load.image("background", "asset/back.jpg")
}

var score = 0;
var lives = 3;
var isStarted = false;
var figtherCount = 0;

function create() {
    this.add.image(400, 300, 'background');    
    scene = this;
    cursors = scene.input.keyboard.createCursorKeys();
    keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    isShooting = false;
    scene.input.keyboard.addCapture('SPACE');
    enemies = scene.physics.add.staticGroup();
    playerCollision = scene.add.rectangle(0, 0, 800, 10, 0x000).setOrigin(0)
    figtherCollision = scene.add.rectangle(0, 590, 800, 10, 0x000).setOrigin(0)
    deathstarCollision = scene.add.rectangle(790, 0, 10, 600, 0x000).setOrigin(0)
    scene.physics.add.existing(playerCollision)
    scene.physics.add.existing(figtherCollision)
    scene.physics.add.existing(deathstarCollision)

    player = scene.physics.add.sprite(400, 560, 'mFalcon');
    player.setCollideWorldBounds(true)

    scoreText = scene.add.text(16, 16, "Score: " + score, { fontSize: '18px', fill: '#FFF' })
    livesText = scene.add.text(696, 16, "Lives: " + lives, { fontSize: '18px', fill: '#FFF' })
    startText = scene.add.text(400, 300, "Click to Play", { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5)

    this.input.keyboard.on('keydown-SPACE', shoot);

    this.input.on('pointerdown', function () {
        if (isStarted == false) {
            isStarted = true;
            startText.destroy()
            setInterval(makedeathstar, 15000)

        } else {
            shoot()
        }
    });
    initEnemys()
}

function update() {
    if (isStarted == true) {
        if (cursors.left.isDown || keyA.isDown) {
            player.setVelocityX(-160);

        }
        else if (cursors.right.isDown || keyD.isDown) {
            player.setVelocityX(160);

        }
        else {
            player.setVelocityX(0);

        }
    }
}

function shoot() {
    if (isStarted == true) {
        if (isShooting === false) {
            manageBullet(scene.physics.add.sprite(player.x, player.y, "bullet"))
            isShooting = true;
            shootSound.play()
        }
    }
}

function initEnemys() {
    for (c = 0; c < enemyInfo.count.col; c++) {
        for (r = 0; r < enemyInfo.count.row; r++) {
            var enemyX = (c * (enemyInfo.width + enemyInfo.padding)) + enemyInfo.offset.left;
            var enemyY = (r * (enemyInfo.height + enemyInfo.padding)) + enemyInfo.offset.top;
            enemies.create(enemyX, enemyY, 'alien').setOrigin(0.5);
        }
    }
}

setInterval(moveenemies, 1000)
var xTimes = 0;
var yTimes = 0;
var dir = "right"
function moveenemies() {
    if (isStarted === true) {
        move.play()
        if (xTimes === 20) {
            if (dir === "right") {
                dir = "left"
                xTimes = 0
            } else {
                dir = "right"
                xTimes = 0
            }
        }
        if (dir === "right") {
            enemies.children.each(function (enemy) {

                enemy.x = enemy.x + 10;
                enemy.body.reset(enemy.x, enemy.y);

            }, this);
            xTimes++;
        } else {
            enemies.children.each(function (enemy) {

                enemy.x = enemy.x - 10;
                enemy.body.reset(enemy.x, enemy.y);

            }, this);
            xTimes++;

        }
    }
}

function manageBullet(bullet) {
    bullet.setVelocityY(-380);


    var i = setInterval(function () {
        enemies.children.each(function (enemy) {

            if (checkOverlap(bullet, enemy)) {
                bullet.destroy();
                clearInterval(i)
                isShooting = false
                enemy.destroy()
                score++;
                scoreText.setText("Score: " + score);

                explosionSound.play()

                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Win")
                }
            }

        }, this);
        for (var step = 0; step < barriers.length; step++) {
            if (barriers[step].checkCollision(bullet)) {
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                scoreText.setText("Score: " + score);


                explosionSound.play()

                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Win")
                }


            }
        }

        for (var step = 0; step < deathstars.length; step++) {
            var deathstar = deathstars[step];
            if (checkOverlap(bullet, deathstar)) {
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                scoreText.setText("Score: " + score);


                explosionSound.play()

                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Win")
                }

                deathstar.destroy()
                deathstar.isDestroyed = true;
                deathstarSound.stop();
                score++;
                ufoCount++;
            }
        }
    }, 10)
    scene.physics.add.overlap(bullet, playerCollision, function () {
        bullet.destroy();
        clearInterval(i);
        explosionSound.play();
        isShooting = false
    })

}
var enemyBulletVelo = 200;
function manageEnemyBullet(bullet, enemy) {
    var angle = Phaser.Math.Angle.BetweenPoints(enemy, player);
    scene.physics.velocityFromRotation(angle, enemyBulletVelo, bullet.body.velocity);
    enemyBulletVelo = enemyBulletVelo + 2
    var i = setInterval(function () {

        if (checkOverlap(bullet, player)) {
            bullet.destroy();
            clearInterval(i);
            lives--;
            livesText.setText("Lives: " + lives);
            explosionSound.play()

            if (lives == 0) {
                end("Lose")
            }
        }
        for (var step = 0; step < barriers.length; step++) {
            if (barriers[step].checkCollision(bullet)) {
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                scoreText.setText("Score: " + score);


                explosionSound.play()

                if (score === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Win")
                }
            }
        }
    }, 10)
    scene.physics.add.overlap(bullet, figtherCollision, function () {
        bullet.destroy();
        explosionSound.play();
        clearInterval(i);
    })

}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}

//Enemy Fire
setInterval(enemyFire, 3000)

function enemyFire() {
    if (isStarted === true) {
        var enemy = enemies.children.entries[Phaser.Math.Between(0, enemies.children.entries.length - 1)];
        manageEnemyBullet(scene.physics.add.sprite(enemy.x, enemy.y, "bullet"), enemy)
    }
}

//Flying deathstars



var deathstars = [];
function makedeathstar() {
    if (isStarted == true) {
        managedeathstar(scene.physics.add.sprite(0, 60, "deathstar"));
    }
}

setInterval(function () {
    if (isStarted == true) {
        for (var i = 0; i < deathstars.length; i++) {
            var deathstar = deathstars[i];
            if (deathstar.isDestroyed == false) {
                manageEnemyBullet(scene.physics.add.sprite(deathstar.x, deathstar.y, "bullet"), deathstar)

            } else {
                deathstars.splice(i, 1);
            }
        }
    }

}, 2000)

function managedeathstar(deathstar) {
    deathstars.push(deathstar);
    deathstar.isDestroyed = false;
    deathstar.setVelocityX(100);
    scene.physics.add.overlap(deathstar, deathstarCollision, function () {
        deathstar.destroy()
        deathstar.isDestroyed = true;
        deathstarSound.stop()
    })
    deathstarSound.play()
}

//Barriers
class Barrier {
    constructor(scene, gx, y) {
        var x = gx;
        var y = y;
        this.children = [];
        this.scene = scene;

        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                var child = scene.add.rectangle(x, y, 30, 20, 0x1ff56);
                scene.physics.add.existing(child);
                child.health = 2;
                this.children.push(child)
                x = x + child.displayWidth;
            }
            x = gx;
            y = y + child.displayHeight;
        }

        this.children[this.children.length-2].destroy();
        this.children.splice(this.children.length-2, 1);        
    }
    checkCollision(sprite) {
        var isTouching = false;
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (checkOverlap(sprite, child)) {
                isTouching = true;

                if (this.children[i].health === 1) {
                    child.destroy();
                    this.children.splice(i, 1);

                } else {
                    this.children[i].health--;

                }
                break;
            }
        }
        return isTouching;
    }
}

function end(con) {
    explosionSound.stop();
    deathstarSound.stop();
    shootSound.stop();
    move.stop()

    alert(`You ${con}! Score: ` + score);
    location.reload()

}