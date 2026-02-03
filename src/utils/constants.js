/**
 * @fileoverview Game constants and configuration values
 * @module utils/constants
 */

// =============================================================================
// LAYOUT CONFIGURATION
// =============================================================================

/** Internal canvas width in pixels */
export const INTERNAL_WIDTH = 480;

/** Internal canvas height in pixels */
export const INTERNAL_HEIGHT = 270;

/** Canvas aspect ratio (16:9) */
export const ASPECT_RATIO = INTERNAL_WIDTH / INTERNAL_HEIGHT;

/**
 * Layout configuration object
 * @type {Readonly<{INTERNAL_WIDTH: number, INTERNAL_HEIGHT: number, ASPECT_RATIO: number}>}
 */
export const LAYOUT = Object.freeze({
    INTERNAL_WIDTH,
    INTERNAL_HEIGHT,
    ASPECT_RATIO,
});

// =============================================================================
// COLOR PALETTE
// =============================================================================

/**
 * Color palette for the game
 * @type {Readonly<Object.<string, string>>}
 */
export const COLORS = Object.freeze({
    pink: '#ff6b6b',
    lightPink: '#ff8e8e',
    white: '#ffffff',
    black: '#000000',
    gray: '#888888',
    darkGray: '#333333',
    water: '#1a3a5c',
    waterLight: '#2a5a8c',
    sand: '#c2a060',
    night: '#0a0a1a',
});

// =============================================================================
// ANIMATION STATES
// =============================================================================

/**
 * Character animation state names
 * @type {Readonly<Object.<string, string>>}
 */
export const ANIM_STATES = Object.freeze({
    DANCE: 'dance',
    SIT: 'sit',
    STAND: 'stand',
    WALK: 'walk',
    WADE: 'wade',
    SWIM: 'swim',
});

// =============================================================================
// GAME STATES
// =============================================================================

/**
 * Game state/scene names
 * @type {Readonly<Object.<string, string>>}
 */
export const GAME_STATES = Object.freeze({
    LOADING: 'loading',
    SCENE_A: 'sceneA',
    TRANSITION: 'transition',
    SCENE_B: 'sceneB',
    SCENE_C: 'sceneC',
});

// =============================================================================
// CHARACTER CONFIGURATION
// =============================================================================

/**
 * Character rendering configuration
 * @type {Readonly<Object>}
 */
export const CHARACTER = Object.freeze({
    DEFAULT_FRAME_WIDTH: 80,
    DEFAULT_FRAME_HEIGHT: 100,
    DEFAULT_SCALE: 2,
    TARGET_WIDTH: 64,
    TARGET_HEIGHT: 96,
    SWIM_TARGET_WIDTH: 45,
    SWIM_TARGET_HEIGHT: 42,
    GIO_SIZE_MULTIPLIER: 1.15,
    TAMO_WIDTH_MULTIPLIER: 0.85,
    TAMO_NAKED_WIDTH_MULTIPLIER: 0.97,
    SHADOW_WIDTH_RATIO: 0.6,
    SHADOW_HEIGHT_RATIO: 0.3,
});

// =============================================================================
// SCENE A (BEACH CLUB) CONFIGURATION
// =============================================================================

/**
 * Scene A (Beach Club) configuration
 * @type {Readonly<Object>}
 */
export const SCENE_A_CONFIG = Object.freeze({
    TAMO_X: 80,
    TAMO_Y: 210,
    GIO_X: 400,
    GIO_Y: 210,
    GIO_SIZE_MULTIPLIER: 1.15,
    LIGHT_COUNT: 6,
    LIGHT_SPACING: 80,
    LIGHT_START_X: 40,
    CROWD_GAP_START: 170,
    CROWD_GAP_END: 310,
});

// =============================================================================
// SCENE A MOVEMENT CONFIGURATION
// =============================================================================

/**
 * Scene A movement and interaction configuration
 * @type {Readonly<Object>}
 */
export const SCENE_A_MOVEMENT = Object.freeze({
    MOVE_SPEED: 100,            // Pixels per second
    MIN_X: 50,                  // Left boundary
    MAX_X: 430,                 // Right boundary
    PROXIMITY_THRESHOLD: 60,    // Distance to trigger dialog
});

// =============================================================================
// SCENE B (STONE BEACH) CONFIGURATION
// =============================================================================

/**
 * Scene B (Stone Beach) configuration
 * @type {Readonly<Object>}
 */
export const SCENE_B_CONFIG = Object.freeze({
    TAMO_X: 200,
    TAMO_Y: 230,
    GIO_X: 280,
    GIO_Y: 230,
    GIO_SIZE_MULTIPLIER: 1.15,
    TAMO_WIDTH_MULTIPLIER: 0.85,
    WATER_LEVEL_PERCENT: 0.6,
    FIREFLY_COUNT: 12,
    RIPPLE_INTERVAL: 2.5,
});

// =============================================================================
// ENDING SEQUENCE PHASES
// =============================================================================

/**
 * Ending sequence phase timing (in seconds)
 * @type {Readonly<Object>}
 */
export const ENDING_PHASES = Object.freeze({
    STAND_NAKED: { start: 0, end: 1.2 },
    WALK_TO_WATER: { start: 1.2, end: 2.5 },
    ENTER_WATER: { start: 2.5, end: 4.0 },
    SETTLE: { start: 4.0, end: 5.0 },
    SWIM_TOGETHER: { start: 5.0, end: 13.0 },
    FADE_OUT: { start: 11.5, end: 13.0 },
    TRANSITION: { time: 13.0 },
});

/**
 * Swimming animation configuration
 * @type {Readonly<Object>}
 */
export const SWIM_CONFIG = Object.freeze({
    Y_OFFSET: 25,
    COUPLE_SPACING: 30,
    DRIFT_AMOUNT: 70,
    BOB_SPEED: 1.2,
    BOB_AMPLITUDE: 5,
    SECONDARY_BOB_SPEED: 2.5,
    SECONDARY_BOB_AMPLITUDE: 1.5,
    SPLASH_CHANCE: 0.015,
    RIPPLE_CHANCE: 0.025,
});

// =============================================================================
// TIMING CONFIGURATION
// =============================================================================

/**
 * Timing configuration for transitions and delays
 * @type {Readonly<Object>}
 */
export const TIMING = Object.freeze({
    TRANSITION_DURATION: 0.5,
    HEART_BURST_DELAY: 800,
    HEART_BURST_DELAY_MS: 800,
    MAX_DELTA_TIME: 0.1,
    PROMPT_ANIMATION_SPEED: 3,
    SHRINK_INCREMENT: 0.25,
});

// =============================================================================
// UI CONFIGURATION
// =============================================================================

/**
 * Prompt widget UI configuration
 * @type {Readonly<Object>}
 */
export const PROMPT_UI = Object.freeze({
    PADDING: 8,
    LINE_HEIGHT: 11,
    TEXT_BUTTON_GAP: 6,
    BUTTON_GAP: 16,
    BUTTON_WIDTH: 44,
    BUTTON_HEIGHT: 14,
    FRAME_WIDTH: 220,
    CORNER_RADIUS: 8,
    BOTTOM_MARGIN: 8,
});

// =============================================================================
// PARTICLE CONFIGURATION
// =============================================================================

/**
 * Heart burst particle configuration
 * @type {Readonly<Object>}
 */
export const HEART_BURST = Object.freeze({
    DEFAULT_COUNT: 50,
    SPEED_MIN: 30,
    SPEED_MAX: 80,
    LIFE_MIN: 1.5,
    LIFE_MAX: 3.0,
    GRAVITY: 15,
    ROTATION_SPEED: 2,
});

// =============================================================================
// SPRITE PATHS
// =============================================================================

/**
 * Asset paths for sprites and backgrounds
 * @type {Readonly<Object>}
 */
export const ASSET_PATHS = Object.freeze({
    GIO_A: 'assets/sprites/gio/gio-a.png',
    GIO_B: 'assets/sprites/gio/gio-b.png',
    GIO_NAKED: 'assets/sprites/gio/gio-naked.png',
    GIO_SWIM: 'assets/sprites/gio/gio-swim.png',
    TAMO_A: 'assets/sprites/tamo/tamo-a.png',
    TAMO_B: 'assets/sprites/tamo/tamo-b.png',
    TAMO_NAKED: 'assets/sprites/tamo/tamo-naked.png',
    TAMO_SWIM: 'assets/sprites/tamo/tamo-swim.png',
    BACKGROUND_A: 'assets/backgrounds/background-a.png',
    BACKGROUND_B: 'assets/backgrounds/background-b.png',
});

/**
 * Sprite keys used in AssetLoader
 * @type {Readonly<Object>}
 */
export const SPRITE_KEYS = Object.freeze({
    GIO: 'gio',
    GIO_B: 'gio-b',
    GIO_NAKED: 'gio-naked',
    GIO_SWIM: 'gio-swim',
    GIO_ORIGINAL: 'gio-original',
    TAMO: 'tamo',
    TAMO_B: 'tamo-b',
    TAMO_NAKED: 'tamo-naked',
    TAMO_SWIM: 'tamo-swim',
    TAMO_ORIGINAL: 'tamo-original',
    BACKGROUND_A: 'background-a',
    BACKGROUND_B: 'background-b',
});
