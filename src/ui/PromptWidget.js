/**
 * @fileoverview YES/NO prompt widget with shrinking NO button
 * @module ui/PromptWidget
 */

import {
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    COLORS,
    PROMPT_UI,
    TIMING,
} from '../utils/constants.js';
import { smoothstep } from '../utils/math.js';

/**
 * @typedef {Object} PromptConfig
 * @property {string} question - Question text (supports \n for line breaks)
 * @property {function(): void} [onYes] - YES button callback
 * @property {function(): void} [onNo] - NO button callback
 */

/**
 * @typedef {Object} ButtonState
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} width - Button width
 * @property {number} height - Button height
 * @property {string} text - Button label
 * @property {string} color - Background color
 * @property {string} textColor - Text color
 * @property {boolean} visible - Visibility flag
 * @property {number} [scale] - Scale factor (NO button only)
 */

/**
 * YES/NO prompt widget with animated shrinking NO button
 */
export class PromptWidget {
    /** @type {string} */
    #question;

    /** @type {function(): void|null} */
    #onYes;

    /** @type {function(): void|null} */
    #onNo;

    /** @type {boolean} */
    #visible = true;

    /** @type {boolean} */
    #noButtonHidden = false;

    /** @type {string[]} */
    #questionLines;

    /** @type {number} */
    #frameX;

    /** @type {number} */
    #frameY;

    /** @type {number} */
    #frameWidth;

    /** @type {number} */
    #frameHeight;

    /** @type {number} */
    #textX;

    /** @type {number} */
    #textStartY;

    /** @type {number} */
    #buttonsY;

    /** @type {number} */
    #buttonAreaWidth;

    /** @type {number} */
    #buttonAreaX;

    /** @type {number} */
    #shrinkProgress = 0;

    /** @type {number} */
    #targetShrinkProgress = 0;

    /** @type {number} */
    #initialYesX;

    /** @type {number} */
    #initialNoX;

    /** @type {number} */
    #finalYesX;

    /** @type {number} */
    #finalYesWidth;

    /** @type {ButtonState} */
    #yesButton;

    /** @type {ButtonState} */
    #noButton;

    /**
     * @param {PromptConfig} config
     */
    constructor(config) {
        this.#question = config.question;
        this.#onYes = config.onYes ?? null;
        this.#onNo = config.onNo ?? null;

        this.#questionLines = this.#question.split('\n').map(line => line.trim());

        this.#calculateLayout();
        this.#initializeButtons();
    }

    /**
     * Calculate frame and button layout
     */
    #calculateLayout() {
        const textHeight = this.#questionLines.length * PROMPT_UI.LINE_HEIGHT;
        const contentHeight = textHeight + PROMPT_UI.TEXT_BUTTON_GAP + PROMPT_UI.BUTTON_HEIGHT;

        this.#frameHeight = contentHeight + (PROMPT_UI.PADDING * 2);
        this.#frameWidth = PROMPT_UI.FRAME_WIDTH;

        this.#frameX = (INTERNAL_WIDTH - this.#frameWidth) / 2;
        this.#frameY = INTERNAL_HEIGHT - this.#frameHeight - PROMPT_UI.BOTTOM_MARGIN;

        this.#textX = INTERNAL_WIDTH / 2;
        this.#textStartY = this.#frameY + PROMPT_UI.PADDING + 8;

        this.#buttonsY = this.#frameY + PROMPT_UI.PADDING + textHeight + PROMPT_UI.TEXT_BUTTON_GAP;
        this.#buttonAreaWidth = this.#frameWidth - 16;
        this.#buttonAreaX = this.#frameX + 8;

        // Initial button positions
        this.#initialYesX = this.#buttonAreaX + (this.#buttonAreaWidth / 2) -
            PROMPT_UI.BUTTON_WIDTH - (PROMPT_UI.BUTTON_GAP / 2);
        this.#initialNoX = this.#buttonAreaX + (this.#buttonAreaWidth / 2) + (PROMPT_UI.BUTTON_GAP / 2);

        // Final YES button state
        this.#finalYesX = this.#buttonAreaX;
        this.#finalYesWidth = this.#buttonAreaWidth;
    }

    /**
     * Initialize button states
     */
    #initializeButtons() {
        this.#yesButton = {
            x: this.#initialYesX,
            y: this.#buttonsY,
            width: PROMPT_UI.BUTTON_WIDTH,
            height: PROMPT_UI.BUTTON_HEIGHT,
            text: 'YES',
            color: COLORS.pink,
            textColor: COLORS.white,
            visible: true,
        };

        this.#noButton = {
            x: this.#initialNoX,
            y: this.#buttonsY,
            width: PROMPT_UI.BUTTON_WIDTH,
            height: PROMPT_UI.BUTTON_HEIGHT,
            text: 'NO',
            color: COLORS.gray,
            textColor: COLORS.white,
            visible: true,
            scale: 1,
        };
    }

    /**
     * Get visibility state
     * @returns {boolean}
     */
    get visible() {
        return this.#visible;
    }

    /**
     * Handle YES button click
     */
    #handleYes() {
        if (this.#onYes) {
            this.#onYes();
        }
    }

    /**
     * Handle NO button click
     */
    #handleNo() {
        if (this.#onNo) {
            this.#onNo();
        }
    }

    /**
     * Shrink the NO button
     */
    shrinkNoButton() {
        this.#targetShrinkProgress = Math.min(
            this.#targetShrinkProgress + TIMING.SHRINK_INCREMENT,
            1
        );

        if (this.#targetShrinkProgress >= 1) {
            this.#noButtonHidden = true;
        }
    }

    /**
     * Hide the prompt
     */
    hide() {
        this.#visible = false;
    }

    /**
     * Show the prompt
     */
    show() {
        this.#visible = true;
    }

    /**
     * Check which button contains the point
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {'yes'|'no'|false}
     */
    containsPoint(px, py) {
        if (!this.#visible) {
            return false;
        }

        // Check YES button
        if (px >= this.#yesButton.x &&
            px <= this.#yesButton.x + this.#yesButton.width &&
            py >= this.#yesButton.y &&
            py <= this.#yesButton.y + this.#yesButton.height) {
            return 'yes';
        }

        // Check NO button
        if (!this.#noButtonHidden && this.#noButton.scale > 0.1) {
            const noScale = this.#noButton.scale;
            const noCenterX = this.#noButton.x + PROMPT_UI.BUTTON_WIDTH / 2;
            const noCenterY = this.#noButton.y + PROMPT_UI.BUTTON_HEIGHT / 2;
            const noHalfW = (PROMPT_UI.BUTTON_WIDTH * noScale) / 2;
            const noHalfH = (PROMPT_UI.BUTTON_HEIGHT * noScale) / 2;

            if (px >= noCenterX - noHalfW &&
                px <= noCenterX + noHalfW &&
                py >= noCenterY - noHalfH &&
                py <= noCenterY + noHalfH) {
                return 'no';
            }
        }

        return false;
    }

    /**
     * Handle click event
     * @param {number} x - Click X
     * @param {number} y - Click Y
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        const hit = this.containsPoint(x, y);

        if (hit === 'yes') {
            this.#handleYes();
            return true;
        } else if (hit === 'no') {
            this.shrinkNoButton();
            this.#handleNo();
            return true;
        }

        return false;
    }

    /**
     * Update widget animation
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (!this.#visible) {
            return;
        }

        // Animate shrink progress toward target
        if (this.#shrinkProgress < this.#targetShrinkProgress) {
            this.#shrinkProgress = Math.min(
                this.#shrinkProgress + dt * TIMING.PROMPT_ANIMATION_SPEED,
                this.#targetShrinkProgress
            );
        }

        // Update NO button scale
        this.#noButton.scale = 1 - this.#shrinkProgress;

        // Ease the progress for smoother animation
        const easedP = smoothstep(this.#shrinkProgress);

        // Lerp YES button position and size
        this.#yesButton.x = this.#initialYesX +
            (this.#finalYesX - this.#initialYesX) * easedP;
        this.#yesButton.width = PROMPT_UI.BUTTON_WIDTH +
            (this.#finalYesWidth - PROMPT_UI.BUTTON_WIDTH) * easedP;

        // Move NO button to the right as it shrinks
        const yesRightEdge = this.#yesButton.x + this.#yesButton.width;
        this.#noButton.x = yesRightEdge + PROMPT_UI.BUTTON_GAP * (1 - easedP);
    }

    /**
     * Render the prompt widget
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        if (!this.#visible) {
            return;
        }

        this.#renderFrame(ctx);
        this.#renderQuestion(ctx);
        this.#renderButton(ctx, this.#yesButton, 1);

        if (!this.#noButtonHidden && this.#noButton.scale > 0.05) {
            this.#renderButton(ctx, this.#noButton, this.#noButton.scale);
        }
    }

    /**
     * Render the frame background
     * @param {CanvasRenderingContext2D} ctx
     */
    #renderFrame(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';

        const radius = PROMPT_UI.CORNER_RADIUS;
        const x = this.#frameX;
        const y = this.#frameY;
        const w = this.#frameWidth;
        const h = this.#frameHeight;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    /**
     * Render the question text
     * @param {CanvasRenderingContext2D} ctx
     */
    #renderQuestion(ctx) {
        ctx.fillStyle = COLORS.white;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';

        for (let i = 0; i < this.#questionLines.length; i++) {
            ctx.fillText(
                this.#questionLines[i],
                this.#textX,
                this.#textStartY + (i * PROMPT_UI.LINE_HEIGHT)
            );
        }
    }

    /**
     * Render a button
     * @param {CanvasRenderingContext2D} ctx
     * @param {ButtonState} btn - Button state
     * @param {number} scale - Scale factor
     */
    #renderButton(ctx, btn, scale) {
        if (scale <= 0) {
            return;
        }

        ctx.save();

        const cx = Math.floor(btn.x + btn.width / 2);
        const cy = Math.floor(btn.y + btn.height / 2);

        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Background
        ctx.fillStyle = btn.color;
        ctx.fillRect(
            Math.floor(-btn.width / 2),
            Math.floor(-btn.height / 2),
            btn.width,
            btn.height
        );

        // Border
        ctx.strokeStyle = btn.textColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            Math.floor(-btn.width / 2),
            Math.floor(-btn.height / 2),
            btn.width,
            btn.height
        );

        // Text
        ctx.fillStyle = btn.textColor;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, 0, 1);

        ctx.restore();
    }
}

export default PromptWidget;
