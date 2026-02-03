/**
 * @fileoverview Dynamic water wave effects
 * @module effects/DynamicWaves
 */

import { INTERNAL_WIDTH, INTERNAL_HEIGHT } from '../utils/constants.js';

const WAVE_LAYER_COUNT = 4;

/**
 * @typedef {Object} WaveLayer
 * @property {number} amplitude - Wave height
 * @property {number} frequency - Wave frequency
 * @property {number} speed - Animation speed
 * @property {number} phase - Phase offset
 * @property {number} alpha - Layer opacity
 * @property {string} color - Wave color
 */

/**
 * Dynamic water wave effect
 */
export class DynamicWaves {
    /** @type {number} */
    #waterY;

    /** @type {number} */
    #time = 0;

    /** @type {WaveLayer[]} */
    #waves = [];

    /**
     * @param {number} [waterY=140] - Water surface Y position
     */
    constructor(waterY = 140) {
        this.#waterY = waterY;

        // Create multiple wave layers
        for (let i = 0; i < WAVE_LAYER_COUNT; i++) {
            this.#waves.push({
                amplitude: 2 + i * 1.5,
                frequency: 0.02 - i * 0.003,
                speed: 0.8 + i * 0.3,
                phase: Math.random() * Math.PI * 2,
                alpha: 0.3 - i * 0.05,
                color: i % 2 === 0 ? '#3a2a34' : '#2a1a24',
            });
        }
    }

    /**
     * Update wave animation
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.#time += dt;
    }

    /**
     * Render wave layers
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        // Draw each wave layer
        for (let index = 0; index < this.#waves.length; index++) {
            const wave = this.#waves[index];

            ctx.fillStyle = wave.color;
            ctx.globalAlpha = wave.alpha;

            ctx.beginPath();
            ctx.moveTo(0, INTERNAL_HEIGHT);

            // Draw wave line
            for (let x = 0; x <= INTERNAL_WIDTH; x += 4) {
                const y = this.#waterY + index * 8 +
                    Math.sin(x * wave.frequency + this.#time * wave.speed + wave.phase) * wave.amplitude +
                    Math.sin(x * wave.frequency * 2.3 + this.#time * wave.speed * 1.5) * wave.amplitude * 0.5;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(INTERNAL_WIDTH, INTERNAL_HEIGHT);
            ctx.closePath();
            ctx.fill();
        }

        // Add foam/sparkles on wave crests
        this.#renderFoam(ctx);

        ctx.globalAlpha = 1;
    }

    /**
     * Render foam sparkles on wave crests
     * @param {CanvasRenderingContext2D} ctx
     */
    #renderFoam(ctx) {
        ctx.fillStyle = '#ffffff';

        for (let x = 0; x < INTERNAL_WIDTH; x += 20) {
            const waveY = this.#waterY + Math.sin(x * 0.02 + this.#time * 0.8) * 2;
            const sparkle = Math.sin(this.#time * 3 + x * 0.1);

            if (sparkle > 0.7) {
                ctx.globalAlpha = (sparkle - 0.7) / 0.3 * 0.5;
                ctx.fillRect(Math.floor(x), Math.floor(waveY), 2, 1);
            }
        }
    }
}

export default DynamicWaves;
