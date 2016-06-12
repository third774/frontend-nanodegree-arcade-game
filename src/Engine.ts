/// <reference path="Resources.ts" />

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 */

class Engine {
    doc: Document;
    win: Window;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    allEnemies: Array<Enemy>;
    player: Player;
    resources: Resources;
    lastTime;

    /**
     * The Game Engine
     */
    constructor(global: any) {
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

    private main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - this.lastTime) / 1000.0;

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
    }

    private bindKeys() {
        var self = this;
        // This listens for key presses and sends the keys to your
        // Player.handleInput() method. You don't need to modify this.
        this.doc.addEventListener('keyup', function (event) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',
                32: 'space'
            };
            self.handleInput(allowedKeys[event.keyCode]);
        });
    }

    private handleInput(input: string) {
        switch (input) {
            case 'up':
                if (this.player.y > 0) this.player.up();
                break;
            case 'down':
                if (this.player.y < 5) this.player.down();
                break;
            case 'left':
                if (this.player.x > 0) this.player.left();
                break;
            case 'right':
                if (this.player.x < 4) this.player.right();
                break;
            case 'space':
                console.log('space');

                this.reset();
                break;
            default:
                break;
        }
    }
    /**
     * This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    private init() {
        this.lastTime = Date.now();
        this.player = new Player(this);
        //this.reset();
        this.allEnemies = this.generateEnemies(4);
        this.main();
        this.bindKeys();
    }

    /** Returns an Array of Enemies */
    private generateEnemies(numEnemies: number): Array<Enemy> {
        let allEnemies: Array<Enemy> = [];
        for (var i = 0; i < numEnemies; i++) {
            let enemy = new Enemy(this);
            allEnemies.push(enemy);
        }
        return allEnemies;
    }
    /**
    * This function is called by main (our game loop) and itself calls all
    * of the functions which may need to update entity's data. Based on how
    * you implement your collision detection (when two entities occupy the
    * same space, for instance when your character should die), you may find
    * the need to add an additional function call here. For now, we've left
    * it commented out - you may or may not want to implement this
    * functionality this way (you could just implement collision detection
    * on the entities themselves within your app.js file).
    */
    private update(dt) {
        this.updateEntities(dt);
        this.checkCollisions();
    }

    /**
    * This is called by the update function and loops through all of the
    * objects within your allEnemies array as defined in app.js and calls
    * their update() methods. It will then call the update function for your
    * player object. These update methods should focus purely on updating
    * the data/properties related to the object. Do your drawing in your
    * render methods.
    */
    private updateEntities(dt) {
        this.allEnemies.forEach(function (enemy: Enemy) {
            enemy.update(dt);
        });
        this.player.update(dt * 3);
    }
    /**
    * This function initially draws the "game level", it will then call
    * the renderEntities function. Remember, this function is called every
    * game tick (or loop of the game engine) because that's how games work -
    * they are flipbooks creating the illusion of animation but in reality
    * they are just drawing the entire screen over and over.
    */
    private render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
            numRows = 6,
            numCols = 5,
            row, col;

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
    }

    /** This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    private renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        this.allEnemies.forEach(function (enemy: Enemy) {
            enemy.render();
        });

        this.player.render();
    }

    /** This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    private reset() {
        this.player = new Player(this);
        this.allEnemies = this.generateEnemies(4);
    }

    private checkCollisions() {
        if (this.player.y === 0) {
            setTimeout(() => {
                this.winTheGame();
            }, 0);
        }
        else {
            this.allEnemies.forEach((enemy: Enemy) => {
                if (this.player.x === enemy.x && this.player.y === enemy.y) {
                    this.loseTheGame();
                }
            });
        }
    }

    private winTheGame(): void {
        this.reset();
    }

    private loseTheGame(): void {
        this.reset();
    }
}
