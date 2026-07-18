import { canRunAnimation, CanvasManager } from "./dom/canvas-manager";
import { spawnParticles } from "./physics/spawn";
import { FrameLoop } from "./render/frame-loop";
import { createSequenceRunner } from "./sequence";
import { captureCanvasSnapshot } from "./snapshot";
import type {
	ConfettiFn,
	ConfettiHandle,
	ConfettiOptions,
	ConfettiSequenceFn,
	ConfettiSequenceStep,
	ResolvedConfettiOptions,
	Viewport,
} from "./types";
import { parseConfettiOptions } from "./utils/validation";

export { PRESET_LABELS, PRESET_OPTIONS } from "./constants";
export { downloadSnapshot } from "./snapshot";
export type {
	ConfettiDuration,
	ConfettiFn,
	ConfettiHandle,
	ConfettiOptions,
	ConfettiOrigin,
	ConfettiPreset,
	ConfettiSequenceHandle,
	ConfettiSequenceStep,
	CreateParticleFn,
	Particle,
	ParticleShape,
	PhysicsConfig,
	ResolvedConfettiOptions,
} from "./types";

interface Engine {
	canvasManager: CanvasManager;
	frameLoop: FrameLoop;
	options: ResolvedConfettiOptions;
	promiseResolvers: Array<() => void>;
}

let engine: Engine | null = null;

/** Returns the browser viewport size in CSS pixels. */
function getViewport(): Viewport {
	if (typeof window === "undefined") {
		return { width: 0, height: 0 };
	}
	return { width: window.innerWidth, height: window.innerHeight };
}

/** Creates the shared canvas and animation engine on first use. */
function ensureEngine(options: ResolvedConfettiOptions): Engine {
	if (engine !== null) {
		return engine;
	}

	const canvasManager = new CanvasManager({ zIndex: options.zIndex });
	const frameLoop = new FrameLoop({
		onEmpty: () => {
			canvasManager.scheduleUnmount();
			if (engine !== null) {
				for (const resolve of engine.promiseResolvers) {
					resolve();
				}
				engine.promiseResolvers = [];
			}
		},
	});

	engine = { canvasManager, frameLoop, options, promiseResolvers: [] };
	return engine;
}

/** Spawns a confetti burst and starts or extends the render loop. */
function launchBurst(options?: ConfettiOptions): ConfettiHandle {
	const resolved = parseConfettiOptions(options);

	if (!canRunAnimation(resolved.disableForReducedMotion)) {
		return { reset, isActive: () => false };
	}

	if (typeof document === "undefined") {
		return { reset, isActive: () => false };
	}

	const eng = ensureEngine(resolved);
	eng.options = resolved;
	eng.canvasManager.cancelUnmount();

	const { ctx } = eng.canvasManager.mount();
	const viewport = getViewport();
	const particles = spawnParticles(resolved);

	if (!eng.frameLoop.isActive()) {
		eng.frameLoop.start(
			{
				particles,
				options: resolved,
				viewport,
				lastTimestamp: 0,
				originY: resolved.origin.y,
			},
			ctx,
		);
	} else {
		eng.frameLoop.appendParticles(particles, resolved);
	}

	eng.canvasManager.resize();
	eng.frameLoop.updateViewport(viewport);

	return {
		reset,
		isActive: () => eng.frameLoop.isActive(),
	};
}

/** Triggers a burst and resolves when all pieces have finished. */
function launchPromise(options?: ConfettiOptions): Promise<void> {
	const resolved = parseConfettiOptions(options);

	if (!canRunAnimation(resolved.disableForReducedMotion)) {
		return Promise.resolve();
	}

	return new Promise<void>((resolve) => {
		const eng = ensureEngine(resolved);
		eng.promiseResolvers.push(resolve);
		launchBurst(options);
	});
}

/** Stops the animation, removes the canvas, and clears pending promises. */
export function reset(): void {
	if (engine === null) return;
	engine.frameLoop.stop();
	engine.canvasManager.destroy();
	for (const resolve of engine.promiseResolvers) {
		resolve();
	}
	engine = null;
}

const runSequence = createSequenceRunner(launchBurst);

/** Main confetti API — trigger bursts, await completion, or capture a snapshot. */
export const confetti: ConfettiFn = Object.assign(
	(options?: ConfettiOptions): ConfettiHandle => launchBurst(options),
	{
		promise: (options?: ConfettiOptions): Promise<void> => launchPromise(options),
		snapshot: (): string | null => captureCanvasSnapshot(),
	},
);

/** Fires a series of bursts on a timeline. Returns a handle to cancel or await. */
export const confettiSequence: ConfettiSequenceFn = (
	steps: readonly ConfettiSequenceStep[],
) => runSequence(steps);

/** Alias for {@link confettiSequence}. */
export { confettiSequence as sequence };

/** Returns how many confetti pieces are currently on screen. */
export function getActiveParticleCount(): number {
	if (engine === null) return 0;
	return engine.frameLoop.particleCount;
}

/** Returns how long the last render frame took, in milliseconds. */
export function getLastFrameMs(): number {
	if (engine === null) return 0;
	return engine.frameLoop.schedulerRef.lastFrameMs;
}

/** Returns the internal engine state. Intended for tests and debugging. */
export function getEngineState(): Engine | null {
	return engine;
}
