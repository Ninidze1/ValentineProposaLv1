// TouchHearts.js - Spawn hearts when clicking/tapping anywhere
class TouchHearts {
    constructor() {
        this.hearts = [];
    }

    emit(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.hearts.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 40,
                vy: -30 - Math.random() * 50,
                size: 3 + Math.random() * 4,
                life: 1.0,
                rotation: Math.random() * 0.5 - 0.25,
                color: ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ffaaaa'][Math.floor(Math.random() * 4)]
            });
        }
    }

    update(dt) {
        this.hearts.forEach(h => {
            h.x += h.vx * dt;
            h.y += h.vy * dt;
            h.vy += 30 * dt; // Gentle gravity
            h.life -= dt * 0.8;
            h.rotation += dt * 2;
        });

        this.hearts = this.hearts.filter(h => h.life > 0);
    }

    render(ctx) {
        this.hearts.forEach(h => {
            ctx.globalAlpha = Math.min(1, h.life);
            ctx.fillStyle = h.color;

            ctx.save();
            ctx.translate(h.x, h.y);
            ctx.rotate(h.rotation);
            this.drawPixelHeart(ctx, 0, 0, h.size);
            ctx.restore();

            ctx.globalAlpha = 1;
        });
    }

    drawPixelHeart(ctx, x, y, size) {
        const s = size / 4;
        ctx.fillRect(x - s * 2, y - s, s, s);
        ctx.fillRect(x + s, y - s, s, s);
        ctx.fillRect(x - s * 3, y, s, s);
        ctx.fillRect(x + s * 2, y, s, s);
        ctx.fillRect(x - s * 2, y, s * 4, s);
        ctx.fillRect(x - s * 1.5, y + s, s * 3, s);
        ctx.fillRect(x - s / 2, y + s * 2, s, s);
    }
}
