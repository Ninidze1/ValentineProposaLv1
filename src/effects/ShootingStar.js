/**
 * @fileoverview Shooting star effect across the night sky
 * @module effects/ShootingStar
 */

import { INTERNAL_WIDTH } from '../utils/constants.js';

const SPAWN_DELAY_MIN = 5;
const SPAWN_DELAY_MAX = 15;
const INITIAL_DELAY_MIN = 3;
const INITIAL_DELAY_MAX = 8;
const TRAIL_LENGTH = 12;

/**
 * @typedef {Object} Star
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} vx - Velocity X
 * @property {number} vy - Velocity Y
 * @property {number} life - Remaining life
 * @property {Array<{x: number, y: number}>} trail - Trail positions
 */

/**
 * Occasional shooting stars across the sky
 */
export class ShootingStars {
    /** @type {Star[]} */
    #stars = [];

    /** @type {number} */
    #spawnTimer;

    constructor() {
        this.#spawnTimer = INITIAL_DELAY_MIN + Math.random() * (INITIAL_DELAY_MAX - INITIAL_DELAY_MIN);
    }

    /**
     * Get star count
     * @returns {number}
     */
    get count() {
        return this.#stars.length;
    }

    /**
     * Spawn a new shooting star
     */
    #spawn() {
        const startX = Math.random() * INTERNAL_WIDTH * 0.7;
        const startY = Math.random() * 60 + 10;

        this.#stars.push({
            x: startX,
            y: startY,
            vx: 150 + Math.random() * 100,
            vy: 40 + Math.random() * 30,
            life: 0.8 + Math.random() * 0.4,
            trail: [],
        });
    }

    /**
     * Update all stars
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        // Spawn new shooting stars occasionally
        this.#spawnTimer -= dt;
        if (this.#spawnTimer <= 0) {
            this.#spawn();
            this.#spawnTimer = SPAWN_DELAY_MIN + Math.random() * (SPAWN_DELAY_MAX - SPAWN_DELAY_MIN);
        }

        // Update existing stars
        for (const star of this.#stars) {
            star.x += star.vx * dt;
            star.y += star.vy * dt;
            star.life -= dt;

            // Add current position to trail
            star.trail.unshift({ x: star.x, y: star.y });
            if (star.trail.length > TRAIL_LENGTH) {
                star.trail.pop();
            }
        }

        // Remove dead stars
        this.#stars = this.#stars.filter(s => s.life > 0);
    }

    /**
     * Render all stars
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const star of this.#stars) {
            // Draw trail
            for (let i = 0; i < star.trail.length; i++) {
                const point = star.trail[i];
                const alpha = (1 - i / star.trail.length) * (star.life / 1.2);

                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = i < 3 ? '#ffffff' : '#ffcccc';

                const size = Math.max(1, 3 - i * 0.2);
                ctx.fillRect(
                    Math.floor(point.x),
                    Math.floor(point.y),
                    Math.ceil(size),
                    1
                );
            }

            // Draw head
            ctx.globalAlpha = Math.min(1, star.life);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 2, 2);
        }

        ctx.globalAlpha = 1;
    }

    /**
     * Clear all stars
     */
    clear() {
        this.#stars = [];
    }
}

export default ShootingStars;
