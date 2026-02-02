// Button.js - Canvas-based clickable button
class Button {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.text = config.text;
        this.color = config.color || COLORS.pink;
        this.textColor = config.textColor || COLORS.white;
        this.onClick = config.onClick;
        this.scale = 1;
        this.visible = true;
        this.hovered = false;
    }

    setScale(scale) {
        this.scale = Math.max(0, scale);
    }

    containsPoint(px, py) {
        if (!this.visible || this.scale <= 0) return false;

        const hw = (this.width * this.scale) / 2;
        const hh = (this.height * this.scale) / 2;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        return px >= cx - hw && px <= cx + hw &&
               py >= cy - hh && py <= cy + hh;
    }

    handleClick() {
        if (this.onClick && this.visible && this.scale > 0) {
            this.onClick();
        }
    }

    update(dt) {
        // Could add hover effects or animations
    }

    render(ctx) {
        if (!this.visible || this.scale <= 0) return;

        ctx.save();

        const cx = Math.floor(this.x + this.width / 2);
        const cy = Math.floor(this.y + this.height / 2);

        ctx.translate(cx, cy);
        ctx.scale(this.scale, this.scale);

        // Button background
        ctx.fillStyle = this.color;
        ctx.fillRect(
            Math.floor(-this.width / 2),
            Math.floor(-this.height / 2),
            this.width,
            this.height
        );

        // Button border
        ctx.strokeStyle = this.textColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            Math.floor(-this.width / 2),
            Math.floor(-this.height / 2),
            this.width,
            this.height
        );

        // Button text
        ctx.fillStyle = this.textColor;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, 0, 1);

        ctx.restore();
    }
}
