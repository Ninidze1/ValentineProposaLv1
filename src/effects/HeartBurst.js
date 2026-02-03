/**
 * @fileoverview Heart particle explosion effect
 * @module effects/HeartBurst
 */

import { Particle, ParticleEmitter } from './ParticleSystem.js';

const HEART_COLORS = ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e', '#ffaaaa', '#ffffff'];

/**
 * Heart-shaped particle
 */
export class HeartParticle extends Particle {
    /** @type {number} */
    size;

    /**
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} config - Particle config
     */
    constructor(x, y, config) {
        super(x, y, config);
        this.size = config.size ?? 4;
    }

    /**
     * Render pixel art heart
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.floor(this.x), Math.floor(this.y));
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        ctx.fillStyle = this.color;
        const s = this.size;

        // Pixel heart shape
        ctx.fillRect(-s, -s / 2, s / 2, s / 2);
        ctx.fillRect(s / 2, -s / 2, s / 2, s / 2);
        ctx.fillRect(-s - s / 2, 0, s / 2, s / 2);
        ctx.fillRect(s, 0, s / 2, s / 2);
        ctx.fillRect(-s, 0, s * 2, s / 2);
        ctx.fillRect(-s + s / 2, s / 2, s, s / 2);
        ctx.fillRect(0, s, s / 2, s / 2);

        ctx.restore();
    }
}

/**
 * Heart burst particle emitter
 */
export class HeartBurst extends ParticleEmitter {
    /** @type {string[]} */
    #colors = HEART_COLORS;

    /**
     * @param {number} x - Burst center X
     * @param {number} y - Burst center Y
     * @param {number} [count=30] - Number of hearts
     */
    constructor(x, y, count = 30) {
        super({ oneShot: true });
        this.emit(x, y, count);
    }

    /**
     * Create a heart particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {HeartParticle}
     */
    createParticle(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 100;

        return new HeartParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 30,
            life: 1.0 + Math.random() * 0.5,
            gravity: 100,
            friction: 0.97,
            scale: 0.6 + Math.random() * 0.8,
            rotationSpeed: (Math.random() - 0.5) * 4,
            color: this.#colors[Math.floor(Math.random() * this.#colors.length)],
            size: 3 + Math.floor(Math.random() * 4),
        });
    }
}

export default HeartBurst;
