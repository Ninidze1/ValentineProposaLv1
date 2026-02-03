/**
 * @fileoverview Canvas-based clickable button
 * @module ui/Button
 */

import { COLORS } from '../utils/constants.js';

/**
 * @typedef {Object} ButtonConfig
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} width - Button width
 * @property {number} height - Button height
 * @property {string} text - Button label
 * @property {string} [color=COLORS.pink] - Background color
 * @property {string} [textColor=COLORS.white] - Text color
 * @property {function(): void} [onClick] - Click handler
 */

/**
 * Canvas-based clickable button
 */
export class Button {
    /** @type {number} */
    x;

    /** @type {number} */
    y;

    /** @type {number} */
    width;

    /** @type {number} */
    height;

    /** @type {string} */
    text;

    /** @type {string} */
    color;

    /** @type {string} */
    textColor;

    /** @type {function(): void|null} */
    onClick;

    /** @type {number} */
    scale = 1;

    /** @type {boolean} */
    visible = true;

    /** @type {boolean} */
    hovered = false;

    /**
     * @param {ButtonConfig} config
     */
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.text = config.text;
        this.color = config.color ?? COLORS.pink;
        this.textColor = config.textColor ?? COLORS.white;
        this.onClick = config.onClick ?? null;
    }

    /**
     * Set button scale
     * @param {number} scale - Scale factor
     */
    setScale(scale) {
        this.scale = Math.max(0, scale);
    }

    /**
     * Check if point is inside button bounds
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {boolean}
     */
    containsPoint(px, py) {
        if (!this.visible || this.scale <= 0) {
            return false;
        }

        const hw = (this.width * this.scale) / 2;
        const hh = (this.height * this.scale) / 2;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        return px >= cx - hw && px <= cx + hw &&
               py >= cy - hh && py <= cy + hh;
    }

    /**
     * Handle click event
     */
    handleClick() {
        if (this.onClick && this.visible && this.scale > 0) {
            this.onClick();
        }
    }

    /**
     * Update button state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        // Could add hover effects or animations
    }

    /**
     * Render button
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.visible || this.scale <= 0) {
            return;
        }

        ctx.save();

        const cx = Math.floor(this.x + this.width / 2);
        const cy = Math.floor(this.y + this.height / 2);

        ctx.translate(cx, cy);
        ctx.scale(this.scale, this.scale);

        // Button background
        ctx.fillStyle = this.color;
        ctx.fillRect(
            Math.floor(-this.width / 2),
            Math.floor(-this.height / 2),
            this.width,
            this.height
        );

        // Button border
        ctx.strokeStyle = this.textColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            Math.floor(-this.width / 2),
            Math.floor(-this.height / 2),
            this.width,
            this.height
        );

        // Button text
        ctx.fillStyle = this.textColor;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 1);

        ctx.restore();
    }
}

export default Button;
