// ShootingStar.js - Occasional shooting stars across the sky
class ShootingStars {
    constructor() {
        this.stars = [];
        this.spawnTimer = 3 + Math.random() * 5; // First star in 3-8 seconds
    }

    update(dt) {
        // Spawn new shooting stars occasionally
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawn();
            this.spawnTimer = 5 + Math.random() * 10; // Next star in 5-15 seconds
        }

        // Update existing stars
        this.stars.forEach(star => {
            star.x += star.vx * dt;
            star.y += star.vy * dt;
            star.life -= dt;
            star.trail.unshift({ x: star.x, y: star.y });
            if (star.trail.length > 12) {
                star.trail.pop();
            }
        });

        // Remove dead stars
        this.stars = this.stars.filter(s => s.life > 0);
    }

    spawn() {
        const startX = Math.random() * INTERNAL_WIDTH * 0.7;
        const startY = Math.random() * 60 + 10;

        this.stars.push({
            x: startX,
            y: startY,
            vx: 150 + Math.random() * 100,
            vy: 40 + Math.random() * 30,
            life: 0.8 + Math.random() * 0.4,
            trail: []
        });
    }

    render(ctx) {
        this.stars.forEach(star => {
            // Draw trail
            star.trail.forEach((point, i) => {
                const alpha = (1 - i / star.trail.length) * (star.life / 1.2);
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = i < 3 ? '#ffffff' : '#ffcccc';
                const size = Math.max(1, 3 - i * 0.2);
                ctx.fillRect(Math.floor(point.x), Math.floor(point.y), Math.ceil(size), 1);
            });

            // Draw head
            ctx.globalAlpha = Math.min(1, star.life);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 2, 2);

            ctx.globalAlpha = 1;
        });
    }
}
