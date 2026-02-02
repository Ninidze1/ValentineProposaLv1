// ParallaxLayer.js - Parallax scrolling background layer
class ParallaxLayer {
    constructor(image, speed = 0, y = 0) {
        this.image = image;
        this.speed = speed;
        this.y = y;
        this.offset = 0;
    }

    update(dt, scrollAmount = 0) {
        this.offset += scrollAmount * this.speed;
    }

    render(ctx, globalOffset = 0) {
        if (!this.image) return;

        const offsetX = Math.floor(globalOffset * this.speed);

        // If image is wider than canvas, handle wrapping
        if (this.image.width > INTERNAL_WIDTH) {
            const x = -offsetX % this.image.width;
            ctx.drawImage(this.image, x, this.y);
            if (x + this.image.width < INTERNAL_WIDTH) {
                ctx.drawImage(this.image, x + this.image.width, this.y);
            }
            if (x > 0) {
                ctx.drawImage(this.image, x - this.image.width, this.y);
            }
        } else {
            // Center the image if smaller than canvas
            const x = Math.floor((INTERNAL_WIDTH - this.image.width) / 2) + offsetX;
            ctx.drawImage(this.image, x, this.y);
        }
    }
}
