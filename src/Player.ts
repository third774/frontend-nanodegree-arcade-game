/// <reference path="./Sprite.ts" />

// The Player
class Player extends Sprite {
       
    /**
     * The Player Class. Constructor needs game engine passed in
     */
    constructor(engine: Engine) {
        var config = {
            engine: engine,
            // The image/sprite for our enemies, this uses
            // a helper we've provided to easily load images
            spriteImage: 'images/char-boy.png'
        }

        // Call the Sprite constructor passing in config
        super(config);

        // Do more stuff here?        
    }

    update(dt?: any): void {
        // do stuff
    }
    
    // Draw the player on the screen, required method for game
    public render() {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
    
    public up() : void {
        
    }
    
    public down() : void {
        
    }
    
    public left() : void {
        
    }
    
    public right() : void {
        
    }
}