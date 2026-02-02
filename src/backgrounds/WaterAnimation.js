// WaterAnimation.js - Animated water tiles (darker theme)
class WaterAnimation {
    constructor(yStart = 140) {
        this.yStart = yStart;
        this.time = 0;
        this.waveAmplitude = 2;
        this.waveFrequency = 0.04;
        this.waveSpeed = 1.5;
    }

    update(dt) {
        this.time += dt;
    }

    render(ctx) {
        const waterHeight = INTERNAL_HEIGHT - this.yStart;

        // Dark water gradient with pink/purple romantic tint
        const gradient = ctx.createLinearGradient(0, this.yStart, 0, INTERNAL_HEIGHT);
        gradient.addColorStop(0, '#3a2a4a');
        gradient.addColorStop(0.3, '#2a1a3a');
        gradient.addColorStop(1, '#1a0a2a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.yStart, INTERNAL_WIDTH, waterHeight);

        // Wave lines - subtle pink tint
        ctx.strokeStyle = 'rgba(255, 200, 220, 0.1)';
        ctx.lineWidth = 1;

        for (let y = this.yStart + 8; y < INTERNAL_HEIGHT; y += 15) {
            ctx.beginPath();
            for (let x = 0; x <= INTERNAL_WIDTH; x += 5) {
                const waveY = y + Math.sin((x * this.waveFrequency) + (this.time * this.waveSpeed) + y * 0.08) * this.waveAmplitude;
                if (x === 0) {
                    ctx.moveTo(x, waveY);
                } else {
                    ctx.lineTo(x, waveY);
                }
            }
            ctx.stroke();
        }

        // Surface shimmer - pink tint
        ctx.fillStyle = 'rgba(255, 200, 220, 0.08)';
        for (let i = 0; i < 12; i++) {
            const shimmerX = ((this.time * 15 + i * 40) % (INTERNAL_WIDTH + 20)) - 10;
            const shimmerY = this.yStart + 3 + Math.sin(this.time * 2 + i) * 2;
            ctx.fillRect(Math.floor(shimmerX), Math.floor(shimmerY), 10, 1);
        }
    }
}
