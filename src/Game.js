/**
 * @fileoverview Main game class with sprite loading and game loop
 * @module Game
 */

import { Canvas } from './core/Canvas.js';
import { AssetLoader } from './core/AssetLoader.js';
import { InputManager } from './core/InputManager.js';
import { StateMachine } from './core/StateMachine.js';
import { SpriteLoader } from './core/SpriteLoader.js';
import {
    SceneA_BeachClub,
    SceneB_StoneBeach,
    SceneC_EndScreen,
    TransitionFade
} from './scenes/index.js';
import {
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    COLORS,
    GAME_STATES,
    ASSET_PATHS,
    SPRITE_KEYS,
    CHARACTER
} from './utils/constants.js';

/**
 * Main game class managing canvas, assets, and game loop
 */
export class Game {
    /** @type {Canvas|null} */
    canvas = null;

    /** @type {AssetLoader|null} */
    assets = null;

    /** @type {InputManager|null} */
    input = null;

    /** @type {StateMachine|null} */
    stateMachine = null;

    /** @type {SpriteLoader|null} */
    #spriteLoader = null;

    /** @type {number} */
    #lastTime = 0;

    /** @type {boolean} */
    #running = false;

    // Character frame dimensions
    /** @type {number} */
    gioFrameWidth = CHARACTER.DEFAULT_FRAME_WIDTH;

    /** @type {number} */
    gioFrameHeight = CHARACTER.DEFAULT_FRAME_HEIGHT;

    /** @type {number} */
    tamoFrameWidth = CHARACTER.DEFAULT_FRAME_WIDTH;

    /** @type {number} */
    tamoFrameHeight = CHARACTER.DEFAULT_FRAME_HEIGHT;

    /** @type {number|undefined} */
    gioBFrameWidth;

    /** @type {number|undefined} */
    gioBFrameHeight;

    /** @type {number|undefined} */
    tamoBFrameWidth;

    /** @type {number|undefined} */
    tamoBFrameHeight;

    /** @type {number|undefined} */
    gioNakedFrameWidth;

    /** @type {number|undefined} */
    gioNakedFrameHeight;

    /** @type {number|undefined} */
    tamoNakedFrameWidth;

    /** @type {number|undefined} */
    tamoNakedFrameHeight;

    /** @type {number|undefined} */
    gioSwimFrameWidth;

    /** @type {number|undefined} */
    gioSwimFrameHeight;

    /** @type {number|undefined} */
    tamoSwimFrameWidth;

    /** @type {number|undefined} */
    tamoSwimFrameHeight;

    /**
     * Initialize the game
     * @returns {Promise<void>}
     */
    async init() {
        this.canvas = new Canvas('#game-container');
        this.assets = new AssetLoader();
        this.#spriteLoader = new SpriteLoader(this.assets);

        this.#renderLoading(0);

        await this.#loadSprites();

        this.input = new InputManager(this.canvas);
        this.input.onClick = (x, y) => {
            this.stateMachine.handleClick(x, y);
        };

        this.#setupStateMachine();

        this.#running = true;
        this.#lastTime = performance.now();
        requestAnimationFrame((time) => this.#gameLoop(time));
    }

    /**
     * Load all game sprites using SpriteLoader
     * @returns {Promise<void>}
     */
    async #loadSprites() {
        // Load Scene A sprites
        await this.#spriteLoader.loadSprite(
            SPRITE_KEYS.GIO_ORIGINAL,
            ASSET_PATHS.GIO_A,
            false
        );
        await this.#spriteLoader.loadSprite(
            SPRITE_KEYS.TAMO_ORIGINAL,
            ASSET_PATHS.TAMO_A,
            false
        );

        const gioOriginal = this.#spriteLoader.getFrameData(SPRITE_KEYS.GIO_ORIGINAL);
        const tamoOriginal = this.#spriteLoader.getFrameData(SPRITE_KEYS.TAMO_ORIGINAL);

        if (gioOriginal) {
            this.gioFrameWidth = gioOriginal.width;
            this.gioFrameHeight = gioOriginal.height;
        }
        if (tamoOriginal) {
            this.tamoFrameWidth = tamoOriginal.width;
            this.tamoFrameHeight = tamoOriginal.height;
        }

        // Create animation sheets for Scene A
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.GIO, ASSET_PATHS.GIO_A);
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.TAMO, ASSET_PATHS.TAMO_A);

        // Load Scene B sprites with fallback
        await this.#spriteLoader.loadSpriteWithFallback(
            SPRITE_KEYS.GIO_B,
            ASSET_PATHS.GIO_B,
            SPRITE_KEYS.GIO
        );
        await this.#spriteLoader.loadSpriteWithFallback(
            SPRITE_KEYS.TAMO_B,
            ASSET_PATHS.TAMO_B,
            SPRITE_KEYS.TAMO
        );

        const gioBData = this.#spriteLoader.getFrameData(SPRITE_KEYS.GIO_B);
        const tamoBData = this.#spriteLoader.getFrameData(SPRITE_KEYS.TAMO_B);

        if (gioBData) {
            this.gioBFrameWidth = gioBData.width;
            this.gioBFrameHeight = gioBData.height;
        }
        if (tamoBData) {
            this.tamoBFrameWidth = tamoBData.width;
            this.tamoBFrameHeight = tamoBData.height;
        }

        // Load naked sprites
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.GIO_NAKED, ASSET_PATHS.GIO_NAKED);
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.TAMO_NAKED, ASSET_PATHS.TAMO_NAKED);

        const gioNakedData = this.#spriteLoader.getFrameData(SPRITE_KEYS.GIO_NAKED);
        const tamoNakedData = this.#spriteLoader.getFrameData(SPRITE_KEYS.TAMO_NAKED);

        if (gioNakedData) {
            this.gioNakedFrameWidth = gioNakedData.width;
            this.gioNakedFrameHeight = gioNakedData.height;
        }
        if (tamoNakedData) {
            this.tamoNakedFrameWidth = tamoNakedData.width;
            this.tamoNakedFrameHeight = tamoNakedData.height;
        }

        // Load swim sprites
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.GIO_SWIM, ASSET_PATHS.GIO_SWIM);
        await this.#spriteLoader.loadSprite(SPRITE_KEYS.TAMO_SWIM, ASSET_PATHS.TAMO_SWIM);

        const gioSwimData = this.#spriteLoader.getFrameData(SPRITE_KEYS.GIO_SWIM);
        const tamoSwimData = this.#spriteLoader.getFrameData(SPRITE_KEYS.TAMO_SWIM);

        if (gioSwimData) {
            this.gioSwimFrameWidth = gioSwimData.width;
            this.gioSwimFrameHeight = gioSwimData.height;
        }
        if (tamoSwimData) {
            this.tamoSwimFrameWidth = tamoSwimData.width;
            this.tamoSwimFrameHeight = tamoSwimData.height;
        }

        // Load background images
        await this.#spriteLoader.loadSprite(
            SPRITE_KEYS.BACKGROUND_A,
            ASSET_PATHS.BACKGROUND_A,
            false
        );
        await this.#spriteLoader.loadSprite(
            SPRITE_KEYS.BACKGROUND_B,
            ASSET_PATHS.BACKGROUND_B,
            false
        );

        this.assets.loaded = true;
    }

    /**
     * Setup the state machine with all scenes
     */
    #setupStateMachine() {
        this.stateMachine = new StateMachine(this);

        this.stateMachine.addState(GAME_STATES.SCENE_A, new SceneA_BeachClub(this));
        this.stateMachine.addState(GAME_STATES.SCENE_B, new SceneB_StoneBeach(this));
        this.stateMachine.addState(GAME_STATES.SCENE_C, new SceneC_EndScreen(this));
        this.stateMachine.addState(GAME_STATES.TRANSITION, new TransitionFade(this));

        this.stateMachine.setState(GAME_STATES.SCENE_A);
    }

    /**
     * Render loading screen
     * @param {number} progress - Loading progress (0-1)
     */
    #renderLoading(progress) {
        const ctx = this.canvas.ctx;

        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

        const centerY = INTERNAL_HEIGHT / 2;

        // Progress bar background
        ctx.fillStyle = '#333';
        ctx.fillRect(INTERNAL_WIDTH / 2 - 100, centerY, 200, 10);

        // Progress bar fill
        ctx.fillStyle = COLORS.pink;
        ctx.fillRect(INTERNAL_WIDTH / 2 - 100, centerY, 200 * progress, 10);

        // Loading text
        ctx.fillStyle = COLORS.white;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', INTERNAL_WIDTH / 2, centerY - 10);
    }

    /**
     * Main game loop
     * @param {number} time - Current timestamp
     */
    #gameLoop(time) {
        if (!this.#running) {
            return;
        }

        const dt = Math.min((time - this.#lastTime) / 1000, 0.1);
        this.#lastTime = time;

        this.stateMachine.update(dt);

        this.canvas.clear('#000000');
        this.stateMachine.render(this.canvas.ctx);

        requestAnimationFrame((t) => this.#gameLoop(t));
    }

    /**
     * Stop the game loop
     */
    stop() {
        this.#running = false;
        if (this.input) {
            this.input.destroy();
        }
    }
}

export default Game;
