import { MAX_DEVICE_PIXEL_RATIO } from "../constants";

/** Returns device pixel ratio, capped for performance on high-DPI screens. */
export function getDevicePixelRatio(): number {
	const ratio = typeof window !== "undefined" ? window.devicePixelRatio : 1;
	if (!Number.isFinite(ratio) || ratio <= 0) return 1;
	return Math.min(ratio, MAX_DEVICE_PIXEL_RATIO);
}

/** CSS and device dimensions used when sizing the canvas. */
export interface DisplaySize {
	readonly cssWidth: number;
	readonly cssHeight: number;
	readonly dpr: number;
}

/**
 * Resizes the canvas backing store to match CSS size and DPR.
 * Returns true when the backing dimensions changed.
 */
export function resizeCanvasToDisplay(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	size: DisplaySize,
): boolean {
	const { cssWidth, cssHeight, dpr } = size;
	const deviceWidth = Math.max(1, Math.round(cssWidth * dpr));
	const deviceHeight = Math.max(1, Math.round(cssHeight * dpr));

	const changed = canvas.width !== deviceWidth || canvas.height !== deviceHeight;
	if (changed) {
		canvas.width = deviceWidth;
		canvas.height = deviceHeight;
		canvas.style.width = `${cssWidth}px`;
		canvas.style.height = `${cssHeight}px`;
	}

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	return changed;
}
