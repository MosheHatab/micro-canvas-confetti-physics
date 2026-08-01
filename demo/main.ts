import type {
	ConfettiDuration,
	ConfettiOptions,
	ConfettiPreset,
} from "micro-canvas-confetti-physics";
import {
	confetti,
	confettiSequence,
	downloadSnapshot,
	getActiveParticleCount,
	getLastFrameMs,
	PRESET_LABELS,
	PRESET_OPTIONS,
	reset,
} from "micro-canvas-confetti-physics";

import { initFpsHud } from "./fps-hud";
import { initFullscreen } from "./fullscreen";
import { initShortcuts } from "./shortcuts";
import { initUrlState, readStateFromUrl, writeStateToUrl } from "./url-state";

interface DemoControls {
	particleCount: number;
	gravity: number;
	spread: number;
	startVelocity: number;
	scalar: number;
	duration: ConfettiDuration;
	burstRadius: number;
	preset: ConfettiPreset | "";
	trails: boolean;
	heatmap: boolean;
	disableForReducedMotion: boolean;
}

let activePreset: ConfettiPreset | "" = "";
let stageHasBurst = false;

function getControls(): DemoControls {
	const particleEl = document.getElementById("particle-count") as HTMLInputElement;
	const gravityEl = document.getElementById("gravity") as HTMLInputElement;
	const spreadEl = document.getElementById("spread") as HTMLInputElement;
	const velocityEl = document.getElementById("velocity") as HTMLInputElement;
	const scalarEl = document.getElementById("scalar") as HTMLInputElement;
	const radiusEl = document.getElementById("burst-radius") as HTMLInputElement;
	const trailsEl = document.getElementById("trails") as HTMLInputElement;
	const heatmapEl = document.getElementById("heatmap") as HTMLInputElement;
	const reducedEl = document.getElementById("reduced-motion") as HTMLInputElement;
	const durationEl = document.querySelector(
		"#duration-pills .seg-pill.active",
	) as HTMLButtonElement | null;

	return {
		preset: activePreset,
		particleCount: Number(particleEl?.value ?? 80),
		gravity: Number(gravityEl?.value ?? 1.2),
		spread: Number(spreadEl?.value ?? 45),
		startVelocity: Number(velocityEl?.value ?? 45),
		scalar: Number(scalarEl?.value ?? 1),
		burstRadius: Number(radiusEl?.value ?? 0),
		duration: (durationEl?.dataset.duration ?? "normal") as ConfettiDuration,
		trails: trailsEl?.checked ?? false,
		heatmap: heatmapEl?.checked ?? false,
		disableForReducedMotion: reducedEl?.checked ?? true,
	};
}

function buildOptions(origin?: { x: number; y: number }): ConfettiOptions {
	const controls = getControls();

	return {
		...(controls.preset ? { preset: controls.preset } : {}),
		particleCount: controls.particleCount,
		gravity: controls.gravity,
		spread: controls.spread,
		startVelocity: controls.startVelocity,
		scalar: controls.scalar,
		duration: controls.duration,
		burstRadius: controls.burstRadius,
		trails: controls.trails,
		debugVelocityHeatmap: controls.heatmap,
		disableForReducedMotion: controls.disableForReducedMotion,
		...(origin ? { origin } : {}),
	};
}

function markStageBurst(): void {
	if (stageHasBurst) return;
	stageHasBurst = true;
	document.getElementById("demo-stage")?.classList.add("has-burst");
}

function burst(origin?: { x: number; y: number }): void {
	markStageBurst();
	if (origin) {
		showReachRing(origin.x, origin.y, getControls().burstRadius);
	}
	confetti(buildOptions(origin));
}

function showReachRing(clientX: number, clientY: number, radius: number): void {
	const stage = document.getElementById("demo-stage");
	if (!stage || radius <= 0) return;

	const rect = stage.getBoundingClientRect();
	const x = clientX - rect.left;
	const y = clientY - rect.top;

	const existing = stage.querySelector(".reach-ring");
	existing?.remove();

	const ring = document.createElement("div");
	ring.className = "reach-ring";
	ring.style.left = `${x}px`;
	ring.style.top = `${y}px`;
	ring.style.width = `${radius * 2}px`;
	ring.style.height = `${radius * 2}px`;
	stage.appendChild(ring);
	window.setTimeout(() => ring.remove(), 1200);
}

function applyPresetToControls(preset: ConfettiPreset): void {
	const opts = PRESET_OPTIONS[preset];
	const set = (id: string, value: string | number): void => {
		const el = document.getElementById(id) as HTMLInputElement | null;
		if (el) el.value = String(value);
	};

	if (opts.particleCount !== undefined) set("particle-count", opts.particleCount);
	if (opts.startVelocity !== undefined) set("velocity", opts.startVelocity);
	if (opts.spread !== undefined) set("spread", opts.spread);
	if (opts.gravity !== undefined) set("gravity", opts.gravity);
	if (opts.scalar !== undefined) set("scalar", opts.scalar);
	if (opts.burstRadius !== undefined) set("burst-radius", opts.burstRadius);
	else set("burst-radius", 0);

	if (opts.duration) {
		document.querySelectorAll("#duration-pills .seg-pill").forEach((pill) => {
			pill.classList.toggle(
				"active",
				(pill as HTMLButtonElement).dataset.duration === opts.duration,
			);
		});
	}

	syncRadiusPills();
	updateLabels();
}

function syncRadiusPills(): void {
	const radius = Number((document.getElementById("burst-radius") as HTMLInputElement)?.value ?? 0);
	document.querySelectorAll(".radius-pill").forEach((pill) => {
		const value = Number((pill as HTMLButtonElement).dataset.radius ?? 0);
		pill.classList.toggle("active", value === radius);
	});
}

function selectPreset(preset: ConfettiPreset, fire = true): void {
	activePreset = preset;
	document.querySelectorAll(".preset-card").forEach((card) => {
		card.classList.toggle("active", (card as HTMLElement).dataset.preset === preset);
	});
	applyPresetToControls(preset);
	if (fire) burst();
}

function renderPresetCards(): void {
	const grid = document.getElementById("preset-grid");
	if (!grid) return;

	for (const [key, meta] of Object.entries(PRESET_LABELS)) {
		const preset = key as ConfettiPreset;
		const card = document.createElement("button");
		card.type = "button";
		card.className = "preset-card";
		card.dataset.preset = preset;
		card.title = meta.description;

		const colors = PRESET_OPTIONS[preset].colors ?? [];
		const swatches = colors
			.slice(0, 5)
			.map((color) => `<span class="preset-swatch" style="background:${color}"></span>`)
			.join("");

		card.innerHTML = `<div class="preset-name">${meta.label}</div><div class="preset-swatches" aria-hidden="true">${swatches}</div>`;
		card.addEventListener("click", () => selectPreset(preset));
		grid.appendChild(card);
	}
}

function formatRadiusLabel(radius: number): string {
	return radius <= 0 ? "Off" : `${radius}px`;
}

function formatOptionLines(controls: DemoControls): string[] {
	const lines: string[] = [];
	if (controls.preset) lines.push(`  preset: '${controls.preset}',`);
	lines.push(`  particleCount: ${controls.particleCount},`);
	lines.push(`  duration: '${controls.duration}',`);
	lines.push(`  scalar: ${controls.scalar},`);
	lines.push(`  spread: ${controls.spread},`);
	lines.push(`  startVelocity: ${controls.startVelocity},`);
	lines.push(`  gravity: ${controls.gravity},`);
	if (controls.burstRadius > 0) lines.push(`  burstRadius: ${controls.burstRadius},`);
	if (controls.trails) lines.push(`  trails: true,`);
	if (controls.heatmap) lines.push(`  debugVelocityHeatmap: true,`);
	lines.push(`  disableForReducedMotion: ${controls.disableForReducedMotion},`);
	return lines;
}

function updateUsageCode(): void {
	const el = document.getElementById("usage-code");
	if (!el) return;
	const lines = formatOptionLines(getControls());
	el.textContent = `import { confetti } from 'micro-canvas-confetti-physics';\n\nconfetti({\n${lines.join("\n")}\n});`;
}

function updateLabels(): void {
	const controls = getControls();
	const mappings: Array<[string, string | number]> = [
		["particle-count-val", controls.particleCount],
		["gravity-val", controls.gravity],
		["spread-val", controls.spread],
		["velocity-val", controls.startVelocity],
		["scalar-val", controls.scalar],
		["burst-radius-val", formatRadiusLabel(controls.burstRadius)],
	];
	for (const [id, value] of mappings) {
		const el = document.getElementById(id);
		if (el) el.textContent = String(value);
	}
	writeStateToUrl(controls);
	updateUsageCode();
}

function bindControls(): void {
	const ids = [
		"particle-count",
		"gravity",
		"spread",
		"velocity",
		"scalar",
		"burst-radius",
		"trails",
		"heatmap",
		"reduced-motion",
	];
	for (const id of ids) {
		const el = document.getElementById(id);
		el?.addEventListener("input", () => {
			if (id === "burst-radius") syncRadiusPills();
			updateLabels();
		});
		el?.addEventListener("change", () => {
			if (id === "burst-radius") syncRadiusPills();
			updateLabels();
		});
	}

	document.querySelectorAll("#duration-pills .seg-pill").forEach((pill) => {
		pill.addEventListener("click", () => {
			document
				.querySelectorAll("#duration-pills .seg-pill")
				.forEach((p) => p.classList.remove("active"));
			pill.classList.add("active");
			updateLabels();
		});
	});

	document.querySelectorAll(".radius-pill").forEach((pill) => {
		pill.addEventListener("click", () => {
			const radius = (pill as HTMLButtonElement).dataset.radius ?? "0";
			const el = document.getElementById("burst-radius") as HTMLInputElement | null;
			if (el) el.value = radius;
			syncRadiusPills();
			updateLabels();
		});
	});
}

function applyUrlState(): void {
	const state = readStateFromUrl();
	if (!state) return;

	const setVal = (id: string, value: string | number | boolean): void => {
		const el = document.getElementById(id) as HTMLInputElement | null;
		if (!el) return;
		if (el.type === "checkbox") el.checked = Boolean(value);
		else el.value = String(value);
	};

	if (state.preset) {
		activePreset = state.preset;
		document.querySelectorAll(".preset-card").forEach((card) => {
			card.classList.toggle("active", (card as HTMLElement).dataset.preset === state.preset);
		});
		applyPresetToControls(state.preset);
	}
	if (state.particleCount !== undefined) setVal("particle-count", state.particleCount);
	if (state.gravity !== undefined) setVal("gravity", state.gravity);
	if (state.spread !== undefined) setVal("spread", state.spread);
	if (state.startVelocity !== undefined) setVal("velocity", state.startVelocity);
	if (state.scalar !== undefined) setVal("scalar", state.scalar);
	if (state.burstRadius !== undefined) setVal("burst-radius", state.burstRadius);
	if (state.duration) {
		document.querySelectorAll("#duration-pills .seg-pill").forEach((pill) => {
			pill.classList.toggle(
				"active",
				(pill as HTMLButtonElement).dataset.duration === state.duration,
			);
		});
	}
	if (state.disableForReducedMotion !== undefined)
		setVal("reduced-motion", state.disableForReducedMotion);
	syncRadiusPills();
	updateLabels();
}

function stageCenterOrigin(): { x: number; y: number } {
	const stage = document.getElementById("demo-stage");
	if (!stage) {
		return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	}
	const rect = stage.getBoundingClientRect();
	return {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
}

function shouldSkipWelcomeBurst(): boolean {
	const reducedEl = document.getElementById("reduced-motion") as HTMLInputElement | null;
	if (reducedEl?.checked && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return true;
	}
	return Boolean(readStateFromUrl()?.preset);
}

function welcomeBurst(): void {
	if (shouldSkipWelcomeBurst()) return;
	burst(stageCenterOrigin());
}

function bindCopyInstall(): void {
	const btn = document.getElementById("copy-install");
	if (!btn) return;

	btn.addEventListener("click", async () => {
		const command = "npm install micro-canvas-confetti-physics";
		try {
			await navigator.clipboard.writeText(command);
			btn.classList.add("is-copied");
			btn.textContent = "Copied!";
			window.setTimeout(() => {
				btn.classList.remove("is-copied");
				btn.textContent = "Copy install";
			}, 1600);
		} catch {
			btn.textContent = "Copy failed";
			window.setTimeout(() => {
				btn.textContent = "Copy install";
			}, 1600);
		}
	});
}

function bindStage(): void {
	const stage = document.getElementById("demo-stage");
	if (!stage) return;

	stage.addEventListener("click", (e) => {
		burst({ x: e.clientX, y: e.clientY });
	});

	stage.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			burst(stageCenterOrigin());
		}
	});
}

function clearStage(): void {
	reset();
	stageHasBurst = false;
	document.getElementById("demo-stage")?.classList.remove("has-burst");
}

document.getElementById("launch-btn")?.addEventListener("click", () => burst(stageCenterOrigin()));

document.getElementById("sequence-btn")?.addEventListener("click", () => {
	markStageBurst();
	confettiSequence([
		{
			delay: 0,
			options: {
				preset: "cannon",
				origin: { x: window.innerWidth * 0.3, y: window.innerHeight * 0.7 },
			},
		},
		{
			delay: 200,
			options: {
				preset: "cannon",
				origin: { x: window.innerWidth * 0.7, y: window.innerHeight * 0.7 },
			},
		},
		{ delay: 450, options: { preset: "celebration" } },
	]);
});

document.getElementById("snapshot-btn")?.addEventListener("click", () => {
	const dataUrl = confetti.snapshot();
	if (dataUrl) downloadSnapshot(dataUrl);
});

document.getElementById("reset-btn")?.addEventListener("click", () => {
	clearStage();
});

document.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;
	if (target.closest("#demo-stage")) return;
	if (
		target.closest(
			"button, input, select, a, label, .panel, header, .preset-card, .seg-pill, .code-block, .shortcut-help, .controls-aside, .shortcut-row",
		)
	) {
		return;
	}
	burst({ x: e.clientX, y: e.clientY });
});

renderPresetCards();
bindControls();
bindStage();
bindCopyInstall();
applyUrlState();
initUrlState();
initFpsHud(getActiveParticleCount, getLastFrameMs);
initFullscreen("demo-stage");
initShortcuts({
	burst: () => burst(stageCenterOrigin()),
	reset: clearStage,
});
updateUsageCode();
window.setTimeout(welcomeBurst, 350);
