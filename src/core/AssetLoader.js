/**
 * @fileoverview Image and asset management
 * @module core/AssetLoader
 */

/**
 * @typedef {Object} ImageLoadItem
 * @property {string} id - Asset identifier
 * @property {string} path - Path to image file
 * @property {string} [color] - Placeholder color if load fails
 */

/**
 * @callback ProgressCallback
 * @param {number} progress - Progress value from 0 to 1
 */

const DEFAULT_PLACEHOLDER_WIDTH = 32;
const DEFAULT_PLACEHOLDER_HEIGHT = 48;
const DEFAULT_PLACEHOLDER_COLOR = '#ff00ff';

/**
 * Manages loading and storing of image assets
 */
export class AssetLoader {
    /** @type {Map<string, HTMLImageElement|HTMLCanvasElement>} */
    #images = new Map();

    /** @type {boolean} */
    #loaded = false;

    /** @type {ProgressCallback|null} */
    #onProgress = null;

    constructor() {}

    /**
     * Set progress callback
     * @param {ProgressCallback} callback - Progress callback function
     */
    set onProgress(callback) {
        this.#onProgress = callback;
    }

    /**
     * Get progress callback
     * @returns {ProgressCallback|null}
     */
    get onProgress() {
        return this.#onProgress;
    }

    /**
     * Check if assets are loaded
     * @returns {boolean}
     */
    get loaded() {
        return this.#loaded;
    }

    /**
     * Set loaded state
     * @param {boolean} value
     */
    set loaded(value) {
        this.#loaded = value;
    }

    /**
     * Get the images map (for direct access by SpriteLoader)
     * @returns {Map<string, HTMLImageElement|HTMLCanvasElement>}
     */
    get images() {
        return this.#images;
    }

    /**
     * Load a single image
     * @param {string} src - Image source path
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    /**
     * Load multiple images with progress tracking
     * @param {ImageLoadItem[]} imageList - Array of images to load
     * @returns {Promise<void>}
     */
    async loadImages(imageList) {
        const total = imageList.length;
        let loadedCount = 0;

        const promises = imageList.map(async (item) => {
            try {
                const img = await this.loadImage(item.path);
                this.#images.set(item.id, img);
            } catch (e) {
                console.warn(`Failed to load: ${item.path}`, e);
                this.#images.set(
                    item.id,
                    this.createPlaceholder(
                        DEFAULT_PLACEHOLDER_WIDTH,
                        DEFAULT_PLACEHOLDER_HEIGHT,
                        item.color || DEFAULT_PLACEHOLDER_COLOR
                    )
                );
            }

            loadedCount++;
            if (this.#onProgress) {
                this.#onProgress(loadedCount / total);
            }
        });

        await Promise.all(promises);
        this.#loaded = true;
    }

    /**
     * Create a colored placeholder canvas
     * @param {number} width - Placeholder width
     * @param {number} height - Placeholder height
     * @param {string} color - Fill color
     * @returns {HTMLCanvasElement}
     */
    createPlaceholder(width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        return canvas;
    }

    /**
     * Get an image by ID
     * @param {string} id - Asset identifier
     * @returns {HTMLImageElement|HTMLCanvasElement|undefined}
     */
    getImage(id) {
        return this.#images.get(id);
    }

    /**
     * Check if an image exists
     * @param {string} id - Asset identifier
     * @returns {boolean}
     */
    hasImage(id) {
        return this.#images.has(id);
    }

    /**
     * Remove an image from the cache
     * @param {string} id - Asset identifier
     * @returns {boolean} True if image was removed
     */
    removeImage(id) {
        return this.#images.delete(id);
    }

    /**
     * Clear all loaded images
     */
    clear() {
        this.#images.clear();
        this.#loaded = false;
    }

    /**
     * Get the number of loaded images
     * @returns {number}
     */
    get size() {
        return this.#images.size;
    }
}

export default AssetLoader;
