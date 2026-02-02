// main.js - Entry point
document.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();

    try {
        await game.init();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});
