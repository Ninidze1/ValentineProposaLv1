// SplashParticle.js - Water splash particles
class SplashParticle extends Particle {
    constructor(x, y, options = {}) {
        const intensity = options.intensity || 1;
        super(x, y, {
            vx: (Math.random() - 0.5) * 35 * intensity,
            vy: -30 * intensity - Math.random() * 40 * intensity,
            life: 0.5 + Math.random() * 0.4,
            gravity: 150,
            scale: 1 + Math.random() * 2.5,
            color: options.color || '#b8e0ff'
        });
        this.initialScale = this.scale;
        this.shimmer = Math.random() * Math.PI * 2;
    }

    render(ctx) {
        ctx.save();

        // Fade out and shrink as particle ages
        const lifeRatio = this.life / this.maxLife;
        const fadeAlpha = this.alpha * (0.4 + lifeRatio * 0.6);
        const currentScale = this.scale * (0.5 + lifeRatio * 0.5);

        // Add shimmer effect
        const shimmerAlpha = fadeAlpha * (0.8 + Math.sin(this.shimmer + this.life * 10) * 0.2);

        ctx.globalAlpha = shimmerAlpha;

        // Draw water droplet with gradient
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, currentScale
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, 'rgba(150, 200, 255, 0.3)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.max(1, Math.floor(currentScale)),
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
