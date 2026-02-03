/**
 * @fileoverview Centralized sprite loading and animation sheet generation
 * @module core/SpriteLoader
 */

/**
 * @typedef {Object} FrameData
 * @property {number} width - Frame width in pixels
 * @property {number} height - Frame height in pixels
 */

/**
 * @typedef {Object} SpriteConfig
 * @property {string} key - Asset key for storage
 * @property {string} path - Path to sprite image
 * @property {boolean} [createSheet=true] - Whether to generate animation sheet
 * @property {string} [fallbackKey] - Key to use if loading fails
 */

const ANIMATION_FRAMES = 4;
const BOB_DOWN_OFFSET = 3;
const BOB_UP_OFFSET = -2;

/**
 * Handles sprite loading and animation sheet generation
 */
export class SpriteLoader {
    /** @type {Map<string, FrameData>} */
    #frameData = new Map();

    /** @type {import('./AssetLoader.js').AssetLoader} */
    #assets;

    /**
     * @param {import('./AssetLoader.js').AssetLoader} assets - Asset loader instance
     */
    constructor(assets) {
        this.#assets = assets;
    }

    /**
     * Load an image asynchronously
     * @param {string} src - Image source path
     * @returns {Promise<HTMLImageElement>}
     */
    #loadImageAsync(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    }

    /**
     * Create a 4-frame animation sheet from a single sprite
     * @param {HTMLImageElement} sourceImg - Source sprite image
     * @returns {HTMLCanvasElement} Animation sheet canvas
     */
    #createAnimationSheet(sourceImg) {
        const frameWidth = sourceImg.width;
        const frameHeight = sourceImg.height;

        const sheetCanvas = document.createElement('canvas');
        sheetCanvas.width = frameWidth * ANIMATION_FRAMES;
        sheetCanvas.height = frameHeight;

        const ctx = sheetCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Frame 0: Original
        ctx.drawImage(sourceImg, 0, 0);

        // Frame 1: Bob down
        ctx.drawImage(sourceImg, frameWidth, BOB_DOWN_OFFSET);

        // Frame 2: Original
        ctx.drawImage(sourceImg, frameWidth * 2, 0);

        // Frame 3: Bob up
        ctx.drawImage(sourceImg, frameWidth * 3, BOB_UP_OFFSET);

        return sheetCanvas;
    }

    /**
     * Load a sprite and optionally create an animation sheet
     * @param {string} key - Asset key for storage
     * @param {string} path - Path to sprite image
     * @param {boolean} [createSheet=true] - Whether to generate animation sheet
     * @returns {Promise<HTMLImageElement|null>} Loaded image or null if failed
     */
    async loadSprite(key, path, createSheet = true) {
        try {
            const img = await this.#loadImageAsync(path);

            this.#frameData.set(key, {
                width: img.width,
                height: img.height,
            });

            if (createSheet) {
                const sheet = this.#createAnimationSheet(img);
                this.#assets.images.set(key, sheet);
            } else {
                this.#assets.images.set(key, img);
            }

            return img;
        } catch (error) {
            console.warn(`Sprite not found: ${path}`);
            return null;
        }
    }

    /**
     * Load a sprite with a fallback if it fails
     * @param {string} key - Asset key for storage
     * @param {string} path - Path to sprite image
     * @param {string} fallbackKey - Key of fallback sprite to use
     * @param {boolean} [createSheet=true] - Whether to generate animation sheet
     * @returns {Promise<boolean>} True if loaded successfully
     */
    async loadSpriteWithFallback(key, path, fallbackKey, createSheet = true) {
        const result = await this.loadSprite(key, path, createSheet);

        if (!result && fallbackKey) {
            const fallbackImg = this.#assets.images.get(fallbackKey);
            if (fallbackImg) {
                this.#assets.images.set(key, fallbackImg);
                const fallbackData = this.#frameData.get(fallbackKey);
                if (fallbackData) {
                    this.#frameData.set(key, { ...fallbackData });
                }
                return true;
            }
        }

        return result !== null;
    }

    /**
     * Load multiple sprites in parallel
     * @param {SpriteConfig[]} configs - Array of sprite configurations
     * @returns {Promise<Map<string, boolean>>} Map of key to success status
     */
    async loadSprites(configs) {
        const results = new Map();

        const promises = configs.map(async (config) => {
            const { key, path, createSheet = true, fallbackKey } = config;

            let success;
            if (fallbackKey) {
                success = await this.loadSpriteWithFallback(key, path, fallbackKey, createSheet);
            } else {
                const result = await this.loadSprite(key, path, createSheet);
                success = result !== null;
            }

            results.set(key, success);
        });

        await Promise.all(promises);
        return results;
    }

    /**
     * Get frame data for a loaded sprite
     * @param {string} key - Asset key
     * @returns {FrameData|undefined} Frame data or undefined if not loaded
     */
    getFrameData(key) {
        return this.#frameData.get(key);
    }

    /**
     * Get frame width for a sprite
     * @param {string} key - Asset key
     * @param {number} [defaultValue=80] - Default value if not found
     * @returns {number} Frame width
     */
    getFrameWidth(key, defaultValue = 80) {
        return this.#frameData.get(key)?.width ?? defaultValue;
    }

    /**
     * Get frame height for a sprite
     * @param {string} key - Asset key
     * @param {number} [defaultValue=100] - Default value if not found
     * @returns {number} Frame height
     */
    getFrameHeight(key, defaultValue = 100) {
        return this.#frameData.get(key)?.height ?? defaultValue;
    }

    /**
     * Check if a sprite has been loaded
     * @param {string} key - Asset key
     * @returns {boolean} True if sprite is loaded
     */
    hasSprite(key) {
        return this.#assets.images.has(key);
    }

    /**
     * Clear all loaded frame data
     */
    clear() {
        this.#frameData.clear();
    }
}

export default SpriteLoader;
