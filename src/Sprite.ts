/// <reference path="./Engine.ts" />

interface ISpriteConfig {
    engine: Engine;
    spriteImage: string;
}

class Sprite {
    engine: Engine;
    spriteImage: string;
    x: number;
    y: number;

    /**
     *
     */
    constructor(config: ISpriteConfig) {
        this.engine = config.engine;
        this.spriteImage = config.spriteImage;
    }

    render(): void {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.col(this.x), this.row(this.y));
    };

    col(x: number): number {
        return x * 101;
    }

    row(y: number): number {
        return y * 83 - 40;
    }    
}

