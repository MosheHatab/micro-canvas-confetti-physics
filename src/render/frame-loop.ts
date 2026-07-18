import { cullDeadParticles, integrateParticles } from "../physics/spawn";
import type { Particle, PhysicsConfig, ResolvedConfettiOptions, Viewport } from "../types";
import { computeDeltaSeconds } from "../utils/clamp";
import { drawParticles, drawParticlesHeatmap } from "./particle-renderer";
import { RenderScheduler } from "./scheduler";

/** Mutable simulation and render state for one active burst session. */
export interface EngineState {
	particles: Particle[];
	options: ResolvedConfettiOptions;
	viewport: Viewport;
	lastTimestamp: number;
	originY: number;
}

/** Callbacks fired when the loop finishes a frame or runs out of pieces. */
export interface FrameLoopCallbacks {
	readonly onEmpty: () => void;
	readonly onFrame?: (state: EngineState, frameMs: number) => void;
}

/** Runs integrate, cull, and draw on each animation frame. */
export class FrameLoop {
	private readonly scheduler: RenderScheduler;
	private state: EngineState | null = null;
	private readonly callbacks: FrameLoopCallbacks;
	private ctx: CanvasRenderingContext2D | null = null;

	public constructor(callbacks: FrameLoopCallbacks) {
		this.callbacks = callbacks;
		this.scheduler = new RenderScheduler((timestamp) => this.renderFrame(timestamp));
	}

	/** Exposes the underlying scheduler for timing metrics. */
	public get schedulerRef(): RenderScheduler {
		return this.scheduler;
	}

	/** Number of pieces currently in the simulation. */
	public get particleCount(): number {
		return this.state?.particles.length ?? 0;
	}

	/** Starts the loop with initial state and a canvas context. */
	public start(state: EngineState, ctx: CanvasRenderingContext2D): void {
		this.state = state;
		this.ctx = ctx;
		this.scheduler.start();
	}

	/** Adds more pieces to an already running burst. */
	public appendParticles(particles: Particle[], options: ResolvedConfettiOptions): void {
		if (this.state === null) return;
		this.state.particles.push(...particles);
		this.state.options = options;
		this.scheduler.markDirty();
	}

	/** Stops the loop and clears state. */
	public stop(): void {
		this.scheduler.stop();
		this.state = null;
		this.ctx = null;
	}

	/** Returns true while pieces are still being simulated. */
	public isActive(): boolean {
		return this.state !== null && this.state.particles.length > 0;
	}

	private renderFrame(timestamp: number): void {
		const state = this.state;
		const ctx = this.ctx;
		if (state === null || ctx === null) return;

		const dt = computeDeltaSeconds(state.lastTimestamp, timestamp);
		state.lastTimestamp = timestamp;

		const config: PhysicsConfig = state.options.physics;
		integrateParticles(
			state.particles,
			dt,
			config,
			state.options.trails,
			state.options.trailLength,
		);
		cullDeadParticles(state.particles, state.viewport, state.originY);

		ctx.clearRect(0, 0, state.viewport.width, state.viewport.height);
		if (state.options.debugVelocityHeatmap) {
			drawParticlesHeatmap(ctx, state.particles, config);
		} else {
			drawParticles(ctx, state.particles, config, state.options.trails);
		}

		const frameMs = this.scheduler.lastFrameMs;
		this.callbacks.onFrame?.(state, frameMs);

		if (state.particles.length === 0) {
			this.scheduler.stop();
			this.callbacks.onEmpty();
		} else {
			this.scheduler.markDirty();
		}
	}

	/** Updates viewport dimensions after a window resize. */
	public updateViewport(viewport: Viewport): void {
		if (this.state !== null) {
			this.state.viewport = viewport;
		}
	}
}
