// AssetLoader.js - Image and asset management
class AssetLoader {
    constructor() {
        this.images = new Map();
        this.loaded = false;
        this.onProgress = null;
    }

    async loadImages(imageList) {
        const total = imageList.length;
        let loadedCount = 0;

        const promises = imageList.map(async (item) => {
            try {
                const img = await this.loadImage(item.path);
                this.images.set(item.id, img);
            } catch (e) {
                console.warn(`Failed to load: ${item.path}`, e);
                // Create a placeholder colored rectangle
                this.images.set(item.id, this.createPlaceholder(32, 48, item.color || '#ff00ff'));
            }
            loadedCount++;
            if (this.onProgress) {
                this.onProgress(loadedCount / total);
            }
        });

        await Promise.all(promises);
        this.loaded = true;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    createPlaceholder(width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        return canvas;
    }

    getImage(id) {
        return this.images.get(id);
    }

    hasImage(id) {
        return this.images.has(id);
    }
}
