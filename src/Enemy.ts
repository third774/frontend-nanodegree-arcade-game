/// <reference path="./Sprite.ts" />

enum EnemyTypeEnum {
    left,
    right
}



// Enemies our player must avoid
class Enemy extends Sprite {
    upperBoundary: number;
    lowerBoundary: number;
    type: EnemyTypeEnum;
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
        this.upperBoundary = 1;
        this.lowerBoundary = 3;
        this.y = Math.floor(Math.random() * (this.lowerBoundary - this.upperBoundary + 1)) + this.upperBoundary;
        this.type = Math.random() > 0.5 ? EnemyTypeEnum.left : EnemyTypeEnum.right;
        this.x = this.type == EnemyTypeEnum.left ? 0 : 4;
        
        

        setInterval(() => {
            this.move();
        }, 1000);
    }

    update(dt: any): void {
        //console.log(dt);
                
    }

    move(): void {
        if (this.type === EnemyTypeEnum.left) {
            this.x++;
        } else {
            this.x--;
        }
    }
}