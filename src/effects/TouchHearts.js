/**
 * @fileoverview Touch/click heart spawn effect
 * @module effects/TouchHearts
 */

const HEART_COLORS = ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ffaaaa'];
const GRAVITY = 30;
const LIFE_DECAY = 0.8;

/**
 * @typedef {Object} TouchHeart
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} vx - Velocity X
 * @property {number} vy - Velocity Y
 * @property {number} size - Heart size
 * @property {number} life - Remaining life
 * @property {number} rotation - Current rotation
 * @property {string} color - Heart color
 */

/**
 * Spawn hearts when clicking/tapping anywhere
 */
export class TouchHearts {
    /** @type {TouchHeart[]} */
    #hearts = [];

    constructor() {}

    /**
     * Get current heart count
     * @returns {number}
     */
    get count() {
        return this.#hearts.length;
    }

    /**
     * Emit hearts at a position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} [count=5] - Number of hearts
     */
    emit(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.#hearts.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 40,
                vy: -30 - Math.random() * 50,
                size: 3 + Math.random() * 4,
                life: 1.0,
                rotation: Math.random() * 0.5 - 0.25,
                color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
            });
        }
    }

    /**
     * Update all hearts
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        for (const h of this.#hearts) {
            h.x += h.vx * dt;
            h.y += h.vy * dt;
            h.vy += GRAVITY * dt;
            h.life -= dt * LIFE_DECAY;
            h.rotation += dt * 2;
        }

        this.#hearts = this.#hearts.filter(h => h.life > 0);
    }

    /**
     * Render all hearts
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const h of this.#hearts) {
            ctx.globalAlpha = Math.min(1, h.life);
            ctx.fillStyle = h.color;

            ctx.save();
            ctx.translate(h.x, h.y);
            ctx.rotate(h.rotation);
            this.#drawPixelHeart(ctx, 0, 0, h.size);
            ctx.restore();
        }

        ctx.globalAlpha = 1;
    }

    /**
     * Draw a pixel art heart
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} size - Heart size
     */
    #drawPixelHeart(ctx, x, y, size) {
        const s = size / 4;
        ctx.fillRect(x - s * 2, y - s, s, s);
        ctx.fillRect(x + s, y - s, s, s);
        ctx.fillRect(x - s * 3, y, s, s);
        ctx.fillRect(x + s * 2, y, s, s);
        ctx.fillRect(x - s * 2, y, s * 4, s);
        ctx.fillRect(x - s * 1.5, y + s, s * 3, s);
        ctx.fillRect(x - s / 2, y + s * 2, s, s);
    }

    /**
     * Clear all hearts
     */
    clear() {
        this.#hearts = [];
    }
}

export default TouchHearts;
