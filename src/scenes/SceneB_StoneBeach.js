// SceneB_StoneBeach.js - Stone beach night scene with simplified ending
class SceneB_StoneBeach extends Scene {
    setup(params) {
        this.time = 0;

        // Water animation
        this.waterAnimation = new WaterAnimation(140);

        // Characters on beach - Tamo on left, Gio on right
        this.tamo = new Character(
            this.game,
            200, 230,
            this.game.assets.getImage('tamo'),
            this.game.tamoFrameWidth,
            this.game.tamoFrameHeight,
            2, 1.0  // normal size
        );
        this.tamo.setAnimation('stand');

        this.gio = new Character(
            this.game,
            280, 230,
            this.game.assets.getImage('gio'),
            this.game.gioFrameWidth,
            this.game.gioFrameHeight,
            2, 1.15  // Gio is slightly bigger (15% larger)
        );
        this.gio.setAnimation('stand');

        this.entities.push(this.gio, this.tamo);

        // Prompt widget
        this.prompt = new PromptWidget({
            question: "Will you be my Valentine tonight, and every day after?",
            onYes: () => this.onYesClicked(),
            onNo: () => this.onNoClicked()
        });
        this.ui.push(this.prompt);

        // Ending sequence state
        this.endingSequenceActive = false;
        this.endingTimer = 0;
        this.fadeAlpha = 0;
        this.switchedToSwim = false;

        // Effects
        this.splashEffect = new SplashEffect();
        this.rippleEffect = new RippleEffect();

        this.rippleTimer = 0;
    }

    onYesClicked() {
        this.endingSequenceActive = true;
        this.endingTimer = 0;
        this.prompt.hide();

        // Switch to swim sprites immediately
        const gioSwimSprite = this.game.assets.getImage('gio-swim');
        const tamoSwimSprite = this.game.assets.getImage('tamo-swim');
        if (gioSwimSprite) {
            this.gio.spritesheet = gioSwimSprite;
            this.gio.frameWidth = this.game.gioSwimFrameWidth || this.game.gioFrameWidth;
            this.gio.frameHeight = this.game.gioSwimFrameHeight || this.game.gioFrameHeight;
        }
        if (tamoSwimSprite) {
            this.tamo.spritesheet = tamoSwimSprite;
            this.tamo.frameWidth = this.game.tamoSwimFrameWidth || this.game.tamoFrameWidth;
            this.tamo.frameHeight = this.game.tamoSwimFrameHeight || this.game.tamoFrameHeight;
        }
        this.switchedToSwim = true;

        const burst = new HeartBurst(INTERNAL_WIDTH / 2, 160, 50);
        this.effects.push(burst);
    }

    onNoClicked() {
        this.prompt.shrinkNoButton(0.75);
    }

    update(dt) {
        super.update(dt);
        this.time += dt;

        this.waterAnimation.update(dt);
        this.splashEffect.update(dt);
        this.rippleEffect.update(dt);

        // Moon reflection ripples
        this.rippleTimer += dt;
        if (this.rippleTimer > 2.5) {
            this.rippleTimer = 0;
            this.rippleEffect.emit(380, 90);
        }

        if (this.endingSequenceActive) {
            this.updateEndingSequence(dt);
        }
    }

    updateEndingSequence(dt) {
        this.endingTimer += dt;
        const t = this.endingTimer;

        // Simplified timeline - walk toward water, switch to swim sprites, fade out
        // Minimal elevation - characters stay low on screen

        // 0.5s - 3s: Walk toward water (minimal movement)
        if (t >= 0.5 && t < 3.0) {
            const walkProgress = (t - 0.5) / 2.5;

            // Minimal vertical movement - just 15 pixels up
            this.gio.y = 230 - (walkProgress * 15);
            this.tamo.y = 230 - (walkProgress * 15);

            // Move closer together
            this.gio.x = lerp(280, 250, walkProgress);
            this.tamo.x = lerp(200, 230, walkProgress);

            // Add occasional splashes when in water area
            if (walkProgress > 0.5 && Math.random() < 0.15) {
                this.splashEffect.emit(this.gio.x, this.gio.y + 20, 3);
                this.splashEffect.emit(this.tamo.x, this.tamo.y + 20, 3);
            }
        }

        // 3s - 5s: Continue swimming (minimal movement)
        if (t >= 3.0 && t < 5.0) {
            const swimProgress = (t - 3.0) / 2.0;

            // Minimal vertical movement - just 10 more pixels
            this.gio.y = 215 - (swimProgress * 10);
            this.tamo.y = 215 - (swimProgress * 10);

            // Get even closer
            this.gio.x = lerp(250, 245, swimProgress);
            this.tamo.x = lerp(230, 235, swimProgress);

            // Continuous small splashes
            if (Math.random() < 0.2) {
                this.splashEffect.emit(this.gio.x, this.gio.y + 15, 2);
                this.splashEffect.emit(this.tamo.x, this.tamo.y + 15, 2);
            }
        }

        // 4s - 6s: Fade to black
        if (t >= 4.0 && t < 6.0) {
            this.fadeAlpha = (t - 4.0) / 2.0;
        }

        // 6s: Transition to end screen
        if (t >= 6.0) {
            this.game.stateMachine.setState('sceneC');
        }
    }

    renderBackground(ctx) {
        // Draw background image if available
        const bgImage = this.game.assets.getImage('background-b');
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        } else {
            // Fallback: Night sky - pink romantic theme
            const skyGradient = ctx.createLinearGradient(0, 0, 0, 140);
            skyGradient.addColorStop(0, '#0f050a');
            skyGradient.addColorStop(0.5, '#1a0a14');
            skyGradient.addColorStop(1, '#2a1a24');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, INTERNAL_WIDTH, 140);

            // Stars
            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < 70; i++) {
                const x = (i * 29 + 7) % INTERNAL_WIDTH;
                const y = (i * 11 + 3) % 100 + 5;
                const twinkle = Math.sin(this.time * 2 + i * 0.5) * 0.3 + 0.7;
                ctx.globalAlpha = twinkle * 0.7;
                ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
            }
            ctx.globalAlpha = 1;

            // Moon - pink tint
            ctx.fillStyle = '#ffeeef';
            ctx.beginPath();
            ctx.arc(400, 45, 22, 0, Math.PI * 2);
            ctx.fill();

            // Moon glow - pink
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#ffaaaa';
            ctx.beginPath();
            ctx.arc(400, 45, 35, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // Distant city glow - pink tint
            ctx.fillStyle = '#1a1018';
            this.drawDistantCity(ctx, 105);

            // Water
            this.waterAnimation.render(ctx);

            // Stone beach
            this.drawStoneBeach(ctx, 210);
        }

        // Ripples (always rendered as overlay)
        this.rippleEffect.render(ctx);
    }

    drawDistantCity(ctx, y) {
        ctx.beginPath();
        ctx.moveTo(0, y + 35);

        const buildings = [10, 18, 14, 25, 20, 30, 18, 26, 12, 22, 15, 20, 12, 18];
        let x = 0;
        const buildingWidth = INTERNAL_WIDTH / buildings.length;

        buildings.forEach((height, i) => {
            ctx.lineTo(x, y + 35 - height);
            ctx.lineTo(x + buildingWidth - 3, y + 35 - height);
            x += buildingWidth;
        });

        ctx.lineTo(INTERNAL_WIDTH, y + 35);
        ctx.fill();

        // Tiny lights - pink tint
        ctx.fillStyle = '#ff8888';
        x = 4;
        buildings.forEach((height, i) => {
            for (let ly = y + 35 - height + 3; ly < y + 32; ly += 5) {
                if (Math.sin(this.time + i + ly) > 0.3) {
                    ctx.fillRect(x + Math.floor(Math.random() * 18), Math.floor(ly), 1, 1);
                }
            }
            x += buildingWidth;
        });
    }

    drawStoneBeach(ctx, y) {
        // Beach gradient - pink-tinted dark tones
        const beachGradient = ctx.createLinearGradient(0, y, 0, INTERNAL_HEIGHT);
        beachGradient.addColorStop(0, '#4a3a44');
        beachGradient.addColorStop(0.5, '#3a2a34');
        beachGradient.addColorStop(1, '#2a1a24');
        ctx.fillStyle = beachGradient;
        ctx.fillRect(0, y, INTERNAL_WIDTH, INTERNAL_HEIGHT - y);

        // Stones - pink tint
        ctx.fillStyle = '#5a4a54';
        for (let i = 0; i < 60; i++) {
            const sx = (i * 37 + 5) % INTERNAL_WIDTH;
            const sy = y + 8 + (i * 13) % 55;
            const size = 3 + (i % 4);
            ctx.beginPath();
            ctx.ellipse(sx, sy, size, size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Darker stones - pink tint
        ctx.fillStyle = '#3a2a34';
        for (let i = 0; i < 30; i++) {
            const sx = (i * 51 + 20) % INTERNAL_WIDTH;
            const sy = y + 12 + (i * 17) % 45;
            const size = 4 + (i % 3);
            ctx.beginPath();
            ctx.ellipse(sx, sy, size, size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    render(ctx) {
        super.render(ctx);

        // Splash effects
        this.splashEffect.render(ctx);

        // Water overlay on characters when they're in water
        if (this.endingSequenceActive && this.gio.y < 210) {
            // Draw semi-transparent water over lower part of characters - pink tint
            const waterLevel = 200;
            if (this.gio.y < waterLevel + 30) {
                ctx.fillStyle = 'rgba(60, 30, 50, 0.4)';
                const coverHeight = Math.min(40, waterLevel + 30 - this.gio.y);
                ctx.fillRect(this.gio.x - 30, this.gio.y, 60, coverHeight);
                ctx.fillRect(this.tamo.x - 30, this.tamo.y, 60, coverHeight);
            }
        }

        // Fade overlay
        if (this.fadeAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(this.fadeAlpha, 1)})`;
            ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        }
    }
}
