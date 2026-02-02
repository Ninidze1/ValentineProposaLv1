// AnimationController.js - Sprite animation handler
class AnimationController {
    constructor(animations) {
        this.animations = animations;
        this.currentAnimation = null;
        this.currentAnimName = null;
        this.frameIndex = 0;
        this.frameTimer = 0;
        this.onAnimationComplete = null;
    }

    setAnimation(name) {
        if (this.currentAnimName === name) return;

        this.currentAnimName = name;
        this.currentAnimation = this.animations[name];
        this.frameIndex = 0;
        this.frameTimer = 0;
    }

    update(dt) {
        if (!this.currentAnimation) return;

        const anim = this.currentAnimation;
        this.frameTimer += dt;
        const frameDuration = 1 / anim.fps;

        if (this.frameTimer >= frameDuration) {
            this.frameTimer -= frameDuration;
            this.frameIndex++;

            if (this.frameIndex >= anim.frames.length) {
                if (anim.loop) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex = anim.frames.length - 1;
                    if (this.onAnimationComplete) {
                        this.onAnimationComplete();
                    }
                }
            }
        }
    }

    getCurrentFrame() {
        if (!this.currentAnimation) return 0;
        return this.currentAnimation.frames[this.frameIndex];
    }
}
