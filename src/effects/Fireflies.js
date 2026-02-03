/**
 * @fileoverview Atmospheric floating firefly lights
 * @module effects/Fireflies
 */

import { INTERNAL_WIDTH } from '../utils/constants.js';
import { clamp } from '../utils/math.js';

const FIREFLY_COLORS = ['#ffee88', '#ffccaa'];
const SPEED_LIMIT_X = 20;
const SPEED_LIMIT_Y = 15;
const Y_MIN = 80;
const Y_MAX = 240;

/**
 * @typedef {Object} Firefly
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} vx - Velocity X
 * @property {number} vy - Velocity Y
 * @property {number} size - Firefly size
 * @property {number} glowPhase - Glow animation phase
 * @property {number} glowSpeed - Glow animation speed
 * @property {string} color - Glow color
 */

/**
 * Atmospheric floating firefly lights
 */
export class Fireflies {
    /** @type {Firefly[]} */
    #fireflies = [];

    /**
     * @param {number} [count=15] - Number of fireflies
     */
    constructor(count = 15) {
        for (let i = 0; i < count; i++) {
            this.#spawn();
        }
    }

    /**
     * Get firefly count
     * @returns {number}
     */
    get count() {
        return this.#fireflies.length;
    }

    /**
     * Spawn a new firefly
     */
    #spawn() {
        this.#fireflies.push({
            x: Math.random() * INTERNAL_WIDTH,
            y: 100 + Math.random() * 150,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 10,
            size: 1 + Math.random() * 2,
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: 1 + Math.random() * 2,
            color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
        });
    }

    /**
     * Update all fireflies
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        for (const f of this.#fireflies) {
            // Gentle wandering movement
            f.x += f.vx * dt;
            f.y += f.vy * dt;

            // Slowly change direction
            f.vx += (Math.random() - 0.5) * 20 * dt;
            f.vy += (Math.random() - 0.5) * 15 * dt;

            // Limit speed
            f.vx = clamp(f.vx, -SPEED_LIMIT_X, SPEED_LIMIT_X);
            f.vy = clamp(f.vy, -SPEED_LIMIT_Y, SPEED_LIMIT_Y);

            // Wrap around screen horizontally
            if (f.x < -10) f.x = INTERNAL_WIDTH + 10;
            if (f.x > INTERNAL_WIDTH + 10) f.x = -10;

            // Keep within vertical bounds
            if (f.y < Y_MIN) f.vy += 5 * dt;
            if (f.y > Y_MAX) f.vy -= 5 * dt;

            // Update glow phase
            f.glowPhase += f.glowSpeed * dt;
        }
    }

    /**
     * Render all fireflies
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (const f of this.#fireflies) {
            const glow = Math.sin(f.glowPhase) * 0.4 + 0.6;

            // Outer glow
            ctx.globalAlpha = glow * 0.3;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core
            ctx.globalAlpha = glow;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(
                Math.floor(f.x),
                Math.floor(f.y),
                Math.ceil(f.size),
                Math.ceil(f.size)
            );
        }

        ctx.globalAlpha = 1;
    }

    /**
     * Clear all fireflies
     */
    clear() {
        this.#fireflies = [];
    }
}

export default Fireflies;
