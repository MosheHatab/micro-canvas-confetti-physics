import { CULL_MARGIN, SETTLE_VELOCITY_THRESHOLD, SETTLE_Y_OFFSET } from "../constants";
import type { Particle, PhysicsConfig, ResolvedConfettiOptions, Viewport } from "../types";
import { degreesToRadians } from "../utils/clamp";
import { pickRandom, randomInRange } from "../utils/random";
import { applyDrag2D } from "./drag";

/** Builds one piece with randomized size, color, and initial velocity. */
function createBaseParticle(
	options: ResolvedConfettiOptions,
	theta: number,
	speed: number,
	reachLimit: number,
): Particle {
	const width = randomInRange(6, 12) * options.scalar;
	const height = randomInRange(4, 10) * options.scalar;
	const ticksMax = options.ticks > 0 ? options.ticks : 0;

	return {
		x: options.origin.x,
		y: options.origin.y,
		vx: Math.cos(theta) * speed,
		vy: Math.sin(theta) * speed,
		width,
		height,
		color: pickRandom(options.colors),
		shape: pickRandom(options.shapes),
		rotation: randomInRange(0, Math.PI * 2),
		rotationSpeed: randomInRange(-Math.PI, Math.PI) * options.rotationSpeed,
		wobblePhase: randomInRange(0, Math.PI * 2),
		wobbleSpeed: randomInRange(2, 6) * options.wobbleSpeed,
		opacity: 1,
		ticks: ticksMax > 0 ? ticksMax : Number.MAX_SAFE_INTEGER,
		ticksMax,
		trailX: [],
		trailY: [],
		spawnX: options.origin.x,
		spawnY: options.origin.y,
		burstRadius: reachLimit,
	};
}

/** Per-piece speed spread — slower pieces stay nearer the origin when reach is limited. */
function resolveSpawnSpeed(options: ResolvedConfettiOptions): number {
	const minFactor = options.burstRadius > 0 ? 0.15 : 0.55;
	return randomInRange(options.startVelocity * minFactor, options.startVelocity);
}

/** Slightly varies reach per piece so the boundary is not a perfect ring. */
function resolveReachLimit(options: ResolvedConfettiOptions): number {
	if (options.burstRadius <= 0) return 0;
	return options.burstRadius * randomInRange(0.82, 1);
}

/** Creates all pieces for a burst from resolved options. */
export function spawnParticles(options: ResolvedConfettiOptions): Particle[] {
	const particles: Particle[] = [];
	const baseAngleRad = degreesToRadians(options.angle);
	const spreadRad = degreesToRadians(Math.min(options.spread, 360));

	for (let i = 0; i < options.particleCount; i++) {
		const angleOffset =
			options.spread >= 360
				? randomInRange(0, Math.PI * 2)
				: randomInRange(-spreadRad / 2, spreadRad / 2);
		const theta = baseAngleRad + angleOffset;
		const speed = resolveSpawnSpeed(options);
		const reachLimit = resolveReachLimit(options);

		let particle = createBaseParticle(options, theta, speed, reachLimit);

		if (options.createParticle) {
			const overrides = options.createParticle(i, particle);
			particle = { ...particle, ...overrides, spawnX: particle.spawnX, spawnY: particle.spawnY, burstRadius: particle.burstRadius };
		}

		particles.push(particle);
	}

	return particles;
}

/** Appends the current position to a piece's motion trail. */
function pushTrail(particle: Particle, maxLength: number): void {
	const x = [...particle.trailX, particle.x];
	const y = [...particle.trailY, particle.y];
	if (x.length > maxLength) {
		x.shift();
		y.shift();
	}
	particle.trailX = x;
	particle.trailY = y;
}

/** Advances one piece by a single simulation step. */
export function integrateParticle(
	particle: Particle,
	dt: number,
	config: PhysicsConfig,
	trails: boolean,
	trailLength: number,
): void {
	if (trails) {
		pushTrail(particle, trailLength);
	}

	particle.vy += config.gravity * dt;

	const dragged = applyDrag2D(particle.vx, particle.vy, config.drag, dt);
	particle.vx = dragged.vx;
	particle.vy = dragged.vy;

	particle.x += particle.vx * dt;
	particle.y += particle.vy * dt;

	particle.rotation += particle.rotationSpeed * dt;
	particle.rotationSpeed *= Math.exp(-config.rotationDrag * dt);

	particle.wobblePhase += particle.wobbleSpeed * dt;
	particle.wobbleSpeed *= Math.exp(-config.wobbleDrag * dt);

	if (particle.ticksMax > 0) {
		const lifeRatio = Math.max(0, particle.ticks / particle.ticksMax);
		particle.opacity = lifeRatio * (1 - config.decay);
	} else if (config.decay > 0) {
		particle.opacity = Math.max(0, particle.opacity - config.decay * dt * 60);
	}

	particle.ticks -= 1;
}

/** Advances every piece in the array by one simulation step. */
export function integrateParticles(
	particles: Particle[],
	dt: number,
	config: PhysicsConfig,
	trails: boolean,
	trailLength: number,
): void {
	for (let i = 0; i < particles.length; i++) {
		integrateParticle(particles[i] as Particle, dt, config, trails, trailLength);
	}
}

/** Returns true when a piece should be removed from the simulation. */
export function isParticleDead(
	particle: Particle,
	viewport: Viewport,
	originY: number,
): boolean {
	if (particle.ticks <= 0) return true;
	if (particle.opacity <= 0) return true;
	if (particle.burstRadius > 0) {
		const dx = particle.x - particle.spawnX;
		const dy = particle.y - particle.spawnY;
		if (dx * dx + dy * dy > particle.burstRadius * particle.burstRadius) {
			return true;
		}
	}
	if (particle.y > viewport.height + CULL_MARGIN) return true;
	if (particle.x < -CULL_MARGIN || particle.x > viewport.width + CULL_MARGIN) return true;

	const speed = Math.abs(particle.vx) + Math.abs(particle.vy);
	if (speed < SETTLE_VELOCITY_THRESHOLD && particle.y > originY + SETTLE_Y_OFFSET) {
		return true;
	}

	return false;
}

/** Removes dead pieces from the array in place. */
export function cullDeadParticles(
	particles: Particle[],
	viewport: Viewport,
	originY: number,
): void {
	for (let i = particles.length - 1; i >= 0; i--) {
		if (isParticleDead(particles[i] as Particle, viewport, originY)) {
			const last = particles.length - 1;
			if (i !== last) {
				particles[i] = particles[last] as Particle;
			}
			particles.pop();
		}
	}
}
