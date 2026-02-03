/**
 * @fileoverview Base character class with sprite animation
 * @module entities/Character
 */

import { CHARACTER, ANIM_STATES } from '../utils/constants.js';
import { AnimationController } from './AnimationController.js';

/**
 * @typedef {Object} CharacterConfig
 * @property {*} game - Game instance
 * @property {number} x - Initial X position
 * @property {number} y - Initial Y position
 * @property {HTMLCanvasElement|HTMLImageElement} spritesheet - Sprite sheet
 * @property {number} frameWidth - Width of single frame
 * @property {number} frameHeight - Height of single frame
 * @property {number} [scale=2] - Render scale
 * @property {number} [sizeMultiplier=1.0] - Size multiplier
 */

/**
 * @typedef {'full'|'swimming'} RenderMode
 */

const DEFAULT_ANIMATIONS = {
    [ANIM_STATES.DANCE]: { frames: [0, 1, 2, 1], fps: 4, loop: true },
    [ANIM_STATES.SIT]: { frames: [0], fps: 1, loop: false },
    [ANIM_STATES.STAND]: { frames: [0], fps: 1, loop: false },
    [ANIM_STATES.WALK]: { frames: [0, 1, 2, 1], fps: 6, loop: true },
    [ANIM_STATES.WADE]: { frames: [0, 1, 2, 1], fps: 5, loop: true },
    [ANIM_STATES.SWIM]: { frames: [0, 1, 2, 1], fps: 2.5, loop: true },
};

/**
 * Base character class with sprite animation and rendering
 */
export class Character {
    /** @type {*} */
    #game;

    /** @type {AnimationController} */
    #animator;

    /** @type {HTMLCanvasElement|HTMLImageElement} */
    #spritesheet;

    /** @type {number} */
    #frameWidth;

    /** @type {number} */
    #frameHeight;

    /** @type {number} */
    #scale;

    /** @type {number} */
    #sizeMultiplier;

    /** @type {number} */
    x;

    /** @type {number} */
    y;

    /** @type {boolean} */
    flipX = false;

    /** @type {number} */
    widthMultiplier = 1.0;

    /** @type {RenderMode} */
    renderMode = 'full';

    /**
     * @param {CharacterConfig} config
     */
    constructor(config) {
        this.#game = config.game;
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.#spritesheet = config.spritesheet;
        this.#frameWidth = config.frameWidth ?? CHARACTER.DEFAULT_FRAME_WIDTH;
        this.#frameHeight = config.frameHeight ?? CHARACTER.DEFAULT_FRAME_HEIGHT;
        this.#scale = config.scale ?? CHARACTER.DEFAULT_SCALE;
        this.#sizeMultiplier = config.sizeMultiplier ?? 1.0;

        this.#animator = new AnimationController({ ...DEFAULT_ANIMATIONS });
        this.#animator.setAnimation(ANIM_STATES.STAND);
    }

    /**
     * Get the spritesheet
     * @returns {HTMLCanvasElement|HTMLImageElement}
     */
    get spritesheet() {
        return this.#spritesheet;
    }

    /**
     * Set the spritesheet
     * @param {HTMLCanvasElement|HTMLImageElement} value
     */
    set spritesheet(value) {
        this.#spritesheet = value;
    }

    /**
     * Get frame width
     * @returns {number}
     */
    get frameWidth() {
        return this.#frameWidth;
    }

    /**
     * Set frame width
     * @param {number} value
     */
    set frameWidth(value) {
        this.#frameWidth = value;
    }

    /**
     * Get frame height
     * @returns {number}
     */
    get frameHeight() {
        return this.#frameHeight;
    }

    /**
     * Set frame height
     * @param {number} value
     */
    set frameHeight(value) {
        this.#frameHeight = value;
    }

    /**
     * Get size multiplier
     * @returns {number}
     */
    get sizeMultiplier() {
        return this.#sizeMultiplier;
    }

    /**
     * Set size multiplier
     * @param {number} value
     */
    set sizeMultiplier(value) {
        this.#sizeMultiplier = value;
    }

    /**
     * Get current animation name
     * @returns {string|null}
     */
    get animation() {
        return this.#animator.currentAnimName;
    }

    /**
     * Set the current animation
     * @param {string} name - Animation name
     */
    setAnimation(name) {
        this.#animator.setAnimation(name);
    }

    /**
     * Update character state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.#animator.update(dt);
    }

    /**
     * Calculate draw dimensions based on render mode
     * @returns {{width: number, height: number}}
     */
    #calculateDrawDimensions() {
        if (this.renderMode === 'swimming') {
            return {
                width: Math.floor(CHARACTER.SWIM_TARGET_WIDTH * this.#sizeMultiplier * this.widthMultiplier),
                height: Math.floor(CHARACTER.SWIM_TARGET_HEIGHT * this.#sizeMultiplier),
            };
        }

        return {
            width: Math.floor(CHARACTER.TARGET_WIDTH * this.#sizeMultiplier * this.widthMultiplier),
            height: Math.floor(CHARACTER.TARGET_HEIGHT * this.#sizeMultiplier),
        };
    }

    /**
     * Render the character
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (!this.#spritesheet) {
            return;
        }

        const frameIndex = this.#animator.getCurrentFrame();
        const cols = Math.floor(this.#spritesheet.width / this.#frameWidth);

        const sx = (frameIndex % cols) * this.#frameWidth;
        const sy = Math.floor(frameIndex / cols) * this.#frameHeight;

        const { width: drawWidth, height: drawHeight } = this.#calculateDrawDimensions();

        const drawX = Math.floor(this.x - drawWidth / 2);
        const drawY = Math.floor(this.y - drawHeight);

        if (this.renderMode !== 'swimming') {
            this.#renderShadow(ctx, drawWidth);
        }

        ctx.save();

        if (this.flipX) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.#spritesheet,
                sx, sy, this.#frameWidth, this.#frameHeight,
                -drawX - drawWidth, drawY, drawWidth, drawHeight
            );
        } else {
            ctx.drawImage(
                this.#spritesheet,
                sx, sy, this.#frameWidth, this.#frameHeight,
                drawX, drawY, drawWidth, drawHeight
            );
        }

        ctx.restore();
    }

    /**
     * Render character shadow
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} characterWidth - Character draw width
     */
    #renderShadow(ctx, characterWidth) {
        // Guard against invalid values
        if (!characterWidth || !isFinite(characterWidth) || characterWidth <= 0) {
            return;
        }

        ctx.save();

        const shadowWidth = characterWidth * CHARACTER.SHADOW_WIDTH_RATIO;
        const shadowHeight = shadowWidth * CHARACTER.SHADOW_HEIGHT_RATIO;

        const shadowX = this.x;
        const shadowY = this.y + 2;

        // Guard against NaN in gradient
        if (!isFinite(shadowX) || !isFinite(shadowY) || !isFinite(shadowWidth)) {
            ctx.restore();
            return;
        }

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

export default Character;
