// PromptWidget.js - Compact YES/NO prompt with shrinking NO button
class PromptWidget {
    constructor(config) {
        this.question = config.question;
        this.onYes = config.onYes;
        this.onNo = config.onNo;

        this.visible = true;
        this.noButtonHidden = false;

        // Parse question lines (split by \n)
        this.questionLines = this.question.split('\n').map(line => line.trim());

        // Layout constants - compact UI spacing
        this.padding = 8;
        this.lineHeight = 11;
        this.textButtonGap = 6;
        this.buttonGap = 16;

        // Initial button dimensions
        this.initialButtonWidth = 44;
        this.initialButtonHeight = 14;

        // Calculate content dimensions
        const textHeight = this.questionLines.length * this.lineHeight;
        const contentHeight = textHeight + this.textButtonGap + this.initialButtonHeight;
        const frameHeight = contentHeight + (this.padding * 2);
        const frameWidth = 220;

        // Position frame at bottom center
        this.frameX = (INTERNAL_WIDTH - frameWidth) / 2;
        this.frameY = INTERNAL_HEIGHT - frameHeight - 8;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        // Calculate text position
        this.textX = INTERNAL_WIDTH / 2;
        this.textStartY = this.frameY + this.padding + 8;

        // Button area (where buttons live)
        this.buttonsY = this.frameY + this.padding + textHeight + this.textButtonGap;
        this.buttonAreaWidth = this.frameWidth - 16; // 16px total padding (8 each side)
        this.buttonAreaX = this.frameX + 8;

        // Animation state
        this.shrinkProgress = 0; // 0 = normal, 1 = NO fully hidden, YES fully expanded
        this.targetShrinkProgress = 0;
        this.animationSpeed = 3; // How fast the animation happens

        // Store initial positions for lerping
        this.initialYesX = this.buttonAreaX + (this.buttonAreaWidth / 2) - this.initialButtonWidth - (this.buttonGap / 2);
        this.initialNoX = this.buttonAreaX + (this.buttonAreaWidth / 2) + (this.buttonGap / 2);

        // Final YES button state (fills button area with padding)
        this.finalYesX = this.buttonAreaX;
        this.finalYesWidth = this.buttonAreaWidth;

        // Create buttons with initial state
        this.yesButton = {
            x: this.initialYesX,
            y: this.buttonsY,
            width: this.initialButtonWidth,
            height: this.initialButtonHeight,
            text: "YES",
            color: COLORS.pink,
            textColor: COLORS.white,
            visible: true
        };

        this.noButton = {
            x: this.initialNoX,
            y: this.buttonsY,
            width: this.initialButtonWidth,
            height: this.initialButtonHeight,
            text: "NO",
            color: COLORS.gray,
            textColor: COLORS.white,
            visible: true,
            scale: 1
        };
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

    shrinkNoButton() {
        // Increment target progress (each click shrinks more)
        this.targetShrinkProgress = Math.min(this.targetShrinkProgress + 0.25, 1);

        if (this.targetShrinkProgress >= 1) {
            this.noButtonHidden = true;
        }
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    containsPoint(px, py) {
        if (!this.visible) return false;

        // Check YES button
        if (px >= this.yesButton.x && px <= this.yesButton.x + this.yesButton.width &&
            py >= this.yesButton.y && py <= this.yesButton.y + this.yesButton.height) {
            return 'yes';
        }

        // Check NO button (if visible and has size)
        if (!this.noButtonHidden && this.noButton.scale > 0.1) {
            const noScale = this.noButton.scale;
            const noCenterX = this.noButton.x + this.initialButtonWidth / 2;
            const noCenterY = this.noButton.y + this.initialButtonHeight / 2;
            const noHalfW = (this.initialButtonWidth * noScale) / 2;
            const noHalfH = (this.initialButtonHeight * noScale) / 2;

            if (px >= noCenterX - noHalfW && px <= noCenterX + noHalfW &&
                py >= noCenterY - noHalfH && py <= noCenterY + noHalfH) {
                return 'no';
            }
        }

        return false;
    }

    handleClick(x, y) {
        const hit = this.containsPoint(x, y);
        if (hit === 'yes') {
            this.handleYes();
            return true;
        } else if (hit === 'no') {
            this.shrinkNoButton();
            this.handleNo();
            return true;
        }
        return false;
    }

    update(dt) {
        if (!this.visible) return;

        // Animate shrink progress toward target
        if (this.shrinkProgress < this.targetShrinkProgress) {
            this.shrinkProgress = Math.min(
                this.shrinkProgress + dt * this.animationSpeed,
                this.targetShrinkProgress
            );
        }

        // Update NO button scale (shrinks as progress increases)
        this.noButton.scale = 1 - this.shrinkProgress;

        // Update YES button position and size (expands and centers as progress increases)
        const p = this.shrinkProgress;

        // Ease the progress for smoother animation
        const easedP = p * p * (3 - 2 * p); // smoothstep

        // Lerp YES button x position (moves left toward center)
        this.yesButton.x = this.initialYesX + (this.finalYesX - this.initialYesX) * easedP;

        // Lerp YES button width (expands to fill area)
        this.yesButton.width = this.initialButtonWidth + (this.finalYesWidth - this.initialButtonWidth) * easedP;

        // Move NO button to the right as it shrinks (stays at edge of YES button)
        const yesRightEdge = this.yesButton.x + this.yesButton.width;
        this.noButton.x = yesRightEdge + this.buttonGap * (1 - easedP);
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

        // Draw YES button
        this.renderButton(ctx, this.yesButton, 1);

        // Draw NO button (if not fully hidden)
        if (!this.noButtonHidden && this.noButton.scale > 0.05) {
            this.renderButton(ctx, this.noButton, this.noButton.scale);
        }
    }

    renderButton(ctx, btn, scale) {
        if (scale <= 0) return;

        ctx.save();

        const cx = Math.floor(btn.x + btn.width / 2);
        const cy = Math.floor(btn.y + btn.height / 2);

        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        // Button background
        ctx.fillStyle = btn.color;
        ctx.fillRect(
            Math.floor(-btn.width / 2),
            Math.floor(-btn.height / 2),
            btn.width,
            btn.height
        );

        // Button border
        ctx.strokeStyle = btn.textColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(
            Math.floor(-btn.width / 2),
            Math.floor(-btn.height / 2),
            btn.width,
            btn.height
        );

        // Button text
        ctx.fillStyle = btn.textColor;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, 0, 1);

        ctx.restore();
    }
}
