// SceneB_StoneBeach.js - Stone beach night scene with simplified ending
class SceneB_StoneBeach extends Scene {
    setup(params) {
        this.time = 0;

        // Water animation - water level at 60% from top (40% from bottom)
        this.waterLevel = Math.floor(INTERNAL_HEIGHT * 0.6);  // 162 for 270px height
        this.waterAnimation = new WaterAnimation(this.waterLevel);

        // Characters on beach - Tamo on left, Gio on right (use -b variants for scene B)
        this.tamo = new Character(
            this.game,
            200, 230,
            this.game.assets.getImage('tamo-b'),
            this.game.tamoBFrameWidth || this.game.tamoFrameWidth,
            this.game.tamoBFrameHeight || this.game.tamoFrameHeight,
            2, 1.0  // normal size
        );
        this.tamo.widthMultiplier = 0.85;  // reduce width only
        this.tamo.setAnimation('stand');

        this.gio = new Character(
            this.game,
            280, 230,
            this.game.assets.getImage('gio-b'),
            this.game.gioBFrameWidth || this.game.gioFrameWidth,
            this.game.gioBFrameHeight || this.game.gioFrameHeight,
            2, 1.15  // Gio is slightly bigger (15% larger)
        );
        this.gio.setAnimation('stand');

        // Store base Y positions for idle animation
        this.tamoBaseY = 230;
        this.gioBaseY = 230;

        this.entities.push(this.gio, this.tamo);

        // Prompt widget - use \n for explicit line break
        this.prompt = new PromptWidget({
            question: "Will you be my Valentine tonight,\nand every day after?",
            onYes: () => this.onYesClicked(),
            onNo: () => this.onNoClicked()
        });
        this.ui.push(this.prompt);

        // Ending sequence state
        this.endingSequenceActive = false;
        this.endingTimer = 0;
        this.fadeAlpha = 0;
        this.switchedToNaked = false;  // Immediately on YES click
        this.switchedToSwim = false;   // After 2 seconds
        this.swimDirection = 1;  // 1 = right, -1 = left

        // Effects
        this.splashEffect = new SplashEffect();
        this.rippleEffect = new RippleEffect();

        // New atmospheric effects - use correct water level
        this.fireflies = new Fireflies(12);
        this.shootingStars = new ShootingStars();
        this.touchHearts = new TouchHearts();
        this.moonReflection = new MoonReflection(400, this.waterLevel);
        this.dynamicWaves = new DynamicWaves(this.waterLevel);

        this.rippleTimer = 0;
    }

    onYesClicked() {
        this.endingSequenceActive = true;
        this.endingTimer = 0;
        this.prompt.hide();

        // Immediately switch to naked sprites
        this.switchToNakedSprites();

        const burst = new HeartBurst(INTERNAL_WIDTH / 2, 160, 50);
        this.effects.push(burst);
    }

    switchToNakedSprites() {
        this.switchedToNaked = true;

        const gioNakedSprite = this.game.assets.getImage('gio-naked');
        const tamoNakedSprite = this.game.assets.getImage('tamo-naked');

        if (gioNakedSprite) {
            this.gio.spritesheet = gioNakedSprite;
            this.gio.frameWidth = this.game.gioNakedFrameWidth || this.game.gioFrameWidth;
            this.gio.frameHeight = this.game.gioNakedFrameHeight || this.game.gioFrameHeight;
        }
        if (tamoNakedSprite) {
            this.tamo.spritesheet = tamoNakedSprite;
            this.tamo.frameWidth = this.game.tamoNakedFrameWidth || this.game.tamoFrameWidth;
            this.tamo.frameHeight = this.game.tamoNakedFrameHeight || this.game.tamoFrameHeight;
            this.tamo.widthMultiplier = 0.97;  // slightly wider for naked sprite
        }

        this.gio.setAnimation('stand');
        this.tamo.setAnimation('stand');
    }

    switchToSwimSprites() {
        this.switchedToSwim = true;

        const gioSwimSprite = this.game.assets.getImage('gio-swim');
        const tamoSwimSprite = this.game.assets.getImage('tamo-swim');

        if (gioSwimSprite) {
            this.gio.spritesheet = gioSwimSprite;
            this.gio.frameWidth = this.game.gioSwimFrameWidth || this.game.gioFrameWidth;
            this.gio.frameHeight = this.game.gioSwimFrameHeight || this.game.gioFrameHeight;
            this.gio.renderMode = 'swimming';
        }
        if (tamoSwimSprite) {
            this.tamo.spritesheet = tamoSwimSprite;
            this.tamo.frameWidth = this.game.tamoSwimFrameWidth || this.game.tamoFrameWidth;
            this.tamo.frameHeight = this.game.tamoSwimFrameHeight || this.game.tamoFrameHeight;
            this.tamo.renderMode = 'swimming';
            this.tamo.widthMultiplier = 1.0;  // full width for swim sprite
        }

        this.gio.setAnimation('swim');
        this.tamo.setAnimation('swim');
    }

    onNoClicked() {
        // shrinkNoButton now handles animation internally (no factor needed)
        // Each click shrinks NO by 25% and expands YES accordingly
    }

    update(dt) {
        super.update(dt);
        this.time += dt;

        this.waterAnimation.update(dt);
        this.splashEffect.update(dt);
        this.rippleEffect.update(dt);

        // Update new effects
        this.fireflies.update(dt);
        this.shootingStars.update(dt);
        this.touchHearts.update(dt);
        this.moonReflection.update(dt);
        this.dynamicWaves.update(dt);

        // Moon reflection ripples (below water level)
        this.rippleTimer += dt;
        if (this.rippleTimer > 2.5) {
            this.rippleTimer = 0;
            this.rippleEffect.emit(380, this.waterLevel + 20);
        }

        if (this.endingSequenceActive) {
            this.updateEndingSequence(dt);
        } else {
            // Idle standing animation - subtle breathing/swaying like in Scene A
            // Each character has slightly different timing for natural feel
            const tamoBreath = Math.sin(this.time * 1.8) * 1.5;
            const tamoSway = Math.sin(this.time * 0.9) * 0.5;
            this.tamo.y = this.tamoBaseY + tamoBreath;

            const gioBreath = Math.sin(this.time * 1.6 + 0.5) * 1.5;
            const gioSway = Math.sin(this.time * 1.1 + 0.3) * 0.5;
            this.gio.y = this.gioBaseY + gioBreath;
        }
    }

    handleClick(x, y) {
        // Spawn hearts on click anywhere
        this.touchHearts.emit(x, y, 3);
        return super.handleClick(x, y);
    }

    updateEndingSequence(dt) {
        this.endingTimer += dt;
        const t = this.endingTimer;

        // Swimming Y position (fixed at water level with gentle bobbing)
        const swimY = this.waterLevel + 25;
        // Slower bobbing for more natural feel
        const bobAmount = Math.sin(t * 1.5) * 4;

        // Phase 1: 0s - 1.2s: Stand with NAKED sprites, no flipping
        if (t < 1.2) {
            this.gio.setAnimation('stand');
            this.tamo.setAnimation('stand');
            // Keep default orientation (no flip)
            this.gio.flipX = false;
            this.tamo.flipX = false;
        }

        // Phase 2: 1.2s - 2.5s: Walk toward water while naked
        if (t >= 1.2 && t < 2.5) {
            const walkProgress = (t - 1.2) / 1.3;

            // Move up toward water
            this.gio.y = lerp(230, 205, walkProgress);
            this.tamo.y = lerp(230, 205, walkProgress);

            // Come together and move toward center
            this.gio.x = lerp(280, 245, walkProgress);
            this.tamo.x = lerp(200, 215, walkProgress);

            this.gio.setAnimation('walk');
            this.tamo.setAnimation('walk');

            // Both face forward (toward water/up)
            this.gio.flipX = false;
            this.tamo.flipX = false;
        }

        // Phase 3: At 2.5s - Switch to SWIM sprites with big splash
        if (t >= 2.5 && !this.switchedToSwim) {
            this.switchToSwimSprites();
            // Big splash when entering water
            this.splashEffect.emit(this.gio.x, this.waterLevel + 5, 8);
            this.splashEffect.emit(this.tamo.x, this.waterLevel + 5, 8);
            this.splashEffect.emit((this.gio.x + this.tamo.x) / 2, this.waterLevel + 5, 6);
        }

        // Phase 4: 2.5s - 4s: Enter water with splash transition
        if (t >= 2.5 && t < 4.0) {
            const enterProgress = (t - 2.5) / 1.5;

            // Dive into water
            this.gio.y = lerp(205, swimY, enterProgress);
            this.tamo.y = lerp(205, swimY, enterProgress);

            // Come closer together
            this.gio.x = lerp(245, 235, enterProgress);
            this.tamo.x = lerp(215, 205, enterProgress);

            this.gio.setAnimation('swim');
            this.tamo.setAnimation('swim');

            // Face each other while entering
            this.gio.flipX = true;
            this.tamo.flipX = false;

            // Continuous splashes during entry
            if (Math.random() < 0.25) {
                this.splashEffect.emit(this.gio.x, this.waterLevel + 8, 4);
                this.splashEffect.emit(this.tamo.x, this.waterLevel + 8, 4);
            }
        }

        // Phase 5: 4s - 5s: Settle in water, facing each other
        if (t >= 4.0 && t < 5.0) {
            // Stay close together, gentle movement
            const settleProgress = (t - 4.0) / 1.0;

            this.gio.x = lerp(235, 240, settleProgress);
            this.tamo.x = lerp(205, 200, settleProgress);

            // Gentle bobbing
            this.gio.y = swimY + bobAmount * 0.5;
            this.tamo.y = swimY + bobAmount * 0.5 + Math.sin(t * 1.5 + 0.5) * 2;

            // Face each other
            this.gio.flipX = true;
            this.tamo.flipX = false;
        }

        // Phase 6: 5s - 13s: Slow romantic swimming together (SLOWER)
        if (t >= 5.0 && t < 13.0) {
            const swimTime = t - 5.0;  // Time since swimming started

            // Slower, more natural swimming pattern
            // Use sine wave for organic movement instead of linear
            // 0-4s: drift right together
            // 4-8s: drift left together
            // 8+s: settle in center facing each other

            let baseX;
            const driftAmount = 70; // How far they drift side to side

            if (swimTime < 4.0) {
                // Drifting right - use eased movement
                const progress = swimTime / 4.0;
                const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                baseX = lerp(200, 200 + driftAmount, easedProgress);
                // Both face same direction (right)
                this.gio.flipX = false;
                this.tamo.flipX = false;
            } else if (swimTime < 8.0) {
                // Drifting left - use eased movement
                const progress = (swimTime - 4.0) / 4.0;
                const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                baseX = lerp(200 + driftAmount, 200 - driftAmount, easedProgress);
                // Both face same direction (left)
                this.gio.flipX = true;
                this.tamo.flipX = true;
            } else {
                // Settle in center, face each other
                const progress = Math.min((swimTime - 8.0) / 1.5, 1.0);
                const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                baseX = lerp(200 - driftAmount, 220, easedProgress);
                // Face each other
                this.gio.flipX = true;
                this.tamo.flipX = false;
            }

            // Position characters close together - Tamo slightly ahead
            this.tamo.x = baseX;
            this.gio.x = baseX + 30;

            // Natural bobbing with slightly different phases for each character
            const gioBob = Math.sin(t * 1.2) * 5 + Math.sin(t * 2.5) * 1.5;
            const tamoBob = Math.sin(t * 1.2 + 0.4) * 5 + Math.sin(t * 2.5 + 0.6) * 1.5;

            this.gio.y = swimY + gioBob;
            this.tamo.y = swimY + tamoBob;

            // Very occasional gentle splashes
            if (Math.random() < 0.015) {
                this.splashEffect.emit(this.gio.x + (Math.random() - 0.5) * 10, this.waterLevel + 8, 2);
            }
            if (Math.random() < 0.015) {
                this.splashEffect.emit(this.tamo.x + (Math.random() - 0.5) * 10, this.waterLevel + 8, 2);
            }

            // Add ripples around them occasionally
            if (Math.random() < 0.025) {
                const rippleX = (this.gio.x + this.tamo.x) / 2 + (Math.random() - 0.5) * 30;
                this.rippleEffect.emit(rippleX, this.waterLevel + 15);
            }
        }

        // Phase 7: 11.5s - 13s: Fade to black
        if (t >= 11.5 && t < 13.0) {
            this.fadeAlpha = (t - 11.5) / 1.5;
        }

        // Phase 8: 13s: Transition to end screen
        if (t >= 13.0) {
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

        // Dynamic waves overlay
        this.dynamicWaves.render(ctx);

        // Moon reflection on water
        this.moonReflection.render(ctx);

        // Ripples (always rendered as overlay)
        this.rippleEffect.render(ctx);

        // Shooting stars
        this.shootingStars.render(ctx);

        // Fireflies
        this.fireflies.render(ctx);
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

        // Touch hearts
        this.touchHearts.render(ctx);

        // Fade overlay
        if (this.fadeAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(this.fadeAlpha, 1)})`;
            ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        }
    }
}
