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
enemyInfo = {
    width: 40,
    height: 20,
    count: {
        row: 4,
        col: 9
    },
    offset: {
        top: 100,
        left: 60 
    },
    padding: 5
};

function preload() {
    //carregamento de imagens
    this.load.image("falcon", "assets/falcon.png")
    this.load.image("tief", "assets/tiefigther.png")
    this.load.image("laserA", "assets/laser_azul.png")
    this.load.image("deathstar", "assets/deathstar.png")
};

var score = 0;
var lives = 3;
var isStarted = false;
var barriers = [];
var figtherCount = 0;

function create() {
    //
    scene = this;
    //input movimento
    cursors = scene.input.keyboard.createCursorKeys();
    keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    isShooting = false;
    scene.input.keyboard.addCapture('SPACE');
    enemies = scene.physics.add.staticGroup();
    playerColi = scene.add.rectangle(0, 0, 800, 10, 0x000).setOrigin(0)
    figtherColi = scene.add.rectangle(0, 590, 800, 10, 0x000).setOrigin(0)
    deathstarColi = scene.add.rectangle(790, 0, 10, 600, 0x000).setOrigin(0)
    scene.physics.add.existing(playerColi)
    scene.physics.add.existing(figtherColi)
    scene.physics.add.existing(deathstarColi)

    falcon = scene.physics.add.sprite(400, 560, "falcon").setCollideWorldBounds(true);
    
    scoreText = scene.add.text(16, 16, "Score: " + score, { fontSize: '18px', fill: '#FFF' })
    livesText = scene.add.text(696, 16, "Lives: " + lives, { fontSize: '18px', fill: '#FFF' })

    scene.input.keyboard.on('keydown-SPACE', shoot);
};

function update() {
    //

};
