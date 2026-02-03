/**
 * @fileoverview Beach club concert scene (pink theme)
 * @module scenes/SceneA_BeachClub
 */

import { Scene } from './Scene.js';
import { Character } from '../entities/Character.js';
import { PromptWidget } from '../ui/PromptWidget.js';
import { MobileControls } from '../ui/MobileControls.js';
import { HeartBurst } from '../effects/HeartBurst.js';
import { ShootingStars } from '../effects/ShootingStar.js';
import { TouchHearts } from '../effects/TouchHearts.js';
import {
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    COLORS,
    SCENE_A_CONFIG,
    SCENE_A_MOVEMENT,
    TIMING,
    SPRITE_KEYS
} from '../utils/constants.js';

/**
 * @typedef {Object} Light
 * @property {number} x - X position
 * @property {number} angle - Current angle
 * @property {string} color - Light color
 */

const LIGHT_COLORS = ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e', '#ff7b7b', '#ff8b9b'];
const LIGHT_COUNT = 6;
const LIGHT_SPACING = 80;
const LIGHT_START_X = 40;

/**
 * Beach club concert scene with dancing characters
 */
export class SceneA_BeachClub extends Scene {
    /** @type {number} */
    #time = 0;

    /** @type {Character} */
    tamo;

    /** @type {Character} */
    gio;

    /** @type {PromptWidget} */
    #prompt;

    /** @type {boolean} */
    #heartBurstActive = false;

    /** @type {number} */
    #crowdOffset = 0;

    /** @type {ShootingStars} */
    #shootingStars;

    /** @type {TouchHearts} */
    #touchHearts;

    /** @type {Light[]} */
    #lights = [];

    /** @type {boolean} */
    #promptTriggered = false;

    /** @type {boolean} */
    #isMoving = false;

    /** @type {MobileControls} */
    #mobileControls;

    /**
     * Setup scene
     * @param {Object} [params] - Scene parameters
     */
    setup(params) {
        this.#time = 0;
        this.#promptTriggered = false;
        this.#isMoving = false;

        // Tamo on LEFT side, controllable
        this.tamo = new Character({
            game: this.game,
            x: SCENE_A_CONFIG.TAMO_X,
            y: SCENE_A_CONFIG.TAMO_Y,
            spritesheet: this.game.assets.getImage(SPRITE_KEYS.TAMO),
            frameWidth: this.game.tamoFrameWidth,
            frameHeight: this.game.tamoFrameHeight,
            scale: 2,
            sizeMultiplier: 1.0
        });
        this.tamo.setAnimation('dance');
        this.tamo.flipX = false; // Facing right (toward Gio)

        // Gio on RIGHT side, stationary
        this.gio = new Character({
            game: this.game,
            x: SCENE_A_CONFIG.GIO_X,
            y: SCENE_A_CONFIG.GIO_Y,
            spritesheet: this.game.assets.getImage(SPRITE_KEYS.GIO),
            frameWidth: this.game.gioFrameWidth,
            frameHeight: this.game.gioFrameHeight,
            scale: 2,
            sizeMultiplier: SCENE_A_CONFIG.GIO_SIZE_MULTIPLIER
        });
        this.gio.setAnimation('dance');
        this.gio.flipX = true; // Initially facing left

        this.entities.push(this.gio, this.tamo);

        // Prompt widget - created but NOT added to UI yet (shown on proximity)
        this.#prompt = new PromptWidget({
            question: "Its loud here, maybe we should go swimming??",
            onYes: () => this.#onYesClicked(),
            onNo: () => this.#onNoClicked()
        });
        // Note: NOT adding to this.ui here - will be added when proximity triggers

        this.#heartBurstActive = false;
        this.#crowdOffset = 0;

        // Effects
        this.#shootingStars = new ShootingStars();
        this.#touchHearts = new TouchHearts();

        // Mobile controls
        this.#mobileControls = new MobileControls();

        // Stage lights - pink/romantic colors
        this.#lights = [];
        for (let i = 0; i < LIGHT_COUNT; i++) {
            this.#lights.push({
                x: LIGHT_START_X + i * LIGHT_SPACING,
                angle: i * 0.5,
                color: LIGHT_COLORS[i]
            });
        }
    }

    /**
     * Handle YES button click
     */
    #onYesClicked() {
        this.#heartBurstActive = true;
        const burst = new HeartBurst(INTERNAL_WIDTH / 2, 140, 50);
        this.effects.push(burst);
        this.#prompt.hide();

        setTimeout(() => {
            this.game.stateMachine.setState('transition', {
                nextScene: 'sceneB',
                duration: TIMING.TRANSITION_DURATION
            });
        }, TIMING.HEART_BURST_DELAY);
    }

    /**
     * Handle NO button click
     */
    #onNoClicked() {
        // shrinkNoButton now handles animation internally
    }

    /**
     * Update scene
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        super.update(dt);
        this.#time += dt;
        this.#crowdOffset = Math.sin(this.#time * 3) * 2;

        for (const light of this.#lights) {
            light.angle += dt * 2;
        }

        this.#shootingStars.update(dt);
        this.#touchHearts.update(dt);

        // Handle Tamo movement and proximity detection
        if (!this.#heartBurstActive) {
            this.#handleMovement(dt);
            this.#checkProximity();
        }
    }

    /**
     * Handle Tamo movement based on keyboard and mobile input
     * @param {number} dt - Delta time in seconds
     */
    #handleMovement(dt) {
        // Don't allow movement after dialog appears
        if (this.#promptTriggered) {
            return;
        }

        const input = this.game.input;
        let moveDir = 0;

        // Check keyboard input
        if (input.isKeyPressed('ArrowLeft') || input.isKeyPressed('a') || input.isKeyPressed('A')) {
            moveDir = -1;
        } else if (input.isKeyPressed('ArrowRight') || input.isKeyPressed('d') || input.isKeyPressed('D')) {
            moveDir = 1;
        }

        // Check mobile controls (touch/mouse held down)
        if (input.isPressed) {
            const touchX = input.mouseX;
            const touchY = input.mouseY;
            this.#mobileControls.handleMove(touchX, touchY);

            if (this.#mobileControls.leftPressed) {
                moveDir = -1;
            } else if (this.#mobileControls.rightPressed) {
                moveDir = 1;
            }
        } else {
            this.#mobileControls.handleUp();
        }

        if (moveDir !== 0) {
            // Calculate new position
            const newX = this.tamo.x + moveDir * SCENE_A_MOVEMENT.MOVE_SPEED * dt;

            // Clamp to boundaries
            this.tamo.x = Math.max(
                SCENE_A_MOVEMENT.MIN_X,
                Math.min(SCENE_A_MOVEMENT.MAX_X, newX)
            );

            // Update animation and facing direction
            if (!this.#isMoving || this.tamo.animation !== 'walk') {
                this.tamo.setAnimation('walk');
            }
            this.tamo.flipX = (moveDir < 0); // Face direction of movement
            this.#isMoving = true;
        } else {
            // Return to dancing when not moving
            if (this.#isMoving) {
                this.tamo.setAnimation('dance');
                this.tamo.flipX = false; // Face right toward Gio
            }
            this.#isMoving = false;
        }
    }

    /**
     * Check if Tamo is close enough to Gio to trigger dialog
     */
    #checkProximity() {
        if (this.#promptTriggered) {
            return;
        }

        const distance = Math.abs(this.tamo.x - this.gio.x);

        if (distance <= SCENE_A_MOVEMENT.PROXIMITY_THRESHOLD) {
            this.#triggerDialog();
        }
    }

    /**
     * Trigger the dialog when proximity is detected
     */
    #triggerDialog() {
        this.#promptTriggered = true;

        // Stop Tamo and set to dancing, face right toward Gio
        this.tamo.setAnimation('dance');
        this.tamo.flipX = false;

        // Gio turns to face right (toward Tamo)
        this.gio.flipX = false;

        // Hide mobile controls
        this.#mobileControls.hide();

        // Add prompt to UI and show it
        this.ui.push(this.#prompt);
        this.#prompt.show();
    }

    /**
     * Handle click event
     * @param {number} x - Click X position
     * @param {number} y - Click Y position
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        this.#touchHearts.emit(x, y, 3);
        return super.handleClick(x, y);
    }

    /**
     * Render background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderBackground(ctx) {
        const bgImage = this.game.assets.getImage('background-a');
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        } else {
            this.#renderFallbackBackground(ctx);
        }

        this.#renderLightBeams(ctx);
        this.#renderStageLights(ctx);
        this.#renderNeonSign(ctx, INTERNAL_WIDTH / 2, 30);
        this.#shootingStars.render(ctx);
    }

    /**
     * Render fallback background when image not available
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    #renderFallbackBackground(ctx) {
        // Night sky with pink tint
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 150);
        skyGradient.addColorStop(0, '#1a0a1a');
        skyGradient.addColorStop(0.5, '#2a1a2a');
        skyGradient.addColorStop(1, '#3a2a3a');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, INTERNAL_WIDTH, 150);

        // Distant Batumi silhouette
        ctx.fillStyle = '#1f151f';
        this.#drawCitySilhouette(ctx, 100);

        // Club floor/deck
        const floorGradient = ctx.createLinearGradient(0, 170, 0, INTERNAL_HEIGHT);
        floorGradient.addColorStop(0, '#2a1a2a');
        floorGradient.addColorStop(1, '#1a0a1a');
        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, 170, INTERNAL_WIDTH, INTERNAL_HEIGHT - 170);

        // Dance floor pattern
        ctx.fillStyle = 'rgba(255, 107, 107, 0.08)';
        for (let x = 0; x < INTERNAL_WIDTH; x += 30) {
            for (let y = 180; y < INTERNAL_HEIGHT; y += 30) {
                if ((x / 30 + y / 30) % 2 === 0) {
                    ctx.fillRect(x, y, 28, 28);
                }
            }
        }
    }

    /**
     * Render light beams
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    #renderLightBeams(ctx) {
        for (const light of this.#lights) {
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
        }
    }

    /**
     * Render stage lights at top
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    #renderStageLights(ctx) {
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(80, 8, 5, 5);
        ctx.fillStyle = '#ff8e8e';
        ctx.fillRect(240, 8, 5, 5);
        ctx.fillStyle = '#ff6b9a';
        ctx.fillRect(400, 8, 5, 5);
    }

    /**
     * Draw city silhouette
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} y - Y position
     */
    #drawCitySilhouette(ctx, y) {
        ctx.beginPath();
        ctx.moveTo(0, y + 70);

        const buildings = [20, 35, 28, 50, 42, 35, 55, 30, 45, 35, 48, 28, 35, 25, 40, 30];
        let x = 0;
        const buildingWidth = INTERNAL_WIDTH / buildings.length;

        for (const height of buildings) {
            ctx.lineTo(x, y + 70 - height);
            ctx.lineTo(x + buildingWidth - 3, y + 70 - height);
            x += buildingWidth;
        }

        ctx.lineTo(INTERNAL_WIDTH, y + 70);
        ctx.fill();

        // Windows
        ctx.fillStyle = '#ffcc66';
        ctx.globalAlpha = 0.25;
        x = 5;
        for (let i = 0; i < buildings.length; i++) {
            const height = buildings[i];
            for (let wy = y + 70 - height + 4; wy < y + 68; wy += 7) {
                for (let wx = x; wx < x + buildingWidth - 6; wx += 5) {
                    if (Math.random() > 0.4) {
                        ctx.fillRect(Math.floor(wx), Math.floor(wy), 2, 3);
                    }
                }
            }
            x += buildingWidth;
        }
        ctx.globalAlpha = 1;
    }

    /**
     * Render neon sign
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    #renderNeonSign(ctx, x, y) {
        ctx.textAlign = 'center';
        ctx.shadowBlur = 12;
        ctx.shadowColor = COLORS.pink;

        // Title
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = COLORS.pink;
        ctx.fillText("Batumi", x, y - 8);

        // Date
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ff8e8e';
        ctx.fillText("27 July, 2025", x, y + 6);

        // Flicker effect
        if (Math.sin(this.#time * 10) > 0.8) {
            ctx.globalAlpha = 0.5;
        }
        ctx.fillStyle = COLORS.white;
        ctx.font = 'bold 14px monospace';
        ctx.fillText("Batumi", x, y - 8);
        ctx.font = '10px monospace';
        ctx.fillText("27 July, 2025", x, y + 6);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    /**
     * Render scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        super.render(ctx);
        this.#touchHearts.render(ctx);
        this.#mobileControls.render(ctx);
    }
}

export default SceneA_BeachClub;
