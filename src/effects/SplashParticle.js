// SplashParticle.js - Water splash particles
class SplashParticle extends Particle {
    constructor(x, y) {
        super(x, y, {
            vx: (Math.random() - 0.5) * 40,
            vy: -40 - Math.random() * 50,
            life: 0.4 + Math.random() * 0.3,
            gravity: 180,
            scale: 1 + Math.random() * 2,
            color: '#aaddff'
        });
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.max(1, Math.floor(this.scale)),
            0, Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
    }
}

class SplashEffect {
    constructor() {
        this.particles = [];
        this.isDead = false;
    }

    emit(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new SplashParticle(x, y));
        }
    }

    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => !p.isDead);
    }

    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }
}
