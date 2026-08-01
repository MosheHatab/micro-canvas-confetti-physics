/**
 * Experimental v1+ OffscreenCanvas helper.
 *
 * Not exported from the published package. Progressive enhancement:
 * transfers control when supported; callers must fall back to main-thread canvas.
 */

export interface OffscreenRenderer {
	readonly kind: "offscreen" | "unsupported";
	readonly canvas: OffscreenCanvas | null;
	readonly ctx: OffscreenCanvasRenderingContext2D | null;
	release(): void;
}

/** Attempts to transfer an HTML canvas to an OffscreenCanvas (experimental). */
export function createOffscreenRenderer(canvas: HTMLCanvasElement): OffscreenRenderer {
	const canTransfer =
		typeof canvas.transferControlToOffscreen === "function" &&
		typeof OffscreenCanvas !== "undefined";

	if (!canTransfer) {
		return {
			kind: "unsupported",
			canvas: null,
			ctx: null,
			release() {
				/* no-op */
			},
		};
	}

	const offscreen = canvas.transferControlToOffscreen();
	const ctx = offscreen.getContext("2d");
	return {
		kind: "offscreen",
		canvas: offscreen,
		ctx,
		release() {
			/* Ownership stays with the OffscreenCanvas until GC; no detach API. */
		},
	};
}

/** True when this environment can create OffscreenCanvas 2D contexts. */
export function supportsOffscreenCanvas(): boolean {
	return (
		typeof OffscreenCanvas !== "undefined" &&
		typeof HTMLCanvasElement !== "undefined" &&
		typeof HTMLCanvasElement.prototype.transferControlToOffscreen === "function"
	);
}
