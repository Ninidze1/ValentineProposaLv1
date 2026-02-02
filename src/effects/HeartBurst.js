// HeartBurst.js - Heart particle explosion effect (muted colors)
class HeartParticle extends Particle {
    constructor(x, y, config) {
        super(x, y, config);
        this.size = config.size || 4;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(Math.floor(this.x), Math.floor(this.y));
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);

        ctx.fillStyle = this.color;
        const s = this.size;

        // Pixel heart shape
        ctx.fillRect(-s, -s/2, s/2, s/2);
        ctx.fillRect(s/2, -s/2, s/2, s/2);
        ctx.fillRect(-s - s/2, 0, s/2, s/2);
        ctx.fillRect(s, 0, s/2, s/2);
        ctx.fillRect(-s, 0, s*2, s/2);
        ctx.fillRect(-s + s/2, s/2, s, s/2);
        ctx.fillRect(0, s, s/2, s/2);

        ctx.restore();
    }
}

class HeartBurst extends ParticleEmitter {
    constructor(x, y, count = 30) {
        super({ oneShot: true });
        // Pink romantic colors
        this.colors = ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e', '#ffaaaa', '#ffffff'];
        this.emit(x, y, count);
    }

    createParticle(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 100;

        return new HeartParticle(x, y, {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 30,
            life: 1.0 + Math.random() * 0.5,
            gravity: 100,
            friction: 0.97,
            scale: 0.6 + Math.random() * 0.8,
            rotationSpeed: (Math.random() - 0.5) * 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            size: 3 + Math.floor(Math.random() * 4)
        });
    }
}
