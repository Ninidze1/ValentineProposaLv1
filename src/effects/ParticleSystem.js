// ParticleSystem.js - Base particle classes
class Particle {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.life = config.life || 1;
        this.maxLife = this.life;
        this.gravity = config.gravity || 0;
        this.friction = config.friction || 1;
        this.scale = config.scale || 1;
        this.rotation = config.rotation || 0;
        this.rotationSpeed = config.rotationSpeed || 0;
        this.color = config.color || COLORS.white;
        this.isDead = false;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.rotation += this.rotationSpeed * dt;

        this.life -= dt;
        if (this.life <= 0) {
            this.isDead = true;
        }
    }

    get alpha() {
        return Math.max(0, this.life / this.maxLife);
    }

    render(ctx) {
        // Override in subclasses
    }
}

class ParticleEmitter {
    constructor(config = {}) {
        this.particles = [];
        this.config = config;
        this.isDead = false;
        this.oneShot = config.oneShot || false;
    }

    emit(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(x, y);
            this.particles.push(particle);
        }
    }

    createParticle(x, y) {
        return new Particle(x, y, this.config);
    }

    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => !p.isDead);

        if (this.particles.length === 0 && this.oneShot) {
            this.isDead = true;
        }
    }

    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }
}
