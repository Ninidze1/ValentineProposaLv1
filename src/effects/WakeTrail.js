// WakeTrail.js - Swimming wake effect
class WakeParticle extends Particle {
    constructor(x, y) {
        super(x, y, {
            vx: 0,
            vy: 3,
            life: 1.2,
            scale: 2,
            color: 'rgba(255, 255, 255, 0.4)'
        });
        this.initialScale = 2;
    }

    update(dt) {
        super.update(dt);
        // Expand over time
        this.scale = this.initialScale + (1 - this.alpha) * 8;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha * 0.4;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.scale * 2),
            Math.floor(this.scale),
            0, 0, Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
    }
}

class WakeTrail {
    constructor() {
        this.particles = [];
        this.isDead = false;
    }

    emit(x, y) {
        this.particles.push(new WakeParticle(x, y));
    }

    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => !p.isDead);
    }

    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }
}
