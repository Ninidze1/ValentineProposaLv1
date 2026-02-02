// Ripple.js - Water ripple effect
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = 15;
        this.life = 1;
        this.isDead = false;
    }

    update(dt) {
        this.radius += dt * 15;
        this.life -= dt;

        if (this.life <= 0 || this.radius >= this.maxRadius) {
            this.isDead = true;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.radius),
            Math.floor(this.radius * 0.4),
            0, 0, Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }
}

class RippleEffect {
    constructor() {
        this.ripples = [];
        this.isDead = false;
    }

    emit(x, y) {
        this.ripples.push(new Ripple(x, y));
    }

    update(dt) {
        this.ripples.forEach(r => r.update(dt));
        this.ripples = this.ripples.filter(r => !r.isDead);
    }

    render(ctx) {
        this.ripples.forEach(r => r.render(ctx));
    }
}
