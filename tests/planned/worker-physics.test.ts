import { afterEach, describe, expect, it } from "vitest";

import {
	createWorkerPhysicsEngine,
	packParticleMotion,
	unpackParticleMotion,
	WORKER_STRIDE,
	type WorkerPhysicsEngine,
} from "../../src/planned/worker-physics";

describe("worker physics (experimental)", () => {
	let engine: WorkerPhysicsEngine | null = null;

	afterEach(() => {
		engine?.dispose();
		engine = null;
	});

	it("packs and unpacks motion fields", () => {
		const particles = [
			{
				x: 10,
				y: 20,
				vx: 1,
				vy: 2,
				rotation: 0.5,
				rotationSpeed: 0.1,
				wobblePhase: 1,
				wobbleSpeed: 2,
			},
		];
		const buffer = packParticleMotion(particles);
		expect(buffer).toHaveLength(WORKER_STRIDE);
		const out = [
			{
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				rotation: 0,
				rotationSpeed: 0,
				wobblePhase: 0,
				wobbleSpeed: 0,
			},
		];
		unpackParticleMotion(buffer, out);
		expect(out[0]?.x).toBe(10);
		expect(out[0]?.vy).toBe(2);
	});

	it("integrates gravity in a worker when Worker is available", async () => {
		if (typeof Worker === "undefined" || typeof Blob === "undefined") {
			return;
		}
		engine = createWorkerPhysicsEngine();
		await engine.ready;
		const particles = [
			{
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				rotation: 0,
				rotationSpeed: 0,
				wobblePhase: 0,
				wobbleSpeed: 0,
			},
		];
		const packed = packParticleMotion(particles);
		const next = await engine.integrate(packed, 1, 1 / 60, {
			gravity: 1.2,
			drag: 0.08,
			rotationDrag: 0.12,
			wobbleDrag: 0.1,
		});
		unpackParticleMotion(next, particles);
		expect(particles[0]?.vy).toBeGreaterThan(0);
		expect(particles[0]?.y).toBeGreaterThan(0);
	});
});
