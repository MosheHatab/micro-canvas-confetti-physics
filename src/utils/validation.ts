import {
	DEFAULT_ANGLE,
	DEFAULT_BURST_RADIUS,
	DEFAULT_COLORS,
	DEFAULT_DECAY,
	DEFAULT_GRAVITY,
	DEFAULT_PARTICLE_COUNT,
	DEFAULT_PHYSICS,
	DEFAULT_SHAPES,
	DEFAULT_SPREAD,
	DEFAULT_START_VELOCITY,
	DEFAULT_TRAIL_LENGTH,
	DEFAULT_Z_INDEX,
	DURATION_DRAG,
	DURATION_SCALAR,
	DURATION_TICKS,
	MAX_BURST_RADIUS,
	MAX_PARTICLE_COUNT,
	MIN_PARTICLE_COUNT,
	PRESET_OPTIONS,
} from "../constants";
import type {
	ConfettiDuration,
	ConfettiOptions,
	ConfettiOrigin,
	ParticleShape,
	ResolvedConfettiOptions,
} from "../types";
import { clamp, isFiniteNumber } from "./clamp";

const DEFAULT_DURATION_VALUE: ConfettiDuration = "normal";

/** Checks whether a string is a valid CSS color in the current environment. */
function isValidCssColor(color: string): boolean {
	if (color.length === 0) return false;
	const el = typeof document !== "undefined" ? document.createElement("div") : null;
	if (el === null) {
		return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) || color.startsWith("rgb");
	}
	el.style.color = "";
	el.style.color = color;
	return el.style.color !== "";
}

/** Resolves burst origin, defaulting to the viewport center. */
function resolveOrigin(origin: ConfettiOrigin | undefined): ConfettiOrigin {
	if (typeof window === "undefined") {
		return origin ?? { x: 0, y: 0 };
	}
	return origin ?? {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
}

/** Filters invalid colors and falls back to the default palette. */
function resolveColors(colors: readonly string[] | undefined): readonly string[] {
	if (!colors || colors.length === 0) return DEFAULT_COLORS;
	const valid = colors.filter((c) => typeof c === "string" && isValidCssColor(c));
	return valid.length > 0 ? valid : DEFAULT_COLORS;
}

/** Filters invalid shapes and falls back to rect and circle. */
function resolveShapes(shapes: readonly ParticleShape[] | undefined): readonly ParticleShape[] {
	if (!shapes || shapes.length === 0) return DEFAULT_SHAPES;
	const valid = shapes.filter((s) => s === "rect" || s === "circle");
	return valid.length > 0 ? valid : DEFAULT_SHAPES;
}

/** Normalizes duration to a supported preset value. */
function resolveDuration(value: unknown): ConfettiDuration {
	if (value === "short" || value === "normal" || value === "long") return value;
	return DEFAULT_DURATION_VALUE;
}

/** Resolves lifespan ticks from an explicit value or duration preset. */
function resolveTicks(explicitTicks: number, duration: ConfettiDuration): number {
	if (explicitTicks > 0) return explicitTicks;
	return DURATION_TICKS[duration];
}

/** Validates user options, merges presets, and returns a fully resolved config. */
export function parseConfettiOptions(options?: ConfettiOptions): ResolvedConfettiOptions {
	const preset = options?.preset ? PRESET_OPTIONS[options.preset] : {};
	const merged: ConfettiOptions = { ...preset, ...options };

	const duration = resolveDuration(merged.duration);
	const particleCount = isFiniteNumber(merged.particleCount)
		? clamp(Math.round(merged.particleCount), MIN_PARTICLE_COUNT, MAX_PARTICLE_COUNT)
		: DEFAULT_PARTICLE_COUNT;

	const angle = isFiniteNumber(merged.angle) ? merged.angle : DEFAULT_ANGLE;
	const spread = isFiniteNumber(merged.spread) ? clamp(merged.spread, 0, 360) : DEFAULT_SPREAD;
	const startVelocity = isFiniteNumber(merged.startVelocity)
		? clamp(merged.startVelocity, 0, 200)
		: DEFAULT_START_VELOCITY;
	const gravity = isFiniteNumber(merged.gravity) ? clamp(merged.gravity, 0, 5) : DEFAULT_GRAVITY;
	const drag = isFiniteNumber(merged.drag)
		? clamp(merged.drag, 0, 1)
		: DURATION_DRAG[duration];
	const decay = isFiniteNumber(merged.decay) ? clamp(merged.decay, 0, 1) : DEFAULT_DECAY;
	const scalar = isFiniteNumber(merged.scalar)
		? clamp(merged.scalar, 0.2, 3)
		: DURATION_SCALAR[duration];
	const rotationSpeed = isFiniteNumber(merged.rotationSpeed)
		? clamp(merged.rotationSpeed, 0, 10)
		: 1;
	const wobbleSpeed = isFiniteNumber(merged.wobbleSpeed) ? clamp(merged.wobbleSpeed, 0, 10) : 1;
	const explicitTicks = isFiniteNumber(merged.ticks) ? Math.max(0, Math.round(merged.ticks)) : 0;
	const ticks = resolveTicks(explicitTicks, duration);
	const zIndex = isFiniteNumber(merged.zIndex) ? Math.round(merged.zIndex) : DEFAULT_Z_INDEX;
	const trails = merged.trails === true;
	const debugVelocityHeatmap = merged.debugVelocityHeatmap === true;
	const trailLength = isFiniteNumber(merged.trailLength)
		? clamp(Math.round(merged.trailLength), 2, 16)
		: DEFAULT_TRAIL_LENGTH;
	const burstRadius = isFiniteNumber(merged.burstRadius)
		? clamp(merged.burstRadius, 0, MAX_BURST_RADIUS)
		: DEFAULT_BURST_RADIUS;

	return {
		particleCount,
		origin: resolveOrigin(merged.origin),
		angle,
		spread,
		startVelocity,
		gravity,
		drag,
		decay,
		scalar,
		duration,
		rotationSpeed,
		wobbleSpeed,
		colors: resolveColors(merged.colors),
		shapes: resolveShapes(merged.shapes),
		ticks,
		trails,
		trailLength,
		debugVelocityHeatmap,
		disableForReducedMotion: merged.disableForReducedMotion !== false,
		zIndex,
		burstRadius,
		physics: {
			...DEFAULT_PHYSICS,
			gravity,
			drag,
			decay,
		},
		createParticle: merged.createParticle,
	};
}
