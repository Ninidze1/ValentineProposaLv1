/**
 * @fileoverview Application entry point
 * @module main
 */

import { Game } from './Game.js';

/**
 * Initialize and start the game when DOM is ready
 */
async function main() {
    const game = new Game();

    try {
        await game.init();
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
