/**
 * Physics-only subpath export.
 * Re-exports spawn, integration, drag, and validation without DOM or canvas code.
 */
export {
	DEFAULT_COLORS,
	DEFAULT_DRAG,
	DEFAULT_GRAVITY,
	DEFAULT_PHYSICS,
	MIN_FLATNESS,
	PRESET_OPTIONS,
} from "./constants";
export { applyDrag, applyDrag2D } from "./physics/drag";
export {
	cullDeadParticles,
	integrateParticle,
	integrateParticles,
	isParticleDead,
	spawnParticles,
} from "./physics/spawn";
export { computeSkewX, computeWobbleScale } from "./physics/wobble";
export type {
	Particle,
	ParticleShape,
	PhysicsConfig,
	ResolvedConfettiOptions,
	Viewport,
} from "./types";
export { clamp, computeDeltaSeconds, degreesToRadians } from "./utils/clamp";
export { parseConfettiOptions } from "./utils/validation";
