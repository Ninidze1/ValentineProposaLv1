// PromptWidget.js - Compact YES/NO prompt with shrinking NO button
class PromptWidget {
    constructor(config) {
        this.question = config.question;
        this.onYes = config.onYes;
        this.onNo = config.onNo;

        this.visible = true;
        this.noButtonScale = 1;
        this.noButtonHidden = false;

        // Parse question lines (split by \n)
        this.questionLines = this.question.split('\n').map(line => line.trim());

        // Layout constants - compact UI spacing
        this.padding = 8;            // Padding inside the frame
        this.lineHeight = 11;        // Space between text lines
        this.textButtonGap = 6;      // Gap between text and buttons
        this.buttonWidth = 44;
        this.buttonHeight = 14;
        this.buttonGap = 16;         // Gap between YES and NO buttons

        // Calculate content dimensions
        const textHeight = this.questionLines.length * this.lineHeight;
        const contentHeight = textHeight + this.textButtonGap + this.buttonHeight;
        const frameHeight = contentHeight + (this.padding * 2);
        const frameWidth = 220;

        // Position frame at bottom center
        this.frameX = (INTERNAL_WIDTH - frameWidth) / 2;
        this.frameY = INTERNAL_HEIGHT - frameHeight - 8; // 8px from bottom
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        // Calculate text position (centered horizontally, top of content area)
        this.textX = INTERNAL_WIDTH / 2;
        this.textStartY = this.frameY + this.padding + 8; // +8 for text baseline

        // Calculate button positions (centered horizontally, below text)
        const buttonsY = this.frameY + this.padding + textHeight + this.textButtonGap;
        const totalButtonsWidth = (this.buttonWidth * 2) + this.buttonGap;
        const buttonsStartX = (INTERNAL_WIDTH - totalButtonsWidth) / 2;

        // Create buttons
        this.yesButton = new Button({
            x: buttonsStartX,
            y: buttonsY,
            width: this.buttonWidth,
            height: this.buttonHeight,
            text: "YES",
            color: COLORS.pink,
            onClick: () => this.handleYes()
        });

        this.noButton = new Button({
            x: buttonsStartX + this.buttonWidth + this.buttonGap,
            y: buttonsY,
            width: this.buttonWidth,
            height: this.buttonHeight,
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

        // Draw frame background with rounded corners
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        const radius = 8;
        const x = this.frameX;
        const y = this.frameY;
        const w = this.frameWidth;
        const h = this.frameHeight;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw question text (centered)
        ctx.fillStyle = COLORS.white;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';

        this.questionLines.forEach((line, i) => {
            ctx.fillText(line, this.textX, this.textStartY + (i * this.lineHeight));
        });

        // Draw buttons
        this.yesButton.render(ctx);
        if (!this.noButtonHidden) {
            this.noButton.render(ctx);
        }
    }
}
