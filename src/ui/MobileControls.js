/**
 * @fileoverview Mobile touch controls with pixel art arrow buttons
 * @module ui/MobileControls
 */

import { INTERNAL_WIDTH, INTERNAL_HEIGHT } from '../utils/constants.js';

// Button dimensions - 2:1 ratio (width:height)
const BUTTON_WIDTH = 50;
const BUTTON_HEIGHT = 25;
const BUTTON_MARGIN = 15;
const BUTTON_GAP = 8;
const BUTTON_Y = INTERNAL_HEIGHT - BUTTON_HEIGHT - BUTTON_MARGIN;

/**
 * Mobile touch controls with left/right arrow buttons
 */
export class MobileControls {
    /** @type {boolean} */
    #visible = true;

    /** @type {boolean} */
    #leftPressed = false;

    /** @type {boolean} */
    #rightPressed = false;

    /** @type {{x: number, y: number, width: number, height: number}} */
    #leftButton;

    /** @type {{x: number, y: number, width: number, height: number}} */
    #rightButton;

    constructor() {
        this.#leftButton = {
            x: BUTTON_MARGIN,
            y: BUTTON_Y,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        };

        this.#rightButton = {
            x: BUTTON_MARGIN + BUTTON_WIDTH + BUTTON_GAP,
            y: BUTTON_Y,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT
        };
    }

    /**
     * Check if left is pressed
     * @returns {boolean}
     */
    get leftPressed() {
        return this.#leftPressed;
    }

    /**
     * Check if right is pressed
     * @returns {boolean}
     */
    get rightPressed() {
        return this.#rightPressed;
    }

    /**
     * Get visibility
     * @returns {boolean}
     */
    get visible() {
        return this.#visible;
    }

    /**
     * Hide controls
     */
    hide() {
        this.#visible = false;
    }

    /**
     * Show controls
     */
    show() {
        this.#visible = true;
    }

    /**
     * Check if point is inside a button
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @param {{x: number, y: number, width: number, height: number}} btn - Button
     * @returns {boolean}
     */
    #isInsideButton(px, py, btn) {
        return px >= btn.x && px <= btn.x + btn.width &&
               py >= btn.y && py <= btn.y + btn.height;
    }

    /**
     * Handle touch/mouse down
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {boolean} True if a control was pressed
     */
    handleDown(x, y) {
        if (!this.#visible) return false;

        if (this.#isInsideButton(x, y, this.#leftButton)) {
            this.#leftPressed = true;
            return true;
        }

        if (this.#isInsideButton(x, y, this.#rightButton)) {
            this.#rightPressed = true;
            return true;
        }

        return false;
    }

    /**
     * Handle touch/mouse up
     */
    handleUp() {
        this.#leftPressed = false;
        this.#rightPressed = false;
    }

    /**
     * Handle touch move (for dragging between buttons)
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    handleMove(x, y) {
        if (!this.#visible) return;

        // Update button states based on current touch position
        this.#leftPressed = this.#isInsideButton(x, y, this.#leftButton);
        this.#rightPressed = this.#isInsideButton(x, y, this.#rightButton);
    }

    /**
     * Update (currently unused)
     * @param {number} dt - Delta time
     */
    update(dt) {
        // No animation needed
    }

    /**
     * Render the controls
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.#visible) return;

        this.#renderButton(ctx, this.#leftButton, 'left', this.#leftPressed);
        this.#renderButton(ctx, this.#rightButton, 'right', this.#rightPressed);
    }

    /**
     * Render a single button
     * @param {CanvasRenderingContext2D} ctx
     * @param {{x: number, y: number, width: number, height: number}} btn
     * @param {'left'|'right'} direction
     * @param {boolean} pressed
     */
    #renderButton(ctx, btn, direction, pressed) {
        const { x, y, width, height } = btn;

        // Button background
        ctx.fillStyle = pressed ? 'rgba(255, 107, 107, 0.6)' : 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x, y, width, height);

        // Button border
        ctx.strokeStyle = pressed ? '#ff6b6b' : 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Arrow
        ctx.fillStyle = pressed ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
        this.#drawPixelArrow(ctx, x + width / 2, y + height / 2, direction);
    }

    /**
     * Draw a pixel art arrow
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {'left'|'right'} direction
     */
    #drawPixelArrow(ctx, cx, cy, direction) {
        const pixelSize = 3;
        const flip = direction === 'right' ? 1 : -1;

        // Arrow pattern (pointing right, flip for left)
        // . . X .
        // . . X X
        // X X X X X
        // . . X X
        // . . X .
        const pattern = [
            [0, -2],
            [0, -1], [1, -1],
            [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0],
            [0, 1], [1, 1],
            [0, 2]
        ];

        for (const [px, py] of pattern) {
            ctx.fillRect(
                cx + (px * flip * pixelSize) - pixelSize / 2,
                cy + (py * pixelSize) - pixelSize / 2,
                pixelSize,
                pixelSize
            );
        }
    }
}

export default MobileControls;
