// Fireflies.js - Atmospheric floating lights
class Fireflies {
    constructor(count = 15) {
        this.fireflies = [];
        for (let i = 0; i < count; i++) {
            this.spawn();
        }
    }

    spawn() {
        this.fireflies.push({
            x: Math.random() * INTERNAL_WIDTH,
            y: 100 + Math.random() * 150,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 10,
            size: 1 + Math.random() * 2,
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: 1 + Math.random() * 2,
            color: Math.random() > 0.5 ? '#ffee88' : '#ffccaa'
        });
    }

    update(dt) {
        this.fireflies.forEach(f => {
            // Gentle wandering movement
            f.x += f.vx * dt;
            f.y += f.vy * dt;

            // Slowly change direction
            f.vx += (Math.random() - 0.5) * 20 * dt;
            f.vy += (Math.random() - 0.5) * 15 * dt;

            // Limit speed
            f.vx = Math.max(-20, Math.min(20, f.vx));
            f.vy = Math.max(-15, Math.min(15, f.vy));

            // Wrap around screen
            if (f.x < -10) f.x = INTERNAL_WIDTH + 10;
            if (f.x > INTERNAL_WIDTH + 10) f.x = -10;
            if (f.y < 80) f.vy += 5 * dt;
            if (f.y > 240) f.vy -= 5 * dt;

            // Update glow
            f.glowPhase += f.glowSpeed * dt;
        });
    }

    render(ctx) {
        this.fireflies.forEach(f => {
            const glow = Math.sin(f.glowPhase) * 0.4 + 0.6;

            // Outer glow
            ctx.globalAlpha = glow * 0.3;
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size * 3, 0, Math.PI * 2);
            ctx.fill();

            // Inner bright core
            ctx.globalAlpha = glow;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.floor(f.x), Math.floor(f.y), Math.ceil(f.size), Math.ceil(f.size));

            ctx.globalAlpha = 1;
        });
    }
}
