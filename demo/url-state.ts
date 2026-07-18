import type { ConfettiDuration, ConfettiPreset } from "micro-canvas-confetti-physics";

export interface UrlState {
	preset?: ConfettiPreset | "";
	particleCount?: number;
	gravity?: number;
	spread?: number;
	startVelocity?: number;
	scalar?: number;
	duration?: ConfettiDuration;
	burstRadius?: number;
	disableForReducedMotion?: boolean;
}

export function readStateFromUrl(): UrlState | null {
	const params = new URLSearchParams(window.location.search);
	if (params.toString().length === 0) return null;

	const state: UrlState = {};
	const preset = params.get("preset");
	if (preset) state.preset = preset as ConfettiPreset;
	const pc = params.get("pieces");
	if (pc) state.particleCount = Number(pc);
	const g = params.get("fall");
	if (g) state.gravity = Number(g);
	const s = params.get("spread");
	if (s) state.spread = Number(s);
	const v = params.get("speed");
	if (v) state.startVelocity = Number(v);
	const sc = params.get("size");
	if (sc) state.scalar = Number(sc);
	const br = params.get("reach");
	if (br) state.burstRadius = Number(br);
	const d = params.get("duration");
	if (d === "short" || d === "normal" || d === "long") state.duration = d;
	const rm = params.get("reducedMotion");
	if (rm !== null) state.disableForReducedMotion = rm === "1";

	return state;
}

export function writeStateToUrl(state: UrlState): void {
	const params = new URLSearchParams();
	if (state.preset) params.set("preset", state.preset);
	params.set("pieces", String(state.particleCount ?? 80));
	params.set("fall", String(state.gravity ?? 1.2));
	params.set("spread", String(state.spread ?? 45));
	params.set("speed", String(state.startVelocity ?? 45));
	params.set("size", String(state.scalar ?? 1));
	params.set("reach", String(state.burstRadius ?? 0));
	params.set("duration", state.duration ?? "normal");
	params.set("reducedMotion", state.disableForReducedMotion ? "1" : "0");

	history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}

export function initUrlState(): void {
	window.addEventListener("popstate", () => window.location.reload());
}
