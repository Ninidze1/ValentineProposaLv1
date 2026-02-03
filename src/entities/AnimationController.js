/**
 * @fileoverview Sprite animation handler
 * @module entities/AnimationController
 */

/**
 * @typedef {Object} AnimationDefinition
 * @property {number[]} frames - Array of frame indices
 * @property {number} fps - Frames per second
 * @property {boolean} loop - Whether animation loops
 */

/**
 * @typedef {Object.<string, AnimationDefinition>} AnimationMap
 */

/**
 * @callback AnimationCompleteCallback
 */

/**
 * Controls sprite animation playback
 */
export class AnimationController {
    /** @type {AnimationMap} */
    #animations;

    /** @type {AnimationDefinition|null} */
    #currentAnimation = null;

    /** @type {string|null} */
    #currentAnimName = null;

    /** @type {number} */
    #frameIndex = 0;

    /** @type {number} */
    #frameTimer = 0;

    /** @type {AnimationCompleteCallback|null} */
    #onAnimationComplete = null;

    /**
     * @param {AnimationMap} animations - Map of animation definitions
     */
    constructor(animations) {
        this.#animations = animations;
    }

    /**
     * Set animation complete callback
     * @param {AnimationCompleteCallback} callback
     */
    set onAnimationComplete(callback) {
        this.#onAnimationComplete = callback;
    }

    /**
     * Get animation complete callback
     * @returns {AnimationCompleteCallback|null}
     */
    get onAnimationComplete() {
        return this.#onAnimationComplete;
    }

    /**
     * Get current animation name
     * @returns {string|null}
     */
    get currentAnimName() {
        return this.#currentAnimName;
    }

    /**
     * Get current frame index within the animation frames array
     * @returns {number}
     */
    get frameIndex() {
        return this.#frameIndex;
    }

    /**
     * Check if animation is currently playing
     * @returns {boolean}
     */
    get isPlaying() {
        return this.#currentAnimation !== null;
    }

    /**
     * Set the current animation
     * @param {string} name - Animation name
     */
    setAnimation(name) {
        if (this.#currentAnimName === name) {
            return;
        }

        this.#currentAnimName = name;
        this.#currentAnimation = this.#animations[name] || null;
        this.#frameIndex = 0;
        this.#frameTimer = 0;
    }

    /**
     * Reset current animation to beginning
     */
    reset() {
        this.#frameIndex = 0;
        this.#frameTimer = 0;
    }

    /**
     * Stop the current animation
     */
    stop() {
        this.#currentAnimation = null;
        this.#currentAnimName = null;
        this.#frameIndex = 0;
        this.#frameTimer = 0;
    }

    /**
     * Update animation state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.#currentAnimation) {
            return;
        }

        const anim = this.#currentAnimation;
        this.#frameTimer += dt;

        const frameDuration = 1 / anim.fps;

        if (this.#frameTimer >= frameDuration) {
            this.#frameTimer -= frameDuration;
            this.#frameIndex++;

            if (this.#frameIndex >= anim.frames.length) {
                if (anim.loop) {
                    this.#frameIndex = 0;
                } else {
                    this.#frameIndex = anim.frames.length - 1;

                    if (this.#onAnimationComplete) {
                        this.#onAnimationComplete();
                    }
                }
            }
        }
    }

    /**
     * Get the current frame number from the spritesheet
     * @returns {number} Frame number
     */
    getCurrentFrame() {
        if (!this.#currentAnimation) {
            return 0;
        }

        return this.#currentAnimation.frames[this.#frameIndex];
    }

    /**
     * Check if animation exists
     * @param {string} name - Animation name
     * @returns {boolean}
     */
    hasAnimation(name) {
        return name in this.#animations;
    }

    /**
     * Add a new animation
     * @param {string} name - Animation name
     * @param {AnimationDefinition} definition - Animation definition
     */
    addAnimation(name, definition) {
        this.#animations[name] = definition;
    }

    /**
     * Remove an animation
     * @param {string} name - Animation name
     */
    removeAnimation(name) {
        delete this.#animations[name];

        if (this.#currentAnimName === name) {
            this.stop();
        }
    }
}

export default AnimationController;
