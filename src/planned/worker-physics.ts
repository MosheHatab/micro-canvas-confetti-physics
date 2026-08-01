/**
 * Experimental v1+ Web Worker physics offload.
 *
 * Not exported from the published package entry. Import from source/tests only:
 * `import { createWorkerPhysicsEngine } from "../planned/worker-physics"`.
 *
 * Protocol: packed Float32Array, 8 floats per particle:
 * [x, y, vx, vy, rotation, rotationSpeed, wobblePhase, wobbleSpeed]
 */

export const WORKER_STRIDE = 8;

export interface WorkerPhysicsConfig {
	readonly gravity: number;
	readonly drag: number;
	readonly rotationDrag: number;
	readonly wobbleDrag: number;
}

export interface WorkerPhysicsEngine {
	readonly ready: Promise<void>;
	/** Integrates in the worker; resolves with the updated buffer (same reference when transferable). */
	integrate(
		particleBuffer: Float32Array,
		count: number,
		dt: number,
		config: WorkerPhysicsConfig,
	): Promise<Float32Array>;
	dispose(): void;
}

const WORKER_SOURCE = `
const STRIDE = 8;
self.onmessage = (event) => {
  const { buffer, count, dt, config } = event.data;
  const data = new Float32Array(buffer);
  const dragDecay = Math.exp(-config.drag * dt);
  const rotDecay = Math.exp(-config.rotationDrag * dt);
  const wobbleDecay = Math.exp(-config.wobbleDrag * dt);
  for (let i = 0; i < count; i++) {
    const o = i * STRIDE;
    let vx = data[o + 2];
    let vy = data[o + 3] + config.gravity * dt;
    vx *= dragDecay;
    vy *= dragDecay;
    data[o] += vx * dt;
    data[o + 1] += vy * dt;
    data[o + 2] = vx;
    data[o + 3] = vy;
    data[o + 4] += data[o + 5] * dt;
    data[o + 5] *= rotDecay;
    data[o + 6] += data[o + 7] * dt;
    data[o + 7] *= wobbleDecay;
  }
  self.postMessage({ buffer: data.buffer }, [data.buffer]);
};
`;

function createWorker(): Worker {
	if (typeof Worker === "undefined" || typeof Blob === "undefined") {
		throw new Error(
			"[micro-canvas-confetti] Worker physics requires Worker + Blob (browser / Node 20+ with worker support).",
		);
	}
	const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
	const url = URL.createObjectURL(blob);
	const worker = new Worker(url);
	URL.revokeObjectURL(url);
	return worker;
}

/** Creates a worker-backed physics integrator (experimental, not in public API). */
export function createWorkerPhysicsEngine(): WorkerPhysicsEngine {
	const worker = createWorker();
	let disposed = false;
	let pending: {
		resolve: (buffer: Float32Array) => void;
		reject: (error: Error) => void;
	} | null = null;

	worker.onmessage = (event: MessageEvent<{ buffer: ArrayBuffer }>): void => {
		if (pending === null) return;
		const { resolve } = pending;
		pending = null;
		resolve(new Float32Array(event.data.buffer));
	};

	worker.onerror = (event: ErrorEvent): void => {
		if (pending === null) return;
		const { reject } = pending;
		pending = null;
		reject(new Error(event.message || "Worker physics failed"));
	};

	return {
		ready: Promise.resolve(),
		integrate(particleBuffer, count, dt, config) {
			if (disposed) {
				return Promise.reject(new Error("WorkerPhysicsEngine disposed"));
			}
			if (pending !== null) {
				return Promise.reject(new Error("WorkerPhysicsEngine busy"));
			}
			return new Promise<Float32Array>((resolve, reject) => {
				pending = { resolve, reject };
				const copy = particleBuffer.slice();
				worker.postMessage(
					{
						buffer: copy.buffer,
						count,
						dt,
						config: {
							gravity: config.gravity,
							drag: config.drag,
							rotationDrag: config.rotationDrag,
							wobbleDrag: config.wobbleDrag,
						},
					},
					[copy.buffer],
				);
			});
		},
		dispose() {
			disposed = true;
			pending = null;
			worker.terminate();
		},
	};
}

/** Packs particle motion fields into a Float32Array (experimental helper). */
export function packParticleMotion(
	particles: ReadonlyArray<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		rotation: number;
		rotationSpeed: number;
		wobblePhase: number;
		wobbleSpeed: number;
	}>,
): Float32Array {
	const buffer = new Float32Array(particles.length * WORKER_STRIDE);
	for (let i = 0; i < particles.length; i++) {
		const p = particles[i]!;
		const o = i * WORKER_STRIDE;
		buffer[o] = p.x;
		buffer[o + 1] = p.y;
		buffer[o + 2] = p.vx;
		buffer[o + 3] = p.vy;
		buffer[o + 4] = p.rotation;
		buffer[o + 5] = p.rotationSpeed;
		buffer[o + 6] = p.wobblePhase;
		buffer[o + 7] = p.wobbleSpeed;
	}
	return buffer;
}

/** Writes packed motion fields back onto particle objects (experimental helper). */
export function unpackParticleMotion(
	buffer: Float32Array,
	particles: Array<{
		x: number;
		y: number;
		vx: number;
		vy: number;
		rotation: number;
		rotationSpeed: number;
		wobblePhase: number;
		wobbleSpeed: number;
	}>,
): void {
	const count = Math.min(particles.length, Math.floor(buffer.length / WORKER_STRIDE));
	for (let i = 0; i < count; i++) {
		const p = particles[i]!;
		const o = i * WORKER_STRIDE;
		p.x = buffer[o]!;
		p.y = buffer[o + 1]!;
		p.vx = buffer[o + 2]!;
		p.vy = buffer[o + 3]!;
		p.rotation = buffer[o + 4]!;
		p.rotationSpeed = buffer[o + 5]!;
		p.wobblePhase = buffer[o + 6]!;
		p.wobbleSpeed = buffer[o + 7]!;
	}
}
