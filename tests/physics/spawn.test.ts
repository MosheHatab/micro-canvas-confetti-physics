import { describe, expect, it } from "vitest";

import { DEFAULT_PHYSICS } from "../../src/constants";
import {
	cullDeadParticles,
	integrateParticle,
	integrateParticles,
	isParticleDead,
	spawnParticles,
} from "../../src/physics/spawn";
import type { Particle } from "../../src/types";
import { parseConfettiOptions } from "../../src/utils/validation";

const NO_TRAILS = false;
const TRAIL_LEN = 6;

function baseParticle(overrides: Partial<Particle> = {}): Particle {
	return {
		x: 100,
		y: 100,
		vx: 0,
		vy: 0,
		width: 8,
		height: 6,
		color: "#fff",
		shape: "rect",
		rotation: 0,
		rotationSpeed: 0,
		wobblePhase: 0,
		wobbleSpeed: 1,
		opacity: 1,
		ticks: 100,
		ticksMax: 100,
		trailX: [],
		trailY: [],
		spawnX: 100,
		spawnY: 100,
		burstRadius: 0,
		...overrides,
	};
}

describe("spawnParticles", () => {
	it("spawns the requested count", () => {
		const options = parseConfettiOptions({ particleCount: 25 });
		const particles = spawnParticles(options);
		expect(particles).toHaveLength(25);
	});

	it("places particles at origin", () => {
		const options = parseConfettiOptions({
			particleCount: 5,
			origin: { x: 200, y: 300 },
		});
		const particles = spawnParticles(options);
		for (const p of particles) {
			expect(p.x).toBe(200);
			expect(p.y).toBe(300);
			expect(p.spawnX).toBe(200);
			expect(p.spawnY).toBe(300);
		}
	});

	it("applies scalar to size", () => {
		const options = parseConfettiOptions({ particleCount: 20, scalar: 0.5 });
		const particles = spawnParticles(options);
		for (const p of particles) {
			expect(p.width).toBeLessThanOrEqual(6);
		}
	});

	it("spawns with varied reach limits when burst radius is set", () => {
		const options = parseConfettiOptions({ particleCount: 12, burstRadius: 120 });
		const particles = spawnParticles(options);
		const limits = particles.map((p) => p.burstRadius);
		expect(limits.every((limit) => limit >= 120 * 0.82 && limit <= 120)).toBe(true);
		expect(new Set(limits.map((l) => Math.round(l))).size).toBeGreaterThan(1);
	});
});

describe("integrateParticle", () => {
	it("applies gravity to vy", () => {
		const particle = baseParticle();
		integrateParticle(particle, 1 / 60, DEFAULT_PHYSICS, NO_TRAILS, TRAIL_LEN);
		expect(particle.vy).toBeGreaterThan(0);
		expect(particle.y).toBeGreaterThan(100);
	});

	it("removes pieces that cross their reach limit", () => {
		const particle = baseParticle({
			burstRadius: 50,
			spawnX: 100,
			spawnY: 100,
			x: 160,
			y: 100,
		});
		expect(isParticleDead(particle, { width: 800, height: 600 }, 300)).toBe(true);
	});

	it("keeps slow pieces inside reach while they fall", () => {
		const particle = baseParticle({
			burstRadius: 50,
			spawnX: 100,
			spawnY: 100,
			x: 100,
			y: 100,
			vx: 10,
			vy: -5,
		});
		for (let i = 0; i < 20; i++) {
			integrateParticle(particle, 1 / 60, DEFAULT_PHYSICS, NO_TRAILS, TRAIL_LEN);
		}
		const dx = particle.x - particle.spawnX;
		const dy = particle.y - particle.spawnY;
		expect(dx * dx + dy * dy).toBeLessThan(50 * 50);
		expect(isParticleDead(particle, { width: 800, height: 600 }, 300)).toBe(false);
	});
});

describe("integrateParticles", () => {
	it("updates all particles", () => {
		const options = parseConfettiOptions({ particleCount: 5, angle: 270, spread: 0 });
		const particles = spawnParticles(options);
		const initialPositions = particles.map((p) => ({ x: p.x, y: p.y }));
		integrateParticles(particles, 1 / 60, DEFAULT_PHYSICS, NO_TRAILS, TRAIL_LEN);
		for (let i = 0; i < particles.length; i++) {
			const p = particles[i] as Particle;
			const initial = initialPositions[i] as { x: number; y: number };
			const moved = p.x !== initial.x || p.y !== initial.y;
			expect(moved).toBe(true);
		}
	});
});

describe("duration short", () => {
	it("sets finite ticks for short duration", () => {
		const options = parseConfettiOptions({ duration: "short" });
		expect(options.ticks).toBeGreaterThan(0);
		expect(options.ticks).toBeLessThan(100);
	});
});

describe("isParticleDead", () => {
	const viewport = { width: 800, height: 600 };

	it("returns true when below viewport", () => {
		const particle = baseParticle({ y: 700, vy: 10 });
		expect(isParticleDead(particle, viewport, 300)).toBe(true);
	});

	it("returns true when ticks exhausted", () => {
		const particle = baseParticle({ ticks: 0 });
		expect(isParticleDead(particle, viewport, 300)).toBe(true);
	});
});

describe("cullDeadParticles", () => {
	it("removes off-screen particles", () => {
		const options = parseConfettiOptions({ particleCount: 3 });
		const particles = spawnParticles(options);
		(particles[0] as Particle).y = 1000;
		cullDeadParticles(particles, { width: 800, height: 600 }, 300);
		expect(particles.length).toBe(2);
	});
});

describe("presets", () => {
	it("celebration has more particles than subtle", () => {
		const celebration = parseConfettiOptions({ preset: "celebration" });
		const subtle = parseConfettiOptions({ preset: "subtle" });
		expect(celebration.particleCount).toBeGreaterThan(subtle.particleCount * 3);
	});

	it("spark is smallest quick burst", () => {
		const spark = parseConfettiOptions({ preset: "spark" });
		expect(spark.particleCount).toBeLessThanOrEqual(10);
		expect(spark.ticks).toBeGreaterThan(0);
	});
});
