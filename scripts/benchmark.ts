/**
 * Headless benchmark for one animation frame (integrate + cull).
 * Run with: npm run benchmark
 */
import { performance } from "node:perf_hooks";

import { DEFAULT_PHYSICS } from "../src/constants";
import { cullDeadParticles, integrateParticles, spawnParticles } from "../src/physics/spawn";
import { parseConfettiOptions } from "../src/utils/validation";

const tiers = [50, 100, 200, 500];
const frames = 300;
const viewport = { width: 1920, height: 1080 };
const originY = 540;

interface BenchResult {
	count: number;
	avgMs: number;
	p95Ms: number;
	particlesPerSec: number;
}

/** Measures average and p95 frame time for a fixed particle count. */
function benchmark(count: number): BenchResult {
	const options = parseConfettiOptions({ particleCount: count });
	const particles = spawnParticles(options);
	const frameTimes: number[] = [];

	for (let f = 0; f < frames; f++) {
		const start = performance.now();
		integrateParticles(particles, 1 / 60, DEFAULT_PHYSICS, false, 6);
		cullDeadParticles(particles, viewport, originY);
		frameTimes.push(performance.now() - start);
		if (particles.length === 0) {
			particles.push(...spawnParticles(options));
		}
	}

	frameTimes.sort((a, b) => a - b);
	const totalMs = frameTimes.reduce((a, b) => a + b, 0);
	const p95Index = Math.floor(frameTimes.length * 0.95);

	return {
		count,
		avgMs: totalMs / frames,
		p95Ms: frameTimes[p95Index] ?? 0,
		particlesPerSec: (count * frames) / (totalMs / 1000),
	};
}

const results = tiers.map(benchmark);
console.log(JSON.stringify({ frames, results }, null, 2));
