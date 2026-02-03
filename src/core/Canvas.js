/**
 * @fileoverview Canvas management with pixel-perfect rendering
 * @module core/Canvas
 */

import { INTERNAL_WIDTH, INTERNAL_HEIGHT, ASPECT_RATIO, COLORS } from '../utils/constants.js';

/**
 * @typedef {Object} CanvasCoordinates
 * @property {number} x - X coordinate in canvas space
 * @property {number} y - Y coordinate in canvas space
 */

/**
 * Manages the game canvas with pixel-perfect scaling
 */
export class Canvas {
    /** @type {HTMLElement} */
    #container;

    /** @type {HTMLCanvasElement} */
    #canvas;

    /** @type {CanvasRenderingContext2D} */
    #ctx;

    /** @type {number} */
    #scale = 1;

    /** @type {number} */
    #displayWidth = INTERNAL_WIDTH;

    /** @type {number} */
    #displayHeight = INTERNAL_HEIGHT;

    /** @type {function(): void} */
    #boundResize;

    /**
     * @param {string} containerSelector - CSS selector for container element
     */
    constructor(containerSelector) {
        this.#container = document.querySelector(containerSelector);
        this.#canvas = document.createElement('canvas');
        this.#ctx = this.#canvas.getContext('2d');

        this.#initializeCanvas();
        this.#setupResizeListener();
    }

    /**
     * Initialize canvas with internal resolution and pixel-perfect settings
     */
    #initializeCanvas() {
        this.#canvas.width = INTERNAL_WIDTH;
        this.#canvas.height = INTERNAL_HEIGHT;

        this.#ctx.imageSmoothingEnabled = false;

        this.#canvas.style.imageRendering = 'pixelated';
        this.#canvas.style.imageRendering = 'crisp-edges';
        this.#canvas.style.imageRendering = '-moz-crisp-edges';

        this.#container.appendChild(this.#canvas);

        this.resize();
    }

    /**
     * Set up window resize listener
     */
    #setupResizeListener() {
        this.#boundResize = this.resize.bind(this);
        window.addEventListener('resize', this.#boundResize);
    }

    /**
     * Handle window resize to maintain aspect ratio
     */
    resize() {
        const windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio > ASPECT_RATIO) {
            this.#displayHeight = window.innerHeight;
            this.#displayWidth = this.#displayHeight * ASPECT_RATIO;
        } else {
            this.#displayWidth = window.innerWidth;
            this.#displayHeight = this.#displayWidth / ASPECT_RATIO;
        }

        this.#canvas.style.width = `${Math.floor(this.#displayWidth)}px`;
        this.#canvas.style.height = `${Math.floor(this.#displayHeight)}px`;

        this.#scale = this.#displayWidth / INTERNAL_WIDTH;

        this.#ctx.imageSmoothingEnabled = false;
    }

    /**
     * Convert screen coordinates to internal canvas coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {CanvasCoordinates} Converted coordinates
     */
    screenToCanvas(screenX, screenY) {
        const rect = this.#canvas.getBoundingClientRect();
        return {
            x: Math.floor((screenX - rect.left) / this.#scale),
            y: Math.floor((screenY - rect.top) / this.#scale),
        };
    }

    /**
     * Clear the canvas with a solid color
     * @param {string} [color=COLORS.black] - Fill color
     */
    clear(color = COLORS.black) {
        this.#ctx.fillStyle = color;
        this.#ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    }

    /**
     * Get the canvas rendering context
     * @returns {CanvasRenderingContext2D}
     */
    get ctx() {
        return this.#ctx;
    }

    /**
     * Get the canvas element
     * @returns {HTMLCanvasElement}
     */
    get canvas() {
        return this.#canvas;
    }

    /**
     * Get the current scale factor
     * @returns {number}
     */
    get scale() {
        return this.#scale;
    }

    /**
     * Get the display width
     * @returns {number}
     */
    get displayWidth() {
        return this.#displayWidth;
    }

    /**
     * Get the display height
     * @returns {number}
     */
    get displayHeight() {
        return this.#displayHeight;
    }

    /**
     * Get internal width
     * @returns {number}
     */
    get width() {
        return INTERNAL_WIDTH;
    }

    /**
     * Get internal height
     * @returns {number}
     */
    get height() {
        return INTERNAL_HEIGHT;
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        window.removeEventListener('resize', this.#boundResize);
    }
}

export default Canvas;
