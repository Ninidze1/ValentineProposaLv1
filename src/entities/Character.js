// Character.js - Base character with sprite animation
class Character {
    constructor(game, x, y, spritesheet, frameWidth, frameHeight, scale = 2, sizeMultiplier = 1.0) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.spritesheet = spritesheet;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.scale = scale;  // Scale factor for rendering (default 2x)
        this.sizeMultiplier = sizeMultiplier;  // Additional size multiplier for individual characters
        this.flipX = false;

        // Default animations - will be set per character
        this.animations = {
            dance: { frames: [0, 1, 2, 1], fps: 4, loop: true },
            sit: { frames: [0], fps: 1, loop: false },
            stand: { frames: [0], fps: 1, loop: false },
            walk: { frames: [0, 1, 2, 1], fps: 6, loop: true },
            wade: { frames: [0, 1, 2, 1], fps: 5, loop: true },
            swim: { frames: [0, 1, 2, 1], fps: 4, loop: true }
        };

        this.animator = new AnimationController(this.animations);
        this.animator.setAnimation('stand');
    }

    setAnimation(name) {
        this.animator.setAnimation(name);
    }

    get animation() {
        return this.animator.currentAnimName;
    }

    update(dt) {
        this.animator.update(dt);
    }

    render(ctx) {
        if (!this.spritesheet) return;

        const frameIndex = this.animator.getCurrentFrame();
        const cols = Math.floor(this.spritesheet.width / this.frameWidth);

        const sx = (frameIndex % cols) * this.frameWidth;
        const sy = Math.floor(frameIndex / cols) * this.frameHeight;

        // Fixed target size for pixel art characters (2x scale)
        const TARGET_WIDTH = 64;
        const TARGET_HEIGHT = 96;

        // Use fixed target size with individual size multiplier
        const drawWidth = Math.floor(TARGET_WIDTH * this.sizeMultiplier);
        const drawHeight = Math.floor(TARGET_HEIGHT * this.sizeMultiplier);

        ctx.save();

        const drawX = Math.floor(this.x - drawWidth / 2);
        const drawY = Math.floor(this.y - drawHeight);

        if (this.flipX) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.spritesheet,
                sx, sy, this.frameWidth, this.frameHeight,
                -drawX - drawWidth, drawY, drawWidth, drawHeight
            );
        } else {
            ctx.drawImage(
                this.spritesheet,
                sx, sy, this.frameWidth, this.frameHeight,
                drawX, drawY, drawWidth, drawHeight
            );
        }

        ctx.restore();
    }
}
