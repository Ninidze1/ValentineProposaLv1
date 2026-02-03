// DynamicWaves.js - More dynamic water waves
class DynamicWaves {
    constructor(waterY = 140) {
        this.waterY = waterY;
        this.time = 0;
        this.waves = [];

        // Create multiple wave layers
        for (let i = 0; i < 4; i++) {
            this.waves.push({
                amplitude: 2 + i * 1.5,
                frequency: 0.02 - i * 0.003,
                speed: 0.8 + i * 0.3,
                phase: Math.random() * Math.PI * 2,
                alpha: 0.3 - i * 0.05,
                color: i % 2 === 0 ? '#3a2a34' : '#2a1a24'
            });
        }
    }

    update(dt) {
        this.time += dt;
    }

    render(ctx) {
        // Draw each wave layer
        this.waves.forEach((wave, index) => {
            ctx.fillStyle = wave.color;
            ctx.globalAlpha = wave.alpha;

            ctx.beginPath();
            ctx.moveTo(0, INTERNAL_HEIGHT);

            // Draw wave line
            for (let x = 0; x <= INTERNAL_WIDTH; x += 4) {
                const y = this.waterY + index * 8 +
                    Math.sin(x * wave.frequency + this.time * wave.speed + wave.phase) * wave.amplitude +
                    Math.sin(x * wave.frequency * 2.3 + this.time * wave.speed * 1.5) * wave.amplitude * 0.5;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(INTERNAL_WIDTH, INTERNAL_HEIGHT);
            ctx.closePath();
            ctx.fill();
        });

        // Add foam/sparkles on wave crests
        ctx.fillStyle = '#ffffff';
        for (let x = 0; x < INTERNAL_WIDTH; x += 20) {
            const waveY = this.waterY +
                Math.sin(x * 0.02 + this.time * 0.8) * 2;
            const sparkle = Math.sin(this.time * 3 + x * 0.1);

            if (sparkle > 0.7) {
                ctx.globalAlpha = (sparkle - 0.7) / 0.3 * 0.5;
                ctx.fillRect(Math.floor(x), Math.floor(waveY), 2, 1);
            }
        }

        ctx.globalAlpha = 1;
    }
}
