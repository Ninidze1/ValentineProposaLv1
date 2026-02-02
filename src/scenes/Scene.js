// Scene.js - Base scene class
class Scene extends State {
    constructor(game) {
        super();
        this.game = game;
        this.entities = [];
        this.effects = [];
        this.ui = [];
    }

    enter(params) {
        this.setup(params);
    }

    exit() {
        this.cleanup();
    }

    setup(params) {
        // Override in subclasses
    }

    cleanup() {
        this.entities = [];
        this.effects = [];
        this.ui = [];
    }

    update(dt) {
        this.entities.forEach(e => e.update(dt));
        this.effects.forEach(e => e.update(dt));
        this.ui.forEach(u => u.update(dt));

        // Remove dead effects
        this.effects = this.effects.filter(e => !e.isDead);
    }

    render(ctx) {
        this.renderBackground(ctx);
        this.entities.forEach(e => e.render(ctx));
        this.effects.forEach(e => e.render(ctx));
        this.ui.forEach(u => u.render(ctx));
    }

    renderBackground(ctx) {
        // Override in subclasses
    }

    handleClick(x, y) {
        // Check UI elements first
        for (const uiElement of this.ui) {
            if (uiElement.handleClick && uiElement.handleClick(x, y)) {
                return true;
            }
        }
        return false;
    }
}
