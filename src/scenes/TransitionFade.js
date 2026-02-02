// TransitionFade.js - Fade to black transition
class TransitionFade extends State {
    enter(params = {}) {
        this.nextScene = params.nextScene || 'sceneA';
        this.duration = params.duration || 0.5;
        this.timer = 0;
        this.phase = 'fadeOut';
        this.switched = false;
    }

    update(dt) {
        this.timer += dt;

        if (this.phase === 'fadeOut' && this.timer >= this.duration && !this.switched) {
            this.switched = true;
            this.timer = 0;
            this.phase = 'fadeIn';
            // Switch to next scene
            this.machine.setState(this.nextScene);
        }
    }

    render(ctx) {
        let alpha;
        if (this.phase === 'fadeOut') {
            alpha = Math.min(1, this.timer / this.duration);
        } else {
            alpha = Math.max(0, 1 - (this.timer / this.duration));
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    }
}
