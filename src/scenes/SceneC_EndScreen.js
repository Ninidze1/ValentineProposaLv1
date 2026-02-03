/**
 * @fileoverview Final celebration end screen
 * @module scenes/SceneC_EndScreen
 */

import { Scene } from './Scene.js';
import { Button } from '../ui/Button.js';
import { TouchHearts } from '../effects/TouchHearts.js';
import { ShootingStars } from '../effects/ShootingStar.js';
import { INTERNAL_WIDTH, INTERNAL_HEIGHT, COLORS } from '../utils/constants.js';

/**
 * @typedef {Object} Star
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} size - Star size (1 or 2)
 * @property {number} twinkleSpeed - Twinkle animation speed
 * @property {number} twinkleOffset - Phase offset for twinkle
 */

/**
 * @typedef {Object} FloatingHeart
 * @property {number} x - X position
 * @property {number} y - Y position
 * @property {number} speed - Upward speed
 * @property {number} wobble - Wobble phase
 * @property {number} wobbleSpeed - Wobble animation speed
 * @property {number} size - Heart size
 * @property {string} color - Heart color
 */

const HEART_COLORS = ['#ff6b6b', '#ff8e8e', '#ff6b9a', '#ff9a8e'];
const HEART_SPAWN_INTERVAL = 0.4;
const STAR_COUNT = 50;
const INITIAL_HEARTS = 15;

/**
 * Final celebration screen with floating hearts
 */
export class SceneC_EndScreen extends Scene {
    /** @type {number} */
    #time = 0;

    /** @type {number} */
    #heartSpawnTimer = 0;

    /** @type {FloatingHeart[]} */
    #floatingHearts = [];

    /** @type {Star[]} */
    #stars = [];

    /** @type {Button} */
    #replayButton;

    /** @type {TouchHearts} */
    #touchHearts;

    /** @type {ShootingStars} */
    #shootingStars;

    /**
     * Setup scene
     * @param {Object} [params] - Scene parameters
     */
    setup(params) {
        this.#time = 0;
        this.#heartSpawnTimer = 0;
        this.#floatingHearts = [];

        // Create pixel stars
        this.#stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            this.#stars.push({
                x: Math.random() * INTERNAL_WIDTH,
                y: Math.random() * INTERNAL_HEIGHT,
                size: Math.random() < 0.3 ? 2 : 1,
                twinkleSpeed: 1 + Math.random() * 3,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }

        // Replay button
        this.#replayButton = new Button({
            x: INTERNAL_WIDTH / 2 - 35,
            y: INTERNAL_HEIGHT - 40,
            width: 70,
            height: 22,
            text: "REPLAY",
            color: COLORS.pink,
            onClick: () => {
                this.game.stateMachine.setState('sceneA');
            }
        });
        this.ui.push(this.#replayButton);

        // Initial floating hearts
        for (let i = 0; i < INITIAL_HEARTS; i++) {
            this.#spawnFloatingHeart();
        }

        // Effects
        this.#touchHearts = new TouchHearts();
        this.#shootingStars = new ShootingStars();
    }

    /**
     * Spawn a new floating heart
     */
    #spawnFloatingHeart() {
        this.#floatingHearts.push({
            x: Math.random() * INTERNAL_WIDTH,
            y: INTERNAL_HEIGHT + 10,
            speed: 20 + Math.random() * 25,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 1 + Math.random() * 2,
            size: 4 + Math.random() * 5,
            color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]
        });
    }

    /**
     * Update scene
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        super.update(dt);
        this.#time += dt;

        // Spawn new hearts
        this.#heartSpawnTimer += dt;
        if (this.#heartSpawnTimer >= HEART_SPAWN_INTERVAL) {
            this.#heartSpawnTimer = 0;
            this.#spawnFloatingHeart();
        }

        // Update floating hearts
        for (const heart of this.#floatingHearts) {
            heart.y -= heart.speed * dt;
            heart.wobble += heart.wobbleSpeed * dt;
            heart.x += Math.sin(heart.wobble) * 0.6;
        }

        // Remove off-screen hearts
        this.#floatingHearts = this.#floatingHearts.filter(h => h.y > -20);

        this.#touchHearts.update(dt);
        this.#shootingStars.update(dt);
    }

    /**
     * Handle click event
     * @param {number} x - Click X position
     * @param {number} y - Click Y position
     * @returns {boolean} True if click was handled
     */
    handleClick(x, y) {
        this.#touchHearts.emit(x, y, 5);
        return super.handleClick(x, y);
    }

    /**
     * Render background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    renderBackground(ctx) {
        // Dark gradient with pink tint
        const gradient = ctx.createLinearGradient(0, 0, 0, INTERNAL_HEIGHT);
        gradient.addColorStop(0, '#1a0a14');
        gradient.addColorStop(0.5, '#2a1a24');
        gradient.addColorStop(1, '#14080f');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

        this.#renderStars(ctx);
        this.#shootingStars.render(ctx);
    }

    /**
     * Render pixel art stars
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    #renderStars(ctx) {
        for (const star of this.#stars) {
            const twinkle = Math.sin(this.#time * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6;
            ctx.globalAlpha = twinkle;

            if (star.size === 2) {
                // 4-point pixel star (bigger)
                ctx.fillStyle = COLORS.white;
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
                ctx.fillStyle = COLORS.white;
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), 1, 1);
            }
        }
        ctx.globalAlpha = 1;
    }

    /**
     * Render scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        this.renderBackground(ctx);

        // Floating hearts
        for (const heart of this.#floatingHearts) {
            ctx.fillStyle = heart.color;
            this.#drawPixelHeart(ctx, heart.x, heart.y, heart.size);
        }

        // Main message with pink glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.pink;

        ctx.fillStyle = COLORS.white;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("And they lived happily", INTERNAL_WIDTH / 2, 70);
        ctx.fillText("ever after,", INTERNAL_WIDTH / 2, 90);
        ctx.fillText("forever and always", INTERNAL_WIDTH / 2, 110);

        ctx.shadowBlur = 0;

        // Big central heart
        const heartPulse = 1 + Math.sin(this.#time * 3) * 0.1;
        ctx.save();
        ctx.translate(INTERNAL_WIDTH / 2, 160);
        ctx.scale(heartPulse, heartPulse);
        ctx.fillStyle = COLORS.pink;
        this.#drawPixelHeart(ctx, 0, 0, 20);
        ctx.restore();

        // Names
        ctx.fillStyle = '#ff9a9a';
        ctx.font = '14px monospace';
        ctx.fillText("Gio + Talula", INTERNAL_WIDTH / 2, 200);

        // UI
        for (const uiElement of this.ui) {
            uiElement.render(ctx);
        }

        // Touch hearts on top
        this.#touchHearts.render(ctx);
    }

    /**
     * Draw a pixel art heart
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} size - Heart size
     */
    #drawPixelHeart(ctx, x, y, size) {
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

export default SceneC_EndScreen;
