// InputManager.js - Mouse and touch input handling
class InputManager {
    constructor(canvasObj) {
        this.canvasObj = canvasObj;
        this.canvas = canvasObj.canvas;
        this.onClick = null;
        this.onMove = null;

        this.mouseX = 0;
        this.mouseY = 0;
        this.isPressed = false;

        this.setupListeners();
    }

    setupListeners() {
        // Mouse events
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mousedown', () => this.isPressed = true);
        this.canvas.addEventListener('mouseup', () => this.isPressed = false);

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isPressed = true;
            const touch = e.touches[0];
            this.handleMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isPressed = false;
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                this.handleClick({ clientX: touch.clientX, clientY: touch.clientY });
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });
    }

    handleClick(e) {
        const pos = this.canvasObj.screenToCanvas(e.clientX, e.clientY);
        if (this.onClick) {
            this.onClick(pos.x, pos.y);
        }
    }

    handleMove(e) {
        const pos = this.canvasObj.screenToCanvas(e.clientX, e.clientY);
        this.mouseX = pos.x;
        this.mouseY = pos.y;
        if (this.onMove) {
            this.onMove(pos.x, pos.y);
        }
    }
}
