/**
 * @fileoverview Parallax scrolling background layer
 * @module backgrounds/ParallaxLayer
 */

import { INTERNAL_WIDTH } from '../utils/constants.js';

/**
 * Parallax scrolling background layer
 */
export class ParallaxLayer {
    /** @type {HTMLImageElement|HTMLCanvasElement|null} */
    #image;

    /** @type {number} */
    #speed;

    /** @type {number} */
    #y;

    /** @type {number} */
    #offset = 0;

    /**
     * @param {HTMLImageElement|HTMLCanvasElement|null} image - Layer image
     * @param {number} [speed=0] - Parallax speed multiplier
     * @param {number} [y=0] - Y position
     */
    constructor(image, speed = 0, y = 0) {
        this.#image = image;
        this.#speed = speed;
        this.#y = y;
    }

    /**
     * Get the layer image
     * @returns {HTMLImageElement|HTMLCanvasElement|null}
     */
    get image() {
        return this.#image;
    }

    /**
     * Set the layer image
     * @param {HTMLImageElement|HTMLCanvasElement|null} value
     */
    set image(value) {
        this.#image = value;
    }

    /**
     * Get Y position
     * @returns {number}
     */
    get y() {
        return this.#y;
    }

    /**
     * Set Y position
     * @param {number} value
     */
    set y(value) {
        this.#y = value;
    }

    /**
     * Update layer offset
     * @param {number} dt - Delta time in seconds
     * @param {number} [scrollAmount=0] - Scroll amount
     */
    update(dt, scrollAmount = 0) {
        this.#offset += scrollAmount * this.#speed;
    }

    /**
     * Render the parallax layer
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} [globalOffset=0] - Global offset for parallax
     */
    render(ctx, globalOffset = 0) {
        if (!this.#image) {
            return;
        }

        const offsetX = Math.floor(globalOffset * this.#speed);

        // If image is wider than canvas, handle wrapping
        if (this.#image.width > INTERNAL_WIDTH) {
            const x = -offsetX % this.#image.width;

            ctx.drawImage(this.#image, x, this.#y);

            if (x + this.#image.width < INTERNAL_WIDTH) {
                ctx.drawImage(this.#image, x + this.#image.width, this.#y);
            }

            if (x > 0) {
                ctx.drawImage(this.#image, x - this.#image.width, this.#y);
            }
        } else {
            // Center the image if smaller than canvas
            const x = Math.floor((INTERNAL_WIDTH - this.#image.width) / 2) + offsetX;
            ctx.drawImage(this.#image, x, this.#y);
        }
    }

    /**
     * Reset offset
     */
    reset() {
        this.#offset = 0;
    }
}

export default ParallaxLayer;
