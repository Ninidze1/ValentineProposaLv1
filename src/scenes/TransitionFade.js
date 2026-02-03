/**
 * @fileoverview Fade to black transition between scenes
 * @module scenes/TransitionFade
 */

import { State } from '../core/StateMachine.js';
import { INTERNAL_WIDTH, INTERNAL_HEIGHT, TIMING } from '../utils/constants.js';

/**
 * @typedef {Object} TransitionParams
 * @property {string} [nextScene='sceneA'] - Scene to transition to
 * @property {number} [duration=0.5] - Transition duration in seconds
 */

/**
 * Fade to black transition effect
 */
export class TransitionFade extends State {
    /** @type {string} */
    #nextScene = 'sceneA';

    /** @type {number} */
    #duration = TIMING.TRANSITION_DURATION;

    /** @type {number} */
    #timer = 0;

    /** @type {'fadeOut'|'fadeIn'} */
    #phase = 'fadeOut';

    /** @type {boolean} */
    #switched = false;

    /**
     * Enter transition state
     * @param {TransitionParams} [params] - Transition parameters
     */
    enter(params = {}) {
        this.#nextScene = params.nextScene ?? 'sceneA';
        this.#duration = params.duration ?? TIMING.TRANSITION_DURATION;
        this.#timer = 0;
        this.#phase = 'fadeOut';
        this.#switched = false;
    }

    /**
     * Update transition state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.#timer += dt;

        if (this.#phase === 'fadeOut' && this.#timer >= this.#duration && !this.#switched) {
            this.#switched = true;
            this.#timer = 0;
            this.#phase = 'fadeIn';
            // Switch to next scene
            this.machine.setState(this.#nextScene);
        }
    }

    /**
     * Render transition overlay
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        let alpha;

        if (this.#phase === 'fadeOut') {
            alpha = Math.min(1, this.#timer / this.#duration);
        } else {
            alpha = Math.max(0, 1 - (this.#timer / this.#duration));
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    }
}

export default TransitionFade;
