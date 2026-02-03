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
        this.widthMultiplier = 1.0;  // Optional width-only multiplier
        this.flipX = false;
        this.renderMode = 'full';  // 'full' for normal sprites, 'swimming' for head/chest only

        // Default animations - will be set per character
        this.animations = {
            dance: { frames: [0, 1, 2, 1], fps: 4, loop: true },
            sit: { frames: [0], fps: 1, loop: false },
            stand: { frames: [0], fps: 1, loop: false },
            walk: { frames: [0, 1, 2, 1], fps: 6, loop: true },
            wade: { frames: [0, 1, 2, 1], fps: 5, loop: true },
            swim: { frames: [0, 1, 2, 1], fps: 2.5, loop: true }  // Slower, more relaxed swimming
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

        // Target sizes based on render mode
        let drawWidth, drawHeight;

        if (this.renderMode === 'swimming') {
            // Swimming sprites are head/chest only - smaller size
            const SWIM_TARGET_WIDTH = 45;
            const SWIM_TARGET_HEIGHT = 42;
            drawWidth = Math.floor(SWIM_TARGET_WIDTH * this.sizeMultiplier * this.widthMultiplier);
            drawHeight = Math.floor(SWIM_TARGET_HEIGHT * this.sizeMultiplier);
        } else {
            // Fixed target size for full body pixel art characters (2x scale)
            const TARGET_WIDTH = 64;
            const TARGET_HEIGHT = 96;
            drawWidth = Math.floor(TARGET_WIDTH * this.sizeMultiplier * this.widthMultiplier);
            drawHeight = Math.floor(TARGET_HEIGHT * this.sizeMultiplier);
        }

        const drawX = Math.floor(this.x - drawWidth / 2);
        const drawY = Math.floor(this.y - drawHeight);

        // Draw natural ellipse shadow (only for non-swimming mode)
        if (this.renderMode !== 'swimming') {
            this.renderShadow(ctx, drawWidth);
        }

        ctx.save();

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

    renderShadow(ctx, characterWidth) {
        ctx.save();

        // Shadow size based on character width
        const shadowWidth = characterWidth * 0.6;
        const shadowHeight = shadowWidth * 0.3;

        // Position shadow at character's feet
        const shadowX = this.x;
        const shadowY = this.y + 2;

        // Create gradient for natural shadow
        const gradient = ctx.createRadialGradient(
            shadowX, shadowY, 0,
            shadowX, shadowY, shadowWidth / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(shadowX, shadowY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
