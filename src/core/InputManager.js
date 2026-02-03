/**
 * @fileoverview Mouse and touch input handling
 * @module core/InputManager
 */

/**
 * @callback ClickCallback
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 */

/**
 * @callback MoveCallback
 * @param {number} x - X coordinate in canvas space
 * @param {number} y - Y coordinate in canvas space
 */

/**
 * Handles mouse and touch input with canvas coordinate conversion
 */
export class InputManager {
    /** @type {import('./Canvas.js').Canvas} */
    #canvasObj;

    /** @type {HTMLCanvasElement} */
    #canvas;

    /** @type {ClickCallback|null} */
    #onClick = null;

    /** @type {MoveCallback|null} */
    #onMove = null;

    /** @type {number} */
    #mouseX = 0;

    /** @type {number} */
    #mouseY = 0;

    /** @type {boolean} */
    #isPressed = false;

    /** @type {Set<string>} */
    #keysPressed = new Set();

    /** @type {AbortController} */
    #abortController;

    /**
     * @param {import('./Canvas.js').Canvas} canvasObj - Canvas wrapper instance
     */
    constructor(canvasObj) {
        this.#canvasObj = canvasObj;
        this.#canvas = canvasObj.canvas;
        this.#abortController = new AbortController();

        this.#setupListeners();
    }

    /**
     * Set click callback
     * @param {ClickCallback} callback
     */
    set onClick(callback) {
        this.#onClick = callback;
    }

    /**
     * Get click callback
     * @returns {ClickCallback|null}
     */
    get onClick() {
        return this.#onClick;
    }

    /**
     * Set move callback
     * @param {MoveCallback} callback
     */
    set onMove(callback) {
        this.#onMove = callback;
    }

    /**
     * Get move callback
     * @returns {MoveCallback|null}
     */
    get onMove() {
        return this.#onMove;
    }

    /**
     * Get current mouse X position
     * @returns {number}
     */
    get mouseX() {
        return this.#mouseX;
    }

    /**
     * Get current mouse Y position
     * @returns {number}
     */
    get mouseY() {
        return this.#mouseY;
    }

    /**
     * Check if mouse/touch is pressed
     * @returns {boolean}
     */
    get isPressed() {
        return this.#isPressed;
    }

    /**
     * Check if a key is currently pressed
     * @param {string} key - Key code (e.g., 'ArrowLeft', 'ArrowRight')
     * @returns {boolean}
     */
    isKeyPressed(key) {
        return this.#keysPressed.has(key);
    }

    /**
     * Set up all event listeners
     */
    #setupListeners() {
        const signal = this.#abortController.signal;

        // Mouse events
        this.#canvas.addEventListener('click', (e) => this.#handleClick(e), { signal });
        this.#canvas.addEventListener('mousemove', (e) => this.#handleMove(e), { signal });
        this.#canvas.addEventListener('mousedown', () => { this.#isPressed = true; }, { signal });
        this.#canvas.addEventListener('mouseup', () => { this.#isPressed = false; }, { signal });

        // Touch events
        this.#canvas.addEventListener('touchstart', (e) => this.#handleTouchStart(e), { passive: false, signal });
        this.#canvas.addEventListener('touchend', (e) => this.#handleTouchEnd(e), { passive: false, signal });
        this.#canvas.addEventListener('touchmove', (e) => this.#handleTouchMove(e), { passive: false, signal });

        // Keyboard events
        window.addEventListener('keydown', (e) => this.#handleKeyDown(e), { signal });
        window.addEventListener('keyup', (e) => this.#handleKeyUp(e), { signal });
    }

    /**
     * Handle key down event
     * @param {KeyboardEvent} e
     */
    #handleKeyDown(e) {
        if (e.key.startsWith('Arrow')) {
            e.preventDefault();
        }
        this.#keysPressed.add(e.key);
    }

    /**
     * Handle key up event
     * @param {KeyboardEvent} e
     */
    #handleKeyUp(e) {
        this.#keysPressed.delete(e.key);
    }

    /**
     * Handle touch start event
     * @param {TouchEvent} e
     */
    #handleTouchStart(e) {
        e.preventDefault();
        this.#isPressed = true;

        const touch = e.touches[0];
        this.#handleMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    /**
     * Handle touch end event
     * @param {TouchEvent} e
     */
    #handleTouchEnd(e) {
        e.preventDefault();
        this.#isPressed = false;

        if (e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            this.#handleClick({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    /**
     * Handle touch move event
     * @param {TouchEvent} e
     */
    #handleTouchMove(e) {
        e.preventDefault();

        const touch = e.touches[0];
        this.#handleMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    /**
     * Handle click/tap event
     * @param {{clientX: number, clientY: number}} e
     */
    #handleClick(e) {
        const pos = this.#canvasObj.screenToCanvas(e.clientX, e.clientY);

        if (this.#onClick) {
            this.#onClick(pos.x, pos.y);
        }
    }

    /**
     * Handle mouse move event
     * @param {{clientX: number, clientY: number}} e
     */
    #handleMove(e) {
        const pos = this.#canvasObj.screenToCanvas(e.clientX, e.clientY);

        this.#mouseX = pos.x;
        this.#mouseY = pos.y;

        if (this.#onMove) {
            this.#onMove(pos.x, pos.y);
        }
    }

    /**
     * Clean up all event listeners
     */
    destroy() {
        this.#abortController.abort();
    }
}

export default InputManager;
