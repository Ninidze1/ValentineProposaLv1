/**
 * @fileoverview Water ripple effect
 * @module effects/Ripple
 */

const RIPPLE_GROWTH_SPEED = 15;
const MAX_RIPPLE_RADIUS = 15;

/**
 * Single ripple instance
 */
export class Ripple {
    /** @type {number} */
    x;

    /** @type {number} */
    y;

    /** @type {number} */
    radius = 2;

    /** @type {number} */
    maxRadius = MAX_RIPPLE_RADIUS;

    /** @type {number} */
    life = 1;

    /** @type {boolean} */
    isDead = false;

    /**
     * @param {number} x - Center X
     * @param {number} y - Center Y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Update ripple state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.radius += dt * RIPPLE_GROWTH_SPEED;
        this.life -= dt;

        if (this.life <= 0 || this.radius >= this.maxRadius) {
            this.isDead = true;
        }
    }

    /**
     * Render ripple
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.radius),
            Math.floor(this.radius * 0.4),
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Ripple effect manager
 */
export class RippleEffect {
    /** @type {Ripple[]} */
    #ripples = [];

    /** @type {boolean} */
    isDead = false;

    constructor() {}

    /**
     * Get ripple count
     * @returns {number}
     */
    get count() {
        return this.#ripples.length;
    }

    /**
     * Emit a ripple at position
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    emit(x, y) {
        this.#ripples.push(new Ripple(x, y));
    }

    /**
     * Update all ripples
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        for (const r of this.#ripples) {
            r.update(dt);
        }
        this.#ripples = this.#ripples.filter(r => !r.isDead);
    }

    /**
     * Render all ripples
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const r of this.#ripples) {
            r.render(ctx);
        }
    }

    /**
     * Clear all ripples
     */
    clear() {
        this.#ripples = [];
    }
}

export default RippleEffect;
