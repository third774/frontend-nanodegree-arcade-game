/// <reference path="./Engine.ts" />
/// <reference path="./Enemy.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Enums.ts" />



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var engine = new Engine(this);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    
    engine.player.handleInput(allowedKeys[e.keyCode]);
});
