// Canvas.js - Pixel-perfect rendering setup
class Canvas {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Set internal resolution
        this.canvas.width = INTERNAL_WIDTH;
        this.canvas.height = INTERNAL_HEIGHT;

        // Disable image smoothing for crisp pixels
        this.ctx.imageSmoothingEnabled = false;

        // CSS for pixel-perfect scaling
        this.canvas.style.imageRendering = 'pixelated';
        this.canvas.style.imageRendering = 'crisp-edges';
        this.canvas.style.imageRendering = '-moz-crisp-edges';

        this.container.appendChild(this.canvas);

        this.scale = 1;
        this.displayWidth = INTERNAL_WIDTH;
        this.displayHeight = INTERNAL_HEIGHT;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const windowRatio = window.innerWidth / window.innerHeight;

        if (windowRatio > ASPECT_RATIO) {
            // Window is wider - fit to height
            this.displayHeight = window.innerHeight;
            this.displayWidth = this.displayHeight * ASPECT_RATIO;
        } else {
            // Window is taller - fit to width
            this.displayWidth = window.innerWidth;
            this.displayHeight = this.displayWidth / ASPECT_RATIO;
        }

        this.canvas.style.width = `${Math.floor(this.displayWidth)}px`;
        this.canvas.style.height = `${Math.floor(this.displayHeight)}px`;

        // Calculate scale factor for input conversion
        this.scale = this.displayWidth / INTERNAL_WIDTH;

        // Re-disable smoothing after resize
        this.ctx.imageSmoothingEnabled = false;
    }

    // Convert screen coordinates to internal canvas coordinates
    screenToCanvas(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: Math.floor((screenX - rect.left) / this.scale),
            y: Math.floor((screenY - rect.top) / this.scale)
        };
    }

    clear(color = COLORS.black) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    }
}
