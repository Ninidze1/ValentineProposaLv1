/**
 * @fileoverview Application entry point
 * @module main
 */

import { Game } from './Game.js';

/**
 * Initialize and start the game when DOM is ready
 */
function main() {
    // Hide the start overlay immediately
    const startOverlay = document.getElementById('start-overlay');
    if (startOverlay) {
        startOverlay.style.display = 'none';
    }

    // Initialize game
    const game = new Game();
    game.init().then(() => {
        console.log('Game initialized successfully');

        // Play music on first user interaction
        let musicStarted = false;
        const startMusic = () => {
            if (musicStarted) return;
            musicStarted = true;

            const bgMusic = new Audio('assets/music/scene-b.wav');
            bgMusic.loop = true;
            bgMusic.volume = 0.15;
            bgMusic.play().catch(err => console.log('Music blocked:', err));

            window.bgMusic = bgMusic;

            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
            document.removeEventListener('touchstart', startMusic);
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);
        document.addEventListener('touchstart', startMusic);
    }).catch((error) => {
        console.error('Failed to initialize game:', error);
    });
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

