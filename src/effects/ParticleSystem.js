/**
 * @fileoverview Base particle system classes
 * @module effects/ParticleSystem
 */

import { COLORS } from '../utils/constants.js';

/**
 * @typedef {Object} ParticleConfig
 * @property {number} [vx=0] - Velocity X
 * @property {number} [vy=0] - Velocity Y
 * @property {number} [life=1] - Lifetime in seconds
 * @property {number} [gravity=0] - Gravity acceleration
 * @property {number} [friction=1] - Velocity friction (1 = no friction)
 * @property {number} [scale=1] - Particle scale
 * @property {number} [rotation=0] - Initial rotation in radians
 * @property {number} [rotationSpeed=0] - Rotation speed in radians/second
 * @property {string} [color=COLORS.white] - Particle color
 */

/**
 * Base particle class with physics
 */
export class Particle {
    /** @type {number} */
    x;

    /** @type {number} */
    y;

    /** @type {number} */
    vx;

    /** @type {number} */
    vy;

    /** @type {number} */
    life;

    /** @type {number} */
    maxLife;

    /** @type {number} */
    gravity;

    /** @type {number} */
    friction;

    /** @type {number} */
    scale;

    /** @type {number} */
    rotation;

    /** @type {number} */
    rotationSpeed;

    /** @type {string} */
    color;

    /** @type {boolean} */
    isDead = false;

    /**
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {ParticleConfig} [config={}] - Particle configuration
     */
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.vx = config.vx ?? 0;
        this.vy = config.vy ?? 0;
        this.life = config.life ?? 1;
        this.maxLife = this.life;
        this.gravity = config.gravity ?? 0;
        this.friction = config.friction ?? 1;
        this.scale = config.scale ?? 1;
        this.rotation = config.rotation ?? 0;
        this.rotationSpeed = config.rotationSpeed ?? 0;
        this.color = config.color ?? COLORS.white;
    }

    /**
     * Get current alpha based on remaining life
     * @returns {number} Alpha value (0-1)
     */
    get alpha() {
        return Math.max(0, this.life / this.maxLife);
    }

    /**
     * Update particle physics
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.rotation += this.rotationSpeed * dt;

        this.life -= dt;
        if (this.life <= 0) {
            this.isDead = true;
        }
    }

    /**
     * Render the particle
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @abstract
     */
    render(ctx) {
        // Override in subclasses
    }
}

/**
 * @typedef {Object} EmitterConfig
 * @property {boolean} [oneShot=false] - Whether emitter stops after particles die
 */

/**
 * Particle emitter for managing groups of particles
 */
export class ParticleEmitter {
    /** @type {Particle[]} */
    particles = [];

    /** @type {EmitterConfig} */
    config;

    /** @type {boolean} */
    isDead = false;

    /** @type {boolean} */
    oneShot;

    /**
     * @param {EmitterConfig} [config={}] - Emitter configuration
     */
    constructor(config = {}) {
        this.config = config;
        this.oneShot = config.oneShot ?? false;
    }

    /**
     * Emit particles at a position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} [count=1] - Number of particles to emit
     */
    emit(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle(x, y);
            this.particles.push(particle);
        }
    }

    /**
     * Create a new particle (override in subclasses)
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Particle}
     */
    createParticle(x, y) {
        return new Particle(x, y, this.config);
    }

    /**
     * Update all particles
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.particles.forEach(p => p.update(dt));
        this.particles = this.particles.filter(p => !p.isDead);

        if (this.particles.length === 0 && this.oneShot) {
            this.isDead = true;
        }
    }

    /**
     * Render all particles
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }

    /**
     * Get particle count
     * @returns {number}
     */
    get count() {
        return this.particles.length;
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
}
