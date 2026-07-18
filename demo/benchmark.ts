import { DEFAULT_PHYSICS } from "micro-canvas-confetti-physics/physics";
import { cullDeadParticles, integrateParticles, spawnParticles } from "micro-canvas-confetti-physics/physics";
import { parseConfettiOptions } from "micro-canvas-confetti-physics/physics";

const tiers = [50, 100, 200, 500];
const frames = 300;
const viewport = { width: 1920, height: 1080 };
const originY = 540;

interface BenchResult {
	count: number;
	totalMs: number;
	avgMs: number;
	p95Ms: number;
}

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
		totalMs,
		avgMs: totalMs / frames,
		p95Ms: frameTimes[p95Index] ?? 0,
	};
}

const results = tiers.map(benchmark);
const container = document.getElementById("results");

if (container) {
	for (const r of results) {
		const bar = document.createElement("div");
		bar.className = "panel";
		const pct = Math.min(100, (r.p95Ms / 16) * 100);
		const color = r.p95Ms <= 16 ? "bg-emerald-500" : "bg-amber-500";
		bar.innerHTML = `
			<div class="flex justify-between text-sm mb-2">
				<span>${r.count} particles</span>
				<span>avg ${r.avgMs.toFixed(3)}ms · p95 ${r.p95Ms.toFixed(3)}ms</span>
			</div>
			<div class="h-3 rounded bg-slate-800 overflow-hidden">
				<div class="${color} h-full rounded" style="width: ${pct}%"></div>
			</div>
		`;
		container.appendChild(bar);
	}
}

console.table(results);
