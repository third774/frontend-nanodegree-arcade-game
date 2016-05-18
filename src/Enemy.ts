/// <reference path="./Sprite.ts" />

// Enemies our player must avoid
class Enemy extends Sprite {
    /**
     * Comment goes here
     */
    constructor(engine: Engine) {
        var config = {
            engine: engine,
            // The image/sprite for our enemies, this uses
            // a helper we've provided to easily load images
            spriteImage: 'images/enemy-bug.png'
        }

        // Call the Sprite constructor passing in config
        super(config);

        // Do more stuff here?        
    }

    update(dt: any): void {
        // do stuff
    }
    
    // Draw the enemy on the screen, required method for game
    public render() {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
}