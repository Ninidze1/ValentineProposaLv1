// SceneA_BeachClub.js - Beach club concert scene (pink theme)
class SceneA_BeachClub extends Scene {
    setup(params) {
        this.time = 0;

        // Characters positioned on club deck - Tamo on left, Gio on right (slightly closer)
        this.tamo = new Character(
            this.game,
            210, 210,
            this.game.assets.getImage('tamo'),
            this.game.tamoFrameWidth,
            this.game.tamoFrameHeight,
            2, 1.0  // normal size
        );
        this.tamo.setAnimation('dance');

        this.gio = new Character(
            this.game,
            270, 210,
            this.game.assets.getImage('gio'),
            this.game.gioFrameWidth,
            this.game.gioFrameHeight,
            2, 1.15  // Gio is slightly bigger (15% larger)
        );
        this.gio.setAnimation('dance');

        this.entities.push(this.gio, this.tamo);

        // Prompt widget
        this.prompt = new PromptWidget({
            question: "Talula, will you be my Valentine?",
            onYes: () => this.onYesClicked(),
            onNo: () => this.onNoClicked()
        });
        this.ui.push(this.prompt);

        this.heartBurstActive = false;
        this.crowdOffset = 0;

        // Lights - pink/romantic colors
        this.lights = [];
        for (let i = 0; i < 6; i++) {
            this.lights.push({
                x: 40 + i * 80,
                angle: i * 0.5,
                color: ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e', '#ff7b7b', '#ff8b9b'][i]
            });
        }
    }

    onYesClicked() {
        this.heartBurstActive = true;
        const burst = new HeartBurst(INTERNAL_WIDTH / 2, 140, 50);
        this.effects.push(burst);
        this.prompt.hide();

        setTimeout(() => {
            this.game.stateMachine.setState('transition', {
                nextScene: 'sceneB',
                duration: 0.5
            });
        }, 800);
    }

    onNoClicked() {
        this.prompt.shrinkNoButton(0.75);
    }

    update(dt) {
        super.update(dt);
        this.time += dt;
        this.crowdOffset = Math.sin(this.time * 3) * 2;

        this.lights.forEach(light => {
            light.angle += dt * 2;
        });
    }

    renderBackground(ctx) {
        // Draw background image if available
        const bgImage = this.game.assets.getImage('background-a');
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        } else {
            // Fallback: Night sky with pink tint
            const skyGradient = ctx.createLinearGradient(0, 0, 0, 150);
            skyGradient.addColorStop(0, '#1a0a1a');
            skyGradient.addColorStop(0.5, '#2a1a2a');
            skyGradient.addColorStop(1, '#3a2a3a');
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, INTERNAL_WIDTH, 150);

            // Distant Batumi silhouette
            ctx.fillStyle = '#1f151f';
            this.drawCitySilhouette(ctx, 100);

            // Club floor/deck - dark with pink tint
            const floorGradient = ctx.createLinearGradient(0, 170, 0, INTERNAL_HEIGHT);
            floorGradient.addColorStop(0, '#2a1a2a');
            floorGradient.addColorStop(1, '#1a0a1a');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 170, INTERNAL_WIDTH, INTERNAL_HEIGHT - 170);

            // Dance floor pattern - pink
            ctx.fillStyle = 'rgba(255, 107, 107, 0.08)';
            for (let x = 0; x < INTERNAL_WIDTH; x += 30) {
                for (let y = 180; y < INTERNAL_HEIGHT; y += 30) {
                    if ((x / 30 + y / 30) % 2 === 0) {
                        ctx.fillRect(x, y, 28, 28);
                    }
                }
            }
        }

        // Light beams - pink (always rendered as overlay)
        this.lights.forEach(light => {
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = light.color;
            ctx.translate(light.x, 60);
            ctx.rotate(Math.sin(light.angle) * 0.3);

            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(-30, 200);
            ctx.lineTo(30, 200);
            ctx.lineTo(4, 0);
            ctx.fill();

            ctx.restore();
        });

        // Stage lights at top - pink tones (always rendered)
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(80, 8, 5, 5);
        ctx.fillStyle = '#ff8e8e';
        ctx.fillRect(240, 8, 5, 5);
        ctx.fillStyle = '#ff6b9a';
        ctx.fillRect(400, 8, 5, 5);

        // Neon sign (always rendered)
        this.drawNeonSign(ctx, INTERNAL_WIDTH / 2, 30);
    }

    drawCitySilhouette(ctx, y) {
        ctx.beginPath();
        ctx.moveTo(0, y + 70);

        const buildings = [20, 35, 28, 50, 42, 35, 55, 30, 45, 35, 48, 28, 35, 25, 40, 30];
        let x = 0;
        const buildingWidth = INTERNAL_WIDTH / buildings.length;

        buildings.forEach((height, i) => {
            ctx.lineTo(x, y + 70 - height);
            ctx.lineTo(x + buildingWidth - 3, y + 70 - height);
            x += buildingWidth;
        });

        ctx.lineTo(INTERNAL_WIDTH, y + 70);
        ctx.fill();

        // Windows
        ctx.fillStyle = '#ffcc66';
        ctx.globalAlpha = 0.25;
        x = 5;
        buildings.forEach((height, i) => {
            for (let wy = y + 70 - height + 4; wy < y + 68; wy += 7) {
                for (let wx = x; wx < x + buildingWidth - 6; wx += 5) {
                    if (Math.random() > 0.4) {
                        ctx.fillRect(Math.floor(wx), Math.floor(wy), 2, 3);
                    }
                }
            }
            x += buildingWidth;
        });
        ctx.globalAlpha = 1;
    }

    drawCrowd(ctx, y) {
        for (let x = 15; x < INTERNAL_WIDTH - 15; x += 20) {
            // Gap for main characters
            if (x > 170 && x < 310) continue;

            const bounce = Math.sin(this.time * 4 + x * 0.1) * 3;
            const headY = y - 25 + bounce;

            ctx.fillRect(x - 5, y - 20 + bounce, 10, 20);
            ctx.beginPath();
            ctx.arc(x, headY, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawNeonSign(ctx, x, y) {
        ctx.textAlign = 'center';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff6b6b';

        // Title: "Batumi"
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText("Batumi", x, y - 8);

        // Date: "27 July, 2025"
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ff8e8e';
        ctx.fillText("27 July, 2025", x, y + 6);

        // Flicker effect
        if (Math.sin(this.time * 10) > 0.8) {
            ctx.globalAlpha = 0.5;
        }
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.fillText("Batumi", x, y - 8);
        ctx.font = '10px monospace';
        ctx.fillText("27 July, 2025", x, y + 6);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}
