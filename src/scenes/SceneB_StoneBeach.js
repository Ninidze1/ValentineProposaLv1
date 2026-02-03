/**
 * @fileoverview Stone beach night scene with ending sequence
 * @module scenes/SceneB_StoneBeach
 */

import { Scene } from './Scene.js';
import { Character } from '../entities/Character.js';
import { PromptWidget } from '../ui/PromptWidget.js';
import { HeartBurst } from '../effects/HeartBurst.js';
import { SplashEffect } from '../effects/SplashParticle.js';
import { RippleEffect } from '../effects/Ripple.js';
import { Fireflies } from '../effects/Fireflies.js';
import { ShootingStars } from '../effects/ShootingStar.js';
import { TouchHearts } from '../effects/TouchHearts.js';
import { MoonReflection } from '../effects/MoonReflection.js';
import { DynamicWaves } from '../effects/DynamicWaves.js';
import { WaterAnimation } from '../backgrounds/WaterAnimation.js';
import {
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    SCENE_B_CONFIG,
    ENDING_PHASES,
    SWIM_CONFIG,
    SPRITE_KEYS
} from '../utils/constants.js';
import { lerp } from '../utils/math.js';

/**
 * Stone beach night scene with romantic ending sequence
 */
export class SceneB_StoneBeach extends Scene {
    /** @type {number} */
    #time = 0;

    /** @type {number} */
    #waterLevel;

    /** @type {WaterAnimation} */
    #waterAnimation;

    /** @type {Character} */
    tamo;

    /** @type {Character} */
    gio;

    /** @type {number} */
    #tamoBaseY;

    /** @type {number} */
    #gioBaseY;

    /** @type {PromptWidget} */
    #prompt;

    /** @type {boolean} */
    #endingSequenceActive = false;

    /** @type {number} */
    #endingTimer = 0;

    /** @type {number} */
    #fadeAlpha = 0;

    /** @type {boolean} */
    #switchedToNaked = false;

    /** @type {boolean} */
    #switchedToSwim = false;

    /** @type {number} */
    #swimDirection = 1;

    /** @type {SplashEffect} */
    #splashEffect;

    /** @type {RippleEffect} */
    #rippleEffect;

    /** @type {Fireflies} */
    #fireflies;

    /** @type {ShootingStars} */
    #shootingStars;

    /** @type {TouchHearts} */
    #touchHearts;

    /** @type {MoonReflection} */
    #moonReflection;

    /** @type {DynamicWaves} */
    #dynamicWaves;

    /** @type {number} */
    #rippleTimer = 0;

    /**
     * Setup scene
     * @param {Object} [params] - Scene parameters
     */
    setup(params) {
        this.#time = 0;

        // Water level at 60% from top
        this.#waterLevel = Math.floor(INTERNAL_HEIGHT * SCENE_B_CONFIG.WATER_LEVEL_PERCENT);
        this.#waterAnimation = new WaterAnimation(this.#waterLevel);

        // Characters on beach - Tamo on left, Gio on right
        this.tamo = new Character({
            game: this.game,
            x: SCENE_B_CONFIG.TAMO_X,
            y: SCENE_B_CONFIG.TAMO_Y,
            spritesheet: this.game.assets.getImage(SPRITE_KEYS.TAMO_B),
            frameWidth: this.game.tamoBFrameWidth || this.game.tamoFrameWidth,
            frameHeight: this.game.tamoBFrameHeight || this.game.tamoFrameHeight,
            scale: 2,
            sizeMultiplier: 1.0
        });
        this.tamo.widthMultiplier = SCENE_B_CONFIG.TAMO_WIDTH_MULTIPLIER;
        this.tamo.setAnimation('stand');

        this.gio = new Character({
            game: this.game,
            x: SCENE_B_CONFIG.GIO_X,
            y: SCENE_B_CONFIG.GIO_Y,
            spritesheet: this.game.assets.getImage(SPRITE_KEYS.GIO_B),
            frameWidth: this.game.gioBFrameWidth || this.game.gioFrameWidth,
            frameHeight: this.game.gioBFrameHeight || this.game.gioFrameHeight,
            scale: 2,
            sizeMultiplier: SCENE_B_CONFIG.GIO_SIZE_MULTIPLIER
        });
        this.gio.setAnimation('stand');

        this.#tamoBaseY = SCENE_B_CONFIG.TAMO_Y;
        this.#gioBaseY = SCENE_B_CONFIG.GIO_Y;

        this.entities.push(this.gio, this.tamo);

        // Prompt widget
        this.#prompt = new PromptWidget({
            question: "Will you be my Valentine tonight,\nand every day after?",
            onYes: () => this.#onYesClicked(),
            onNo: () => this.#onNoClicked()
        });
        this.ui.push(this.#prompt);

        // Reset ending sequence state
        this.#endingSequenceActive = false;
        this.#endingTimer = 0;
        this.#fadeAlpha = 0;
        this.#switchedToNaked = false;
        this.#switchedToSwim = false;
        this.#swimDirection = 1;

        // Effects
        this.#splashEffect = new SplashEffect();
        this.#rippleEffect = new RippleEffect();
        this.#fireflies = new Fireflies(12);
        this.#shootingStars = new ShootingStars();
        this.#touchHearts = new TouchHearts();
        this.#moonReflection = new MoonReflection(400, this.#waterLevel);
        this.#dynamicWaves = new DynamicWaves(this.#waterLevel);

        this.#rippleTimer = 0;
    }

    /**
     * Handle YES button click
     */
    #onYesClicked() {
        this.#endingSequenceActive = true;
        this.#endingTimer = 0;
        this.#prompt.hide();

        this.#switchToNakedSprites();

        const burst = new HeartBurst(INTERNAL_WIDTH / 2, 160, 50);
        this.effects.push(burst);
    }

    /**
     * Switch to naked sprites
     */
    #switchToNakedSprites() {
        this.#switchedToNaked = true;

        const gioNakedSprite = this.game.assets.getImage(SPRITE_KEYS.GIO_NAKED);
        const tamoNakedSprite = this.game.assets.getImage(SPRITE_KEYS.TAMO_NAKED);

        if (gioNakedSprite) {
            this.gio.spritesheet = gioNakedSprite;
            this.gio.frameWidth = this.game.gioNakedFrameWidth || this.game.gioFrameWidth;
            this.gio.frameHeight = this.game.gioNakedFrameHeight || this.game.gioFrameHeight;
        }
        if (tamoNakedSprite) {
            this.tamo.spritesheet = tamoNakedSprite;
            this.tamo.frameWidth = this.game.tamoNakedFrameWidth || this.game.tamoFrameWidth;
            this.tamo.frameHeight = this.game.tamoNakedFrameHeight || this.game.tamoFrameHeight;
            this.tamo.widthMultiplier = 0.97;
        }

        this.gio.setAnimation('stand');
        this.tamo.setAnimation('stand');
    }

    /**
     * Switch to swim sprites
     */
    #switchToSwimSprites() {
        this.#switchedToSwim = true;

        const gioSwimSprite = this.game.assets.getImage(SPRITE_KEYS.GIO_SWIM);
        const tamoSwimSprite = this.game.assets.getImage(SPRITE_KEYS.TAMO_SWIM);

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
            this.tamo.widthMultiplier = 1.0;
        }

        this.gio.setAnimation('swim');
        this.tamo.setAnimation('swim');
    }

    /**
     * Handle NO button click
     */
    #onNoClicked() {
        // shrinkNoButton handles animation internally
    }

    /**
     * Update scene
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        super.update(dt);
        this.#time += dt;

        this.#waterAnimation.update(dt);
        this.#splashEffect.update(dt);
        this.#rippleEffect.update(dt);

        this.#fireflies.update(dt);
        this.#shootingStars.update(dt);
        this.#touchHearts.update(dt);
        this.#moonReflection.update(dt);
        this.#dynamicWaves.update(dt);

        // Moon reflection ripples
        this.#rippleTimer += dt;
        if (this.#rippleTimer > 2.5) {
            this.#rippleTimer = 0;
            this.#rippleEffect.emit(380, this.#waterLevel + 20);
        }

        if (this.#endingSequenceActive) {
            this.#updateEndingSequence(dt);
        } else {
            this.#updateIdleAnimation();
        }
    }

    /**
     * Update idle breathing animation
     */
    #updateIdleAnimation() {
        const tamoBreath = Math.sin(this.#time * 1.8) * 1.5;
        this.tamo.y = this.#tamoBaseY + tamoBreath;

        const gioBreath = Math.sin(this.#time * 1.6 + 0.5) * 1.5;
        this.gio.y = this.#gioBaseY + gioBreath;
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
     * Update ending sequence phases
     * @param {number} dt - Delta time in seconds
     */
    #updateEndingSequence(dt) {
        this.#endingTimer += dt;
        const t = this.#endingTimer;

        const swimY = this.#waterLevel + SWIM_CONFIG.Y_OFFSET;
        const bobAmount = Math.sin(t * 1.5) * 4;

        // Phase 1: Stand with naked sprites
        if (t < ENDING_PHASES.STAND_NAKED.end) {
            this.#updatePhaseStandNaked();
        }

        // Phase 2: Walk toward water
        if (t >= ENDING_PHASES.WALK_TO_WATER.start && t < ENDING_PHASES.WALK_TO_WATER.end) {
            this.#updatePhaseWalkToWater(t);
        }

        // Phase 3: Switch to swim sprites
        if (t >= ENDING_PHASES.ENTER_WATER.start && !this.#switchedToSwim) {
            this.#switchToSwimSprites();
            this.#emitEntrySplashes();
        }

        // Phase 4: Enter water
        if (t >= ENDING_PHASES.ENTER_WATER.start && t < ENDING_PHASES.SETTLE.start) {
            this.#updatePhaseEnterWater(t, swimY);
        }

        // Phase 5: Settle in water
        if (t >= ENDING_PHASES.SETTLE.start && t < ENDING_PHASES.SWIM_TOGETHER.start) {
            this.#updatePhaseSettle(t, swimY, bobAmount);
        }

        // Phase 6: Swim together
        if (t >= ENDING_PHASES.SWIM_TOGETHER.start && t < ENDING_PHASES.FADE_OUT.end) {
            this.#updatePhaseSwimTogether(t, swimY);
        }

        // Phase 7: Fade to black
        if (t >= ENDING_PHASES.FADE_OUT.start && t < ENDING_PHASES.FADE_OUT.end) {
            this.#fadeAlpha = (t - ENDING_PHASES.FADE_OUT.start) /
                             (ENDING_PHASES.FADE_OUT.end - ENDING_PHASES.FADE_OUT.start);
        }

        // Phase 8: Transition to end screen
        if (t >= ENDING_PHASES.FADE_OUT.end) {
            this.game.stateMachine.setState('sceneC');
        }
    }

    /**
     * Phase 1: Standing with naked sprites
     */
    #updatePhaseStandNaked() {
        this.gio.setAnimation('stand');
        this.tamo.setAnimation('stand');
        this.gio.flipX = false;
        this.tamo.flipX = false;
    }

    /**
     * Phase 2: Walking toward water
     * @param {number} t - Current time
     */
    #updatePhaseWalkToWater(t) {
        const progress = (t - ENDING_PHASES.WALK_TO_WATER.start) /
                        (ENDING_PHASES.WALK_TO_WATER.end - ENDING_PHASES.WALK_TO_WATER.start);

        this.gio.y = lerp(230, 205, progress);
        this.tamo.y = lerp(230, 205, progress);

        this.gio.x = lerp(280, 245, progress);
        this.tamo.x = lerp(200, 215, progress);

        this.gio.setAnimation('walk');
        this.tamo.setAnimation('walk');

        this.gio.flipX = false;
        this.tamo.flipX = false;
    }

    /**
     * Emit splash effects when entering water
     */
    #emitEntrySplashes() {
        this.#splashEffect.emit(this.gio.x, this.#waterLevel + 5, 8);
        this.#splashEffect.emit(this.tamo.x, this.#waterLevel + 5, 8);
        this.#splashEffect.emit((this.gio.x + this.tamo.x) / 2, this.#waterLevel + 5, 6);
    }

    /**
     * Phase 4: Entering water
     * @param {number} t - Current time
     * @param {number} swimY - Swimming Y position
     */
    #updatePhaseEnterWater(t, swimY) {
        const progress = (t - ENDING_PHASES.ENTER_WATER.start) /
                        (ENDING_PHASES.SETTLE.start - ENDING_PHASES.ENTER_WATER.start);

        this.gio.y = lerp(205, swimY, progress);
        this.tamo.y = lerp(205, swimY, progress);

        this.gio.x = lerp(245, 235, progress);
        this.tamo.x = lerp(215, 205, progress);

        this.gio.setAnimation('swim');
        this.tamo.setAnimation('swim');

        this.gio.flipX = true;
        this.tamo.flipX = false;

        // Continuous splashes
        if (Math.random() < 0.25) {
            this.#splashEffect.emit(this.gio.x, this.#waterLevel + 8, 4);
            this.#splashEffect.emit(this.tamo.x, this.#waterLevel + 8, 4);
        }
    }

    /**
     * Phase 5: Settling in water
     * @param {number} t - Current time
     * @param {number} swimY - Swimming Y position
     * @param {number} bobAmount - Bobbing amount
     */
    #updatePhaseSettle(t, swimY, bobAmount) {
        const progress = (t - ENDING_PHASES.SETTLE.start) /
                        (ENDING_PHASES.SWIM_TOGETHER.start - ENDING_PHASES.SETTLE.start);

        this.gio.x = lerp(235, 240, progress);
        this.tamo.x = lerp(205, 200, progress);

        this.gio.y = swimY + bobAmount * 0.5;
        this.tamo.y = swimY + bobAmount * 0.5 + Math.sin(t * 1.5 + 0.5) * 2;

        this.gio.flipX = true;
        this.tamo.flipX = false;
    }

    /**
     * Phase 6: Swimming together
     * @param {number} t - Current time
     * @param {number} swimY - Swimming Y position
     */
    #updatePhaseSwimTogether(t, swimY) {
        const swimTime = t - ENDING_PHASES.SWIM_TOGETHER.start;
        const driftAmount = SWIM_CONFIG.DRIFT_AMOUNT;

        let baseX;

        if (swimTime < 4.0) {
            // Drifting right
            const progress = swimTime / 4.0;
            const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            baseX = lerp(200, 200 + driftAmount, easedProgress);
            this.gio.flipX = false;
            this.tamo.flipX = false;
        } else if (swimTime < 8.0) {
            // Drifting left
            const progress = (swimTime - 4.0) / 4.0;
            const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            baseX = lerp(200 + driftAmount, 200 - driftAmount, easedProgress);
            this.gio.flipX = true;
            this.tamo.flipX = true;
        } else {
            // Settle in center
            const progress = Math.min((swimTime - 8.0) / 1.5, 1.0);
            const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
            baseX = lerp(200 - driftAmount, 220, easedProgress);
            this.gio.flipX = true;
            this.tamo.flipX = false;
        }

        this.tamo.x = baseX;
        this.gio.x = baseX + SWIM_CONFIG.COUPLE_SPACING;

        // Natural bobbing
        const gioBob = Math.sin(t * 1.2) * 5 + Math.sin(t * 2.5) * 1.5;
        const tamoBob = Math.sin(t * 1.2 + 0.4) * 5 + Math.sin(t * 2.5 + 0.6) * 1.5;

        this.gio.y = swimY + gioBob;
        this.tamo.y = swimY + tamoBob;

        // Occasional splashes
        if (Math.random() < 0.015) {
            this.#splashEffect.emit(this.gio.x + (Math.random() - 0.5) * 10, this.#waterLevel + 8, 2);
        }
        if (Math.random() < 0.015) {
            this.#splashEffect.emit(this.tamo.x + (Math.random() - 0.5) * 10, this.#waterLevel + 8, 2);
        }

        // Ripples
        if (Math.random() < 0.025) {
            const rippleX = (this.gio.x + this.tamo.x) / 2 + (Math.random() - 0.5) * 30;
            this.#rippleEffect.emit(rippleX, this.#waterLevel + 15);
        }
    }

    /**
     * Render background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderBackground(ctx) {
        const bgImage = this.game.assets.getImage('background-b');
        if (bgImage) {
            ctx.drawImage(bgImage, 0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        } else {
            this.#renderFallbackBackground(ctx);
        }

        this.#dynamicWaves.render(ctx);
        this.#moonReflection.render(ctx);
        this.#rippleEffect.render(ctx);
        this.#shootingStars.render(ctx);
        this.#fireflies.render(ctx);
    }

    /**
     * Render fallback background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    #renderFallbackBackground(ctx) {
        // Night sky
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
            const twinkle = Math.sin(this.#time * 2 + i * 0.5) * 0.3 + 0.7;
            ctx.globalAlpha = twinkle * 0.7;
            ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
        }
        ctx.globalAlpha = 1;

        // Moon
        ctx.fillStyle = '#ffeeef';
        ctx.beginPath();
        ctx.arc(400, 45, 22, 0, Math.PI * 2);
        ctx.fill();

        // Moon glow
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ffaaaa';
        ctx.beginPath();
        ctx.arc(400, 45, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Distant city
        ctx.fillStyle = '#1a1018';
        this.#drawDistantCity(ctx, 105);

        // Water
        this.#waterAnimation.render(ctx);

        // Stone beach
        this.#drawStoneBeach(ctx, 210);
    }

    /**
     * Draw distant city silhouette
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} y - Y position
     */
    #drawDistantCity(ctx, y) {
        ctx.beginPath();
        ctx.moveTo(0, y + 35);

        const buildings = [10, 18, 14, 25, 20, 30, 18, 26, 12, 22, 15, 20, 12, 18];
        let x = 0;
        const buildingWidth = INTERNAL_WIDTH / buildings.length;

        for (const height of buildings) {
            ctx.lineTo(x, y + 35 - height);
            ctx.lineTo(x + buildingWidth - 3, y + 35 - height);
            x += buildingWidth;
        }

        ctx.lineTo(INTERNAL_WIDTH, y + 35);
        ctx.fill();

        // City lights
        ctx.fillStyle = '#ff8888';
        x = 4;
        for (let i = 0; i < buildings.length; i++) {
            const height = buildings[i];
            for (let ly = y + 35 - height + 3; ly < y + 32; ly += 5) {
                if (Math.sin(this.#time + i + ly) > 0.3) {
                    ctx.fillRect(x + Math.floor(Math.random() * 18), Math.floor(ly), 1, 1);
                }
            }
            x += buildingWidth;
        }
    }

    /**
     * Draw stone beach
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} y - Y position
     */
    #drawStoneBeach(ctx, y) {
        // Beach gradient
        const beachGradient = ctx.createLinearGradient(0, y, 0, INTERNAL_HEIGHT);
        beachGradient.addColorStop(0, '#4a3a44');
        beachGradient.addColorStop(0.5, '#3a2a34');
        beachGradient.addColorStop(1, '#2a1a24');
        ctx.fillStyle = beachGradient;
        ctx.fillRect(0, y, INTERNAL_WIDTH, INTERNAL_HEIGHT - y);

        // Light stones
        ctx.fillStyle = '#5a4a54';
        for (let i = 0; i < 60; i++) {
            const sx = (i * 37 + 5) % INTERNAL_WIDTH;
            const sy = y + 8 + (i * 13) % 55;
            const size = 3 + (i % 4);
            ctx.beginPath();
            ctx.ellipse(sx, sy, size, size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dark stones
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

    /**
     * Render scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        super.render(ctx);

        this.#splashEffect.render(ctx);

        // Water overlay on characters
        if (this.#endingSequenceActive && this.gio.y < 210) {
            const waterLevel = 200;
            if (this.gio.y < waterLevel + 30) {
                ctx.fillStyle = 'rgba(60, 30, 50, 0.4)';
                const coverHeight = Math.min(40, waterLevel + 30 - this.gio.y);
                ctx.fillRect(this.gio.x - 30, this.gio.y, 60, coverHeight);
                ctx.fillRect(this.tamo.x - 30, this.tamo.y, 60, coverHeight);
            }
        }

        this.#touchHearts.render(ctx);

        // Fade overlay
        if (this.#fadeAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(this.#fadeAlpha, 1)})`;
            ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
        }
    }
}

export default SceneB_StoneBeach;
