// Game.js - Main game class
class Game {
    constructor() {
        this.canvas = null;
        this.assets = null;
        this.input = null;
        this.stateMachine = null;
        this.lastTime = 0;
        this.running = false;

        // Character frame sizes (will be set after loading)
        this.gioFrameWidth = 80;
        this.gioFrameHeight = 100;
        this.tamoFrameWidth = 80;
        this.tamoFrameHeight = 100;
    }

    async init() {
        this.canvas = new Canvas('#game-container');
        this.assets = new AssetLoader();
        this.renderLoading(0);

        // Load actual sprite images
        await this.generateSpriteSheets();

        this.input = new InputManager(this.canvas);
        this.input.onClick = (x, y) => {
            this.stateMachine.handleClick(x, y);
        };

        this.stateMachine = new StateMachine(this);
        this.stateMachine.addState('sceneA', new SceneA_BeachClub(this));
        this.stateMachine.addState('sceneB', new SceneB_StoneBeach(this));
        this.stateMachine.addState('sceneC', new SceneC_EndScreen(this));
        this.stateMachine.addState('transition', new TransitionFade(this));

        this.stateMachine.setState('sceneA');

        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    async generateSpriteSheets() {
        // Load the actual images from assets folder
        const gioImg = await this.loadImageAsync('assets/sprites/gio.png');
        const tamoImg = await this.loadImageAsync('assets/sprites/tamo.png');

        this.gioFrameWidth = gioImg.width;
        this.gioFrameHeight = gioImg.height;
        this.tamoFrameWidth = tamoImg.width;
        this.tamoFrameHeight = tamoImg.height;

        this.assets.images.set('gio-original', gioImg);
        this.assets.images.set('tamo-original', tamoImg);

        const gioSheet = this.createAnimationSheet(gioImg);
        this.assets.images.set('gio', gioSheet);

        const tamoSheet = this.createAnimationSheet(tamoImg);
        this.assets.images.set('tamo', tamoSheet);

        // Load naked sprites (for undressing before swim)
        try {
            const gioNakedImg = await this.loadImageAsync('assets/sprites/gio-naked.png');
            this.gioNakedFrameWidth = gioNakedImg.width;
            this.gioNakedFrameHeight = gioNakedImg.height;
            const gioNakedSheet = this.createAnimationSheet(gioNakedImg);
            this.assets.images.set('gio-naked', gioNakedSheet);
        } catch (e) {
            console.warn('Gio naked sprite not found');
        }

        try {
            const tamoNakedImg = await this.loadImageAsync('assets/sprites/tamo-naked.png');
            this.tamoNakedFrameWidth = tamoNakedImg.width;
            this.tamoNakedFrameHeight = tamoNakedImg.height;
            const tamoNakedSheet = this.createAnimationSheet(tamoNakedImg);
            this.assets.images.set('tamo-naked', tamoNakedSheet);
        } catch (e) {
            console.warn('Tamo naked sprite not found');
        }

        // Load swim sprites (for swimming in water)
        try {
            const gioSwimImg = await this.loadImageAsync('assets/sprites/gio-swim.png');
            this.gioSwimFrameWidth = gioSwimImg.width;
            this.gioSwimFrameHeight = gioSwimImg.height;
            const gioSwimSheet = this.createAnimationSheet(gioSwimImg);
            this.assets.images.set('gio-swim', gioSwimSheet);
        } catch (e) {
            console.warn('Gio swim sprite not found');
        }

        try {
            const tamoSwimImg = await this.loadImageAsync('assets/sprites/tamo-swim.png');
            this.tamoSwimFrameWidth = tamoSwimImg.width;
            this.tamoSwimFrameHeight = tamoSwimImg.height;
            const tamoSwimSheet = this.createAnimationSheet(tamoSwimImg);
            this.assets.images.set('tamo-swim', tamoSwimSheet);
        } catch (e) {
            console.warn('Tamo swim sprite not found');
        }

        // Load background images for scenes
        try {
            const bgA = await this.loadImageAsync('assets/backgrounds/background-a.png');
            this.assets.images.set('background-a', bgA);
        } catch (e) {
            console.warn('Background-a not found, using procedural background');
        }

        try {
            const bgB = await this.loadImageAsync('assets/backgrounds/background-b.png');
            this.assets.images.set('background-b', bgB);
        } catch (e) {
            console.warn('Background-b not found, using procedural background');
        }

        this.assets.loaded = true;
    }

    loadImageAsync(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`Failed to load: ${src}`);
                reject(new Error(`Failed to load: ${src}`));
            };
            img.src = src;
        });
    }

    createAnimationSheet(sourceImg) {
        const frameWidth = sourceImg.width;
        const frameHeight = sourceImg.height;
        const numFrames = 4;

        const sheetCanvas = document.createElement('canvas');
        sheetCanvas.width = frameWidth * numFrames;
        sheetCanvas.height = frameHeight;
        const ctx = sheetCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Frame 0: Original
        ctx.drawImage(sourceImg, 0, 0);

        // Frame 1: Bob down
        ctx.drawImage(sourceImg, frameWidth, 3);

        // Frame 2: Original
        ctx.drawImage(sourceImg, frameWidth * 2, 0);

        // Frame 3: Bob up
        ctx.drawImage(sourceImg, frameWidth * 3, -2);

        return sheetCanvas;
    }

    renderLoading(progress) {
        const ctx = this.canvas.ctx;
        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

        const centerY = INTERNAL_HEIGHT / 2;

        ctx.fillStyle = '#333';
        ctx.fillRect(INTERNAL_WIDTH/2 - 100, centerY, 200, 10);

        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(INTERNAL_WIDTH/2 - 100, centerY, 200 * progress, 10);

        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', INTERNAL_WIDTH / 2, centerY - 10);
    }

    gameLoop(time) {
        if (!this.running) return;

        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        this.stateMachine.update(dt);

        this.canvas.clear('#000000');
        this.stateMachine.render(this.canvas.ctx);

        requestAnimationFrame((t) => this.gameLoop(t));
    }
}
