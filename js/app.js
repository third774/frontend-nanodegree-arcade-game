var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
var Resources = (function () {
    function Resources(global) {
        this.window = global;
        this.resourceCache = {};
        this.loading = [];
        this.readyCallbacks = [];
        window['Resources'] = this;
    }
    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    Resources.prototype.load = function (urlOrArr) {
        var self = this;
        if (urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function (url) {
                self._load(url);
            });
        }
        else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            self._load(urlOrArr);
        }
    };
    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    Resources.prototype._load = function (url) {
        var self = this;
        if (self.resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return self.resourceCache[url];
        }
        else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function () {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                self.resourceCache[url] = img;
                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if (self.isReady()) {
                    self.readyCallbacks.forEach(function (callback) {
                        callback.func.call(callback.thisRef);
                    });
                }
            };
            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            self.resourceCache[url] = false;
            img.src = url;
        }
    };
    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    Resources.prototype.get = function (url) {
        return this.resourceCache[url];
    };
    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    Resources.prototype.isReady = function () {
        var ready = true;
        for (var k in this.resourceCache) {
            if (this.resourceCache.hasOwnProperty(k) &&
                !this.resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    };
    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    Resources.prototype.onReady = function (callback, thisRef, args) {
        var callbackParams = {
            func: callback,
            thisRef: thisRef,
            args: args || []
        };
        this.readyCallbacks.push(callbackParams);
    };
    return Resources;
}());
/// <reference path="Resources.ts" />
var Engine = (function () {
    /**
     *
     */
    function Engine(global) {
        var e = this;
        e.doc = global.document;
        e.win = global.window;
        e.canvas = e.doc.createElement('canvas');
        e.ctx = e.canvas.getContext('2d');
        e.resources = new Resources(global);
        e.canvas.width = 505;
        e.canvas.height = 606;
        e.doc.body.appendChild(e.canvas);
        /* Go ahead and load all of the images we know we're going to need to
        * draw our game level. Then set init as the callback method, so that when
        * all of these images are properly loaded our game will start.
        */
        this.resources.load([
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',
            'images/char-boy.png'
        ]);
        this.resources.onReady(this.init, this);
        /* Assign the canvas' context object to the global variable (the window
        * object when run in a browser) so that developers can use it more easily
        * from within their app.js files.
        */
        global.ctx = e;
    }
    Engine.prototype.main = function () {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(), dt = (now - this.lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        this.update(dt);
        this.render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        this.lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        this.win.requestAnimationFrame(this.main.bind(this));
    };
    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    Engine.prototype.init = function () {
        this.reset();
        this.lastTime = Date.now();
        this.player = new Player(this);
        this.allEnemies = this.generateEnemies(4);
        this.main();
    };
    Engine.prototype.generateEnemies = function (numEnemies) {
        var allEnemies = [];
        for (var i = 0; i < numEnemies; i++) {
            var enemy = new Enemy(this);
            allEnemies.push(enemy);
        }
        return allEnemies;
    };
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    Engine.prototype.update = function (dt) {
        this.updateEntities(dt);
        // checkCollisions();
    };
    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    Engine.prototype.updateEntities = function (dt) {
        this.allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        this.player.update(dt * 3);
    };
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    Engine.prototype.render = function () {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
            'images/water-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png' // Row 2 of 2 of grass
        ], numRows = 6, numCols = 5, row, col;
        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                this.ctx.drawImage(this.resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        this.renderEntities();
    };
    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    Engine.prototype.renderEntities = function () {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        this.allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        this.player.render();
    };
    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    Engine.prototype.reset = function () {
        // noop
    };
    return Engine;
}());
/// <reference path="./Engine.ts" />
var Sprite = (function () {
    /**
     *
     */
    function Sprite(config) {
        this.engine = config.engine;
        this.spriteImage = config.spriteImage;
    }
    Sprite.prototype.render = function () {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
    ;
    return Sprite;
}());
/// <reference path="./Sprite.ts" />
// Enemies our player must avoid
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    /**
     * Comment goes here
     */
    function Enemy(engine) {
        var config = {
            engine: engine,
            // The image/sprite for our enemies, this uses
            // a helper we've provided to easily load images
            spriteImage: 'images/enemy-bug.png'
        };
        // Call the Sprite constructor passing in config
        _super.call(this, config);
        // Do more stuff here?        
    }
    Enemy.prototype.update = function (dt) {
        // do stuff
    };
    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function () {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
    ;
    return Enemy;
}(Sprite));
/// <reference path="./Sprite.ts" />
// The Player
var Player = (function (_super) {
    __extends(Player, _super);
    /**
     *
     */
    function Player(engine) {
        var config = {
            engine: engine,
            // The image/sprite for our enemies, this uses
            // a helper we've provided to easily load images
            spriteImage: 'images/char-boy.png'
        };
        // Call the Sprite constructor passing in config
        _super.call(this, config);
        // Do more stuff here?        
    }
    Player.prototype.update = function (dt) {
        // do stuff
    };
    // Draw the player on the screen, required method for game
    Player.prototype.render = function () {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
    ;
    Player.prototype.handleInput = function (input) {
    };
    return Player;
}(Sprite));
var ControlKeys;
(function (ControlKeys) {
    ControlKeys[ControlKeys["left"] = 37] = "left";
    ControlKeys[ControlKeys["up"] = 38] = "up";
    ControlKeys[ControlKeys["right"] = 39] = "right";
    ControlKeys[ControlKeys["down"] = 40] = "down";
})(ControlKeys || (ControlKeys = {}));
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
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    engine.player.handleInput(allowedKeys[e.keyCode]);
});
//# sourceMappingURL=app.js.map