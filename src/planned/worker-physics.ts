/**
 * Planned v1+ API — Web Worker physics offload.
 * Not exported from the package. Calling throws until implemented.
 */
export interface WorkerPhysicsEngine {
	readonly ready: Promise<void>;
	integrate(particleBuffer: Float32Array, dt: number): void;
	dispose(): void;
}

/** Creates a worker-backed physics engine. Not yet implemented. */
export function createWorkerPhysicsEngine(): WorkerPhysicsEngine {
	throw new Error(
		"[micro-canvas-confetti] Worker physics is planned for v1+ and is not implemented yet. See ROADMAP.md.",
	);
}
