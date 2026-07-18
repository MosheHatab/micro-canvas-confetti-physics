let rafId = 0;

export function initFpsHud(
	getParticleCount: () => number,
	getFrameMs: () => number,
): void {
	const hud = document.getElementById("fps-hud");
	if (!hud) return;

	const samples: number[] = [];

	const update = (): void => {
		const frameMs = getFrameMs();
		const particles = getParticleCount();

		if (frameMs > 0) {
			samples.push(frameMs);
			if (samples.length > 30) samples.shift();
		}

		const avg = samples.length > 0 ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
		const status = avg > 0 && avg <= 16 ? "ok" : avg > 16 ? "jank" : "";

		hud.className = `fps-hud ${status}`.trim();
		hud.textContent =
			avg > 0
				? `${avg.toFixed(1)}ms · ${particles} particles · ${avg <= 16 ? "60fps OK" : "jank"}`
				: `${particles} particles · idle`;

		rafId = requestAnimationFrame(update);
	};

	rafId = requestAnimationFrame(update);
}

export function destroyFpsHud(): void {
	cancelAnimationFrame(rafId);
}
