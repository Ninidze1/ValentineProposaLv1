// PromptWidget.js - Compact YES/NO prompt with shrinking NO button
class PromptWidget {
    constructor(config) {
        this.question = config.question;
        this.onYes = config.onYes;
        this.onNo = config.onNo;

        this.visible = true;
        this.noButtonScale = 1;
        this.noButtonHidden = false;

        // Position at bottom of screen - compact
        this.x = INTERNAL_WIDTH / 2;
        this.y = INTERNAL_HEIGHT - 40;

        // Button dimensions
        const buttonWidth = 50;
        const buttonHeight = 18;
        const buttonSpacing = 40;  // Spacing between buttons

        // Create buttons
        this.yesButton = new Button({
            x: this.x - buttonWidth - buttonSpacing / 2,
            y: this.y + 6,
            width: buttonWidth,
            height: buttonHeight,
            text: "YES",
            color: COLORS.pink,
            onClick: () => this.handleYes()
        });

        this.noButton = new Button({
            x: this.x + buttonSpacing / 2,
            y: this.y + 6,
            width: buttonWidth,
            height: buttonHeight,
            text: "NO",
            color: COLORS.gray,
            onClick: () => this.handleNo()
        });
    }

    handleYes() {
        if (this.onYes) {
            this.onYes();
        }
    }

    handleNo() {
        if (this.onNo) {
            this.onNo();
        }
    }

    shrinkNoButton(factor = 0.75) {
        this.noButtonScale *= factor;
        this.noButton.setScale(this.noButtonScale);

        if (this.noButtonScale < 0.25) {
            this.hideNoButton();
        }
    }

    hideNoButton() {
        this.noButtonHidden = true;
        this.noButton.visible = false;
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    containsPoint(x, y) {
        if (!this.visible) return false;

        if (this.yesButton.containsPoint(x, y)) {
            return 'yes';
        }
        if (!this.noButtonHidden && this.noButton.containsPoint(x, y)) {
            return 'no';
        }
        return false;
    }

    handleClick(x, y) {
        const hit = this.containsPoint(x, y);
        if (hit === 'yes') {
            this.yesButton.handleClick();
            return true;
        } else if (hit === 'no') {
            this.noButton.handleClick();
            return true;
        }
        return false;
    }

    update(dt) {
        if (!this.visible) return;
        this.yesButton.update(dt);
        if (!this.noButtonHidden) {
            this.noButton.update(dt);
        }
    }

    render(ctx) {
        if (!this.visible) return;

        // Compact question background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const bgWidth = 280;
        const bgHeight = 56;  // Taller for more margin
        const bgX = Math.floor(this.x - bgWidth / 2);
        const bgY = Math.floor(this.y - 18);

        ctx.beginPath();
        const radius = 8;
        ctx.moveTo(bgX + radius, bgY);
        ctx.lineTo(bgX + bgWidth - radius, bgY);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
        ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
        ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
        ctx.lineTo(bgX + radius, bgY + bgHeight);
        ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
        ctx.lineTo(bgX, bgY + radius);
        ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
        ctx.fill();

        // Subtle border
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Question text
        ctx.fillStyle = COLORS.white;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.question, Math.floor(this.x), Math.floor(this.y - 3));

        // Buttons
        this.yesButton.render(ctx);
        if (!this.noButtonHidden) {
            this.noButton.render(ctx);
        }
    }
}
