var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "jogo",
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
}

function preload() {
    //

};

function create() {
    //

};

function update() {
    //

};
