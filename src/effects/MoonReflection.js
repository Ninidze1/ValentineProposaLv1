// MoonReflection.js - Shimmering moon reflection on water
class MoonReflection {
    constructor(moonX = 400, waterY = 140) {
        this.moonX = moonX;
        this.waterY = waterY;
        this.time = 0;
        this.segments = [];

        // Create reflection segments
        for (let i = 0; i < 20; i++) {
            this.segments.push({
                offset: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 1.5,
                width: 2 + Math.random() * 4
            });
        }
    }

    update(dt) {
        this.time += dt;
    }

    render(ctx) {
        const reflectionLength = 80;
        const startY = this.waterY + 5;

        // Draw shimmering reflection path
        this.segments.forEach((seg, i) => {
            const y = startY + (i / this.segments.length) * reflectionLength;
            const shimmer = Math.sin(this.time * seg.speed + seg.offset);
            const xOffset = shimmer * (5 + i * 0.5);

            // Calculate fade based on distance
            const fade = 1 - (i / this.segments.length);
            ctx.globalAlpha = fade * 0.4 * (0.6 + shimmer * 0.4);

            // Main reflection
            ctx.fillStyle = '#ffeeee';
            ctx.fillRect(
                Math.floor(this.moonX + xOffset - seg.width / 2),
                Math.floor(y),
                Math.ceil(seg.width),
                3
            );

            // Glow
            ctx.globalAlpha = fade * 0.15;
            ctx.fillStyle = '#ffaaaa';
            ctx.fillRect(
                Math.floor(this.moonX + xOffset - seg.width - 2),
                Math.floor(y),
                Math.ceil(seg.width * 2 + 4),
                4
            );
        });

        ctx.globalAlpha = 1;
    }
}
