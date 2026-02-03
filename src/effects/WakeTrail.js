/**
 * @fileoverview Swimming wake trail effect
 * @module effects/WakeTrail
 */

import { Particle } from './ParticleSystem.js';

/**
 * Wake particle that expands over time
 */
export class WakeParticle extends Particle {
    /** @type {number} */
    initialScale;

    /**
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(x, y) {
        super(x, y, {
            vx: 0,
            vy: 3,
            life: 1.2,
            scale: 2,
            color: 'rgba(255, 255, 255, 0.4)',
        });

        this.initialScale = 2;
    }

    /**
     * Update wake particle - expands over time
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        super.update(dt);
        this.scale = this.initialScale + (1 - this.alpha) * 8;
    }

    /**
     * Render wake particle
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.4;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.scale * 2),
            Math.floor(this.scale),
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * Wake trail effect manager
 */
export class WakeTrail {
    /** @type {WakeParticle[]} */
    #particles = [];

    /** @type {boolean} */
    isDead = false;

    constructor() {}

    /**
     * Get particle count
     * @returns {number}
     */
    get count() {
        return this.#particles.length;
    }

    /**
     * Emit a wake particle
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    emit(x, y) {
        this.#particles.push(new WakeParticle(x, y));
    }

    /**
     * Update all particles
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        for (const p of this.#particles) {
            p.update(dt);
        }
        this.#particles = this.#particles.filter(p => !p.isDead);
    }

    /**
     * Render all particles
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const p of this.#particles) {
            p.render(ctx);
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        this.#particles = [];
    }
}

export default WakeTrail;
