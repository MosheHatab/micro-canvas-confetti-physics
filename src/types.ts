/** Shape drawn for a single confetti piece. */
export type ParticleShape = "rect" | "circle";

/** Named burst style with tuned defaults. */
export type ConfettiPreset = "celebration" | "subtle" | "cannon" | "spark";

/** How long a burst stays visible before pieces fade out. */
export type ConfettiDuration = "short" | "normal" | "long";

/** Screen position where a burst starts, in CSS pixels. */
export interface ConfettiOrigin {
	readonly x: number;
	readonly y: number;
}

/** Context passed when customizing individual pieces at spawn time. */
export interface CreateParticleContext {
	readonly index: number;
	readonly total: number;
}

/** Hook to override properties on a piece as it is created. */
export type CreateParticleFn = (
	index: number,
	defaults: Readonly<Partial<Particle>>,
) => Partial<Particle>;

/** Options for triggering a confetti burst. */
export interface ConfettiOptions {
	readonly particleCount?: number;
	readonly origin?: ConfettiOrigin;
	readonly angle?: number;
	readonly spread?: number;
	readonly startVelocity?: number;
	readonly gravity?: number;
	readonly drag?: number;
	readonly decay?: number;
	readonly scalar?: number;
	readonly duration?: ConfettiDuration;
	readonly rotationSpeed?: number;
	readonly wobbleSpeed?: number;
	readonly colors?: readonly string[];
	readonly shapes?: readonly ParticleShape[];
	readonly ticks?: number;
	readonly trails?: boolean;
	readonly trailLength?: number;
	readonly debugVelocityHeatmap?: boolean;
	readonly disableForReducedMotion?: boolean;
	readonly zIndex?: number;
	readonly preset?: ConfettiPreset;
	/** Max distance in px from the burst origin. 0 = no limit. */
	readonly burstRadius?: number;
	readonly createParticle?: CreateParticleFn;
}

/** A single confetti piece and its motion state. */
export interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	width: number;
	height: number;
	color: string;
	shape: ParticleShape;
	rotation: number;
	rotationSpeed: number;
	wobblePhase: number;
	wobbleSpeed: number;
	opacity: number;
	ticks: number;
	ticksMax: number;
	trailX: readonly number[];
	trailY: readonly number[];
	/** Burst origin used for reach-radius containment. */
	spawnX: number;
	spawnY: number;
	/** Max distance from spawn point. 0 = no limit. */
	burstRadius: number;
}

/** Internal simulation parameters used during integration. */
export interface PhysicsConfig {
	readonly gravity: number;
	readonly drag: number;
	readonly rotationDrag: number;
	readonly wobbleDrag: number;
	readonly minFlatness: number;
	readonly skewFactor: number;
	readonly decay: number;
}

/** Viewport dimensions in CSS pixels. */
export interface Viewport {
	readonly width: number;
	readonly height: number;
}

/** Fully validated burst options ready for spawn and render. */
export interface ResolvedConfettiOptions {
	readonly particleCount: number;
	readonly origin: ConfettiOrigin;
	readonly angle: number;
	readonly spread: number;
	readonly startVelocity: number;
	readonly gravity: number;
	readonly drag: number;
	readonly decay: number;
	readonly scalar: number;
	readonly duration: ConfettiDuration;
	readonly rotationSpeed: number;
	readonly wobbleSpeed: number;
	readonly colors: readonly string[];
	readonly shapes: readonly ParticleShape[];
	readonly ticks: number;
	readonly trails: boolean;
	readonly trailLength: number;
	readonly debugVelocityHeatmap: boolean;
	readonly disableForReducedMotion: boolean;
	readonly zIndex: number;
	readonly burstRadius: number;
	readonly physics: PhysicsConfig;
	readonly createParticle?: CreateParticleFn;
}

/** Handle returned from a burst, with reset and status helpers. */
export interface ConfettiHandle {
	readonly reset: () => void;
	readonly isActive: () => boolean;
}

/** Callable confetti API with promise and snapshot helpers attached. */
export type ConfettiFn = {
	(options?: ConfettiOptions): ConfettiHandle;
	promise(options?: ConfettiOptions): Promise<void>;
	snapshot(): string | null;
};

/** One step in a timed sequence of bursts. */
export interface ConfettiSequenceStep {
	readonly delay: number;
	readonly options?: ConfettiOptions;
}

/** Handle for a running sequence — cancel early or await completion. */
export type ConfettiSequenceHandle = {
	readonly cancel: () => void;
	readonly promise: Promise<void>;
};

/** Runs bursts on a schedule. */
export type ConfettiSequenceFn = (
	steps: readonly ConfettiSequenceStep[],
) => ConfettiSequenceHandle;
