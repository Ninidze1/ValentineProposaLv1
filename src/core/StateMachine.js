/**
 * @fileoverview State machine for scene management
 * @module core/StateMachine
 */

/**
 * Base state class for state machine
 * @abstract
 */
export class State {
    /** @type {StateMachine|null} */
    machine = null;

    /** @type {*} */
    owner = null;

    /**
     * Called when entering this state
     * @param {Object} [params] - Optional parameters passed during state transition
     */
    enter(params) {}

    /**
     * Called when exiting this state
     */
    exit() {}

    /**
     * Update the state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {}

    /**
     * Render the state
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {}

    /**
     * Handle click events
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        return false;
    }
}

/**
 * State machine for managing game states/scenes
 */
export class StateMachine {
    /** @type {*} */
    #owner;

    /** @type {Map<string, State>} */
    #states = new Map();

    /** @type {State|null} */
    #currentState = null;

    /** @type {string|null} */
    #currentStateName = null;

    /** @type {State|null} */
    #previousState = null;

    /**
     * @param {*} owner - Owner object (typically Game instance)
     */
    constructor(owner) {
        this.#owner = owner;
    }

    /**
     * Get current state name
     * @returns {string|null}
     */
    get currentStateName() {
        return this.#currentStateName;
    }

    /**
     * Get current state
     * @returns {State|null}
     */
    get currentState() {
        return this.#currentState;
    }

    /**
     * Get previous state
     * @returns {State|null}
     */
    get previousState() {
        return this.#previousState;
    }

    /**
     * Add a state to the machine
     * @param {string} name - State identifier
     * @param {State} state - State instance
     */
    addState(name, state) {
        state.machine = this;
        state.owner = this.#owner;
        this.#states.set(name, state);
    }

    /**
     * Remove a state from the machine
     * @param {string} name - State identifier
     * @returns {boolean} True if state was removed
     */
    removeState(name) {
        return this.#states.delete(name);
    }

    /**
     * Check if a state exists
     * @param {string} name - State identifier
     * @returns {boolean}
     */
    hasState(name) {
        return this.#states.has(name);
    }

    /**
     * Get a state by name
     * @param {string} name - State identifier
     * @returns {State|undefined}
     */
    getState(name) {
        return this.#states.get(name);
    }

    /**
     * Transition to a new state
     * @param {string} name - State identifier
     * @param {Object} [params={}] - Parameters to pass to the new state
     */
    setState(name, params = {}) {
        if (this.#currentState) {
            this.#currentState.exit();
        }

        this.#previousState = this.#currentState;
        this.#currentStateName = name;
        this.#currentState = this.#states.get(name);

        if (this.#currentState) {
            this.#currentState.enter(params);
        }
    }

    /**
     * Update the current state
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        if (this.#currentState) {
            this.#currentState.update(dt);
        }
    }

    /**
     * Render the current state
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (this.#currentState) {
            this.#currentState.render(ctx);
        }
    }

    /**
     * Handle click events in the current state
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        if (this.#currentState) {
            return this.#currentState.handleClick(x, y);
        }
        return false;
    }

    /**
     * Get number of registered states
     * @returns {number}
     */
    get stateCount() {
        return this.#states.size;
    }

    /**
     * Clear all states
     */
    clear() {
        if (this.#currentState) {
            this.#currentState.exit();
        }
        this.#states.clear();
        this.#currentState = null;
        this.#currentStateName = null;
        this.#previousState = null;
    }
}

export default StateMachine;
