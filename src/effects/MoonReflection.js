/**
 * @fileoverview Shimmering moon reflection on water
 * @module effects/MoonReflection
 */

const SEGMENT_COUNT = 20;
const REFLECTION_LENGTH = 80;

/**
 * @typedef {Object} ReflectionSegment
 * @property {number} offset - Phase offset
 * @property {number} speed - Animation speed
 * @property {number} width - Segment width
 */

/**
 * Shimmering moon reflection on water surface
 */
export class MoonReflection {
    /** @type {number} */
    #moonX;

    /** @type {number} */
    #waterY;

    /** @type {number} */
    #time = 0;

    /** @type {ReflectionSegment[]} */
    #segments = [];

    /**
     * @param {number} [moonX=400] - Moon X position
     * @param {number} [waterY=140] - Water surface Y position
     */
    constructor(moonX = 400, waterY = 140) {
        this.#moonX = moonX;
        this.#waterY = waterY;

        // Create reflection segments
        for (let i = 0; i < SEGMENT_COUNT; i++) {
            this.#segments.push({
                offset: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                width: 2 + Math.random() * 4,
            });
        }
    }

    /**
     * Update reflection animation
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.#time += dt;
    }

    /**
     * Render moon reflection
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        const startY = this.#waterY + 5;

        // Draw shimmering reflection path
        for (let i = 0; i < this.#segments.length; i++) {
            const seg = this.#segments[i];
            const y = startY + (i / this.#segments.length) * REFLECTION_LENGTH;
            const shimmer = Math.sin(this.#time * seg.speed + seg.offset);
            const xOffset = shimmer * (5 + i * 0.5);

            // Calculate fade based on distance
            const fade = 1 - (i / this.#segments.length);

            // Main reflection
            ctx.globalAlpha = fade * 0.4 * (0.6 + shimmer * 0.4);
            ctx.fillStyle = '#ffeeee';
            ctx.fillRect(
                Math.floor(this.#moonX + xOffset - seg.width / 2),
                Math.floor(y),
                Math.ceil(seg.width),
                3
            );

            // Glow
            ctx.globalAlpha = fade * 0.15;
            ctx.fillStyle = '#ffaaaa';
            ctx.fillRect(
                Math.floor(this.#moonX + xOffset - seg.width - 2),
                Math.floor(y),
                Math.ceil(seg.width * 2 + 4),
                4
            );
        }

        ctx.globalAlpha = 1;
    }
}

export default MoonReflection;
