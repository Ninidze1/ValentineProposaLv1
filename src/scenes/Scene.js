/**
 * @fileoverview Base scene class for game states
 * @module scenes/Scene
 */

import { State } from '../core/StateMachine.js';

/**
 * @typedef {Object} SceneParams
 * @property {*} [data] - Optional scene data
 */

/**
 * Base scene class that provides common functionality for all game scenes.
 * Extends State to work with the StateMachine.
 */
export class Scene extends State {
    /** @type {import('../Game.js').default} */
    game;

    /** @type {Array<{update: function(number): void, render: function(CanvasRenderingContext2D): void}>} */
    entities = [];

    /** @type {Array<{update: function(number): void, render: function(CanvasRenderingContext2D): void, isDead?: boolean}>} */
    effects = [];

    /** @type {Array<{update: function(number): void, render: function(CanvasRenderingContext2D): void, handleClick?: function(number, number): boolean}>} */
    ui = [];

    /**
     * @param {import('../Game.js').default} game - Game instance
     */
    constructor(game) {
        super();
        this.game = game;
    }

    /**
     * Called when entering the scene
     * @param {SceneParams} [params] - Scene parameters
     */
    enter(params) {
        this.setup(params);
    }

    /**
     * Called when exiting the scene
     */
    exit() {
        this.cleanup();
    }

    /**
     * Setup scene - override in subclasses
     * @param {SceneParams} [params] - Scene parameters
     */
    setup(params) {
        // Override in subclasses
    }

    /**
     * Cleanup scene resources
     */
    cleanup() {
        this.entities = [];
        this.effects = [];
        this.ui = [];
    }

    /**
     * Update scene state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        for (const entity of this.entities) {
            entity.update(dt);
        }

        for (const effect of this.effects) {
            effect.update(dt);
        }

        for (const uiElement of this.ui) {
            uiElement.update(dt);
        }

        // Remove dead effects
        this.effects = this.effects.filter(e => !e.isDead);
    }

    /**
     * Render scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        this.renderBackground(ctx);

        for (const entity of this.entities) {
            entity.render(ctx);
        }

        for (const effect of this.effects) {
            effect.render(ctx);
        }

        for (const uiElement of this.ui) {
            uiElement.render(ctx);
        }
    }

    /**
     * Render background - override in subclasses
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderBackground(ctx) {
        // Override in subclasses
    }

    /**
     * Handle click event
     * @param {number} x - Click X position
     * @param {number} y - Click Y position
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        // Check UI elements first (reverse order for top-most first)
        for (let i = this.ui.length - 1; i >= 0; i--) {
            const uiElement = this.ui[i];
            if (uiElement.handleClick && uiElement.handleClick(x, y)) {
                return true;
            }
        }
        return false;
    }
}

export default Scene;
