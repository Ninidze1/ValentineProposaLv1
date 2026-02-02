// StateMachine.js - State management
class State {
    constructor() {
        this.machine = null;
        this.owner = null;
    }

    enter(params) {}
    exit() {}
    update(dt) {}
    render(ctx) {}
    handleClick(x, y) { return false; }
}

class StateMachine {
    constructor(owner) {
        this.owner = owner;
        this.states = new Map();
        this.currentState = null;
        this.currentStateName = null;
        this.previousState = null;
    }

    addState(name, state) {
        state.machine = this;
        state.owner = this.owner;
        this.states.set(name, state);
    }

    setState(name, params = {}) {
        if (this.currentState) {
            this.currentState.exit();
        }

        this.previousState = this.currentState;
        this.currentStateName = name;
        this.currentState = this.states.get(name);

        if (this.currentState) {
            this.currentState.enter(params);
        }
    }

    update(dt) {
        if (this.currentState) {
            this.currentState.update(dt);
        }
    }

    render(ctx) {
        if (this.currentState) {
            this.currentState.render(ctx);
        }
    }

    handleClick(x, y) {
        if (this.currentState) {
            return this.currentState.handleClick(x, y);
        }
        return false;
    }
}
