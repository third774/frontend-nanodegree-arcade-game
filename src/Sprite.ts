/// <reference path="./Engine.ts" />

interface ISpriteConfig {
    engine: Engine;
    spriteImage: string;
}

class Sprite {
    engine: Engine;
    spriteImage: string;
    x: any;
    y: any;

    /**
     *
     */
    constructor(config: ISpriteConfig) {
        this.engine = config.engine;
        this.spriteImage = config.spriteImage;
    }

    render(): void {
        this.engine.ctx.drawImage(this.engine.resources.get(this.spriteImage), this.x, this.y);
    };
}