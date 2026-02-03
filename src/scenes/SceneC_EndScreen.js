// SceneC_EndScreen.js - Final celebration screen
class SceneC_EndScreen extends Scene {
    setup(params) {
        this.time = 0;
        this.heartSpawnTimer = 0;
        this.floatingHearts = [];

        // Create pixel stars array
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * INTERNAL_WIDTH,
                y: Math.random() * INTERNAL_HEIGHT,
                size: Math.random() < 0.3 ? 2 : 1,  // Some bigger stars
                twinkleSpeed: 1 + Math.random() * 3,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Replay button - pink theme
        this.replayButton = new Button({
            x: INTERNAL_WIDTH / 2 - 35,
            y: INTERNAL_HEIGHT - 40,
            width: 70,
            height: 22,
            text: "REPLAY",
            color: '#ff6b6b',
            onClick: () => {
                this.game.stateMachine.setState('sceneA');
            }
        });
        this.ui.push(this.replayButton);

        // Initial hearts
        for (let i = 0; i < 15; i++) {
            this.spawnFloatingHeart();
        }

        // Touch hearts effect
        this.touchHearts = new TouchHearts();
        this.shootingStars = new ShootingStars();
    }

    spawnFloatingHeart() {
        this.floatingHearts.push({
            x: Math.random() * INTERNAL_WIDTH,
            y: INTERNAL_HEIGHT + 10,
            speed: 20 + Math.random() * 25,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 1 + Math.random() * 2,
            size: 4 + Math.random() * 5,
            color: ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e'][Math.floor(Math.random() * 4)]
        });
    }

    update(dt) {
        super.update(dt);
        this.time += dt;

        this.heartSpawnTimer += dt;
        if (this.heartSpawnTimer >= 0.4) {
            this.heartSpawnTimer = 0;
            this.spawnFloatingHeart();
        }

        this.floatingHearts.forEach(heart => {
            heart.y -= heart.speed * dt;
            heart.wobble += heart.wobbleSpeed * dt;
            heart.x += Math.sin(heart.wobble) * 0.6;
        });

        this.floatingHearts = this.floatingHearts.filter(h => h.y > -20);

        this.touchHearts.update(dt);
        this.shootingStars.update(dt);
    }

    handleClick(x, y) {
        // Spawn hearts on click anywhere
        this.touchHearts.emit(x, y, 5);
        return super.handleClick(x, y);
    }

    renderBackground(ctx) {
        // Dark gradient with pink tint
        const gradient = ctx.createLinearGradient(0, 0, 0, INTERNAL_HEIGHT);
        gradient.addColorStop(0, '#1a0a14');
        gradient.addColorStop(0.5, '#2a1a24');
        gradient.addColorStop(1, '#14080f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

        // Pixel art stars
        this.stars.forEach(star => {
            const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
            ctx.globalAlpha = twinkle;

            if (star.size === 2) {
                // 4-point pixel star (bigger)
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 1, 1);
                ctx.fillRect(Math.floor(star.x) - 1, Math.floor(star.y), 1, 1);
                ctx.fillRect(Math.floor(star.x) + 1, Math.floor(star.y), 1, 1);
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y) - 1, 1, 1);
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y) + 1, 1, 1);
                // Pink tint on some
                if (Math.sin(star.twinkleOffset) > 0) {
                    ctx.fillStyle = '#ffaaaa';
                    ctx.globalAlpha = twinkle * 0.3;
                    ctx.fillRect(Math.floor(star.x) - 1, Math.floor(star.y) - 1, 1, 1);
                    ctx.fillRect(Math.floor(star.x) + 1, Math.floor(star.y) - 1, 1, 1);
                    ctx.fillRect(Math.floor(star.x) - 1, Math.floor(star.y) + 1, 1, 1);
                    ctx.fillRect(Math.floor(star.x) + 1, Math.floor(star.y) + 1, 1, 1);
                }
            } else {
                // Simple 1px star
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 1, 1);
            }
        });
        ctx.globalAlpha = 1;

        // Shooting stars
        this.shootingStars.render(ctx);
    }

    render(ctx) {
        this.renderBackground(ctx);

        // Floating hearts
        this.floatingHearts.forEach(heart => {
            ctx.fillStyle = heart.color;
            this.drawPixelHeart(ctx, heart.x, heart.y, heart.size);
        });

        // Main message with pink glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff6b6b';

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("And they lived happily", INTERNAL_WIDTH / 2, 70);
        ctx.fillText("ever after,", INTERNAL_WIDTH / 2, 90);
        ctx.fillText("forever and always", INTERNAL_WIDTH / 2, 110);

        ctx.shadowBlur = 0;

        // Big central heart - pink
        const heartPulse = 1 + Math.sin(this.time * 3) * 0.1;
        ctx.save();
        ctx.translate(INTERNAL_WIDTH / 2, 160);
        ctx.scale(heartPulse, heartPulse);
        ctx.fillStyle = '#ff6b6b';
        this.drawPixelHeart(ctx, 0, 0, 20);
        ctx.restore();

        // Gio + Talula text - pink
        ctx.fillStyle = '#ff9a9a';
        ctx.font = '14px monospace';
        ctx.fillText("Gio + Talula", INTERNAL_WIDTH / 2, 200);

        // UI
        this.ui.forEach(u => u.render(ctx));

        // Touch hearts on top
        this.touchHearts.render(ctx);
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
