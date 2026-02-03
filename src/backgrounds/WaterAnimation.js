/**
 * @fileoverview Animated water with waves and shimmer
 * @module backgrounds/WaterAnimation
 */

import { INTERNAL_WIDTH, INTERNAL_HEIGHT } from '../utils/constants.js';

const DEFAULT_WAVE_AMPLITUDE = 2;
const DEFAULT_WAVE_FREQUENCY = 0.04;
const DEFAULT_WAVE_SPEED = 1.5;
const WAVE_LINE_SPACING = 15;
const SHIMMER_COUNT = 12;

/**
 * Animated water background with waves
 */
export class WaterAnimation {
    /** @type {number} */
    #yStart;

    /** @type {number} */
    #time = 0;

    /** @type {number} */
    #waveAmplitude;

    /** @type {number} */
    #waveFrequency;

    /** @type {number} */
    #waveSpeed;

    /**
     * @param {number} [yStart=140] - Y position where water starts
     */
    constructor(yStart = 140) {
        this.#yStart = yStart;
        this.#waveAmplitude = DEFAULT_WAVE_AMPLITUDE;
        this.#waveFrequency = DEFAULT_WAVE_FREQUENCY;
        this.#waveSpeed = DEFAULT_WAVE_SPEED;
    }

    /**
     * Get water start Y position
     * @returns {number}
     */
    get yStart() {
        return this.#yStart;
    }

    /**
     * Update water animation
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.#time += dt;
    }

    /**
     * Render water background
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const waterHeight = INTERNAL_HEIGHT - this.#yStart;

        this.#renderGradient(ctx, waterHeight);
        this.#renderWaveLines(ctx);
        this.#renderShimmer(ctx);
    }

    /**
     * Render water gradient
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} waterHeight
     */
    #renderGradient(ctx, waterHeight) {
        const gradient = ctx.createLinearGradient(0, this.#yStart, 0, INTERNAL_HEIGHT);
        gradient.addColorStop(0, '#3a2a4a');
        gradient.addColorStop(0.3, '#2a1a3a');
        gradient.addColorStop(1, '#1a0a2a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.#yStart, INTERNAL_WIDTH, waterHeight);
    }

    /**
     * Render wave lines
     * @param {CanvasRenderingContext2D} ctx
     */
    #renderWaveLines(ctx) {
        ctx.strokeStyle = 'rgba(255, 200, 220, 0.1)';
        ctx.lineWidth = 1;

        for (let y = this.#yStart + 8; y < INTERNAL_HEIGHT; y += WAVE_LINE_SPACING) {
            ctx.beginPath();

            for (let x = 0; x <= INTERNAL_WIDTH; x += 5) {
                const waveY = y + Math.sin(
                    (x * this.#waveFrequency) +
                    (this.#time * this.#waveSpeed) +
                    y * 0.08
                ) * this.#waveAmplitude;

                if (x === 0) {
                    ctx.moveTo(x, waveY);
                } else {
                    ctx.lineTo(x, waveY);
                }
            }

            ctx.stroke();
        }
    }

    /**
     * Render surface shimmer
     * @param {CanvasRenderingContext2D} ctx
     */
    #renderShimmer(ctx) {
        ctx.fillStyle = 'rgba(255, 200, 220, 0.08)';

        for (let i = 0; i < SHIMMER_COUNT; i++) {
            const shimmerX = ((this.#time * 15 + i * 40) % (INTERNAL_WIDTH + 20)) - 10;
            const shimmerY = this.#yStart + 3 + Math.sin(this.#time * 2 + i) * 2;

            ctx.fillRect(Math.floor(shimmerX), Math.floor(shimmerY), 10, 1);
        }
    }
}

export default WaterAnimation;
