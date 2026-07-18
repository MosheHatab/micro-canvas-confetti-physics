import { UNMOUNT_DEBOUNCE_MS } from "../constants";
import { shouldDisableAnimation } from "./reduced-motion";
import { getDevicePixelRatio, resizeCanvasToDisplay } from "./resize";

/** Options for mounting the fullscreen confetti canvas. */
export interface CanvasManagerOptions {
	readonly zIndex: number;
}

/** Manages the fixed overlay canvas lifecycle, resize, and cleanup. */
export class CanvasManager {
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private resizeObserver: ResizeObserver | null = null;
	private unmountTimer: ReturnType<typeof setTimeout> | null = null;
	private readonly zIndex: number;

	public constructor(options: CanvasManagerOptions) {
		this.zIndex = options.zIndex;
	}

	/** Creates or returns the existing fullscreen canvas and 2D context. */
	public mount(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
		if (typeof document === "undefined") {
			throw new Error("Canvas cannot be mounted outside a browser environment.");
		}

		this.cancelUnmount();

		if (this.canvas !== null && this.ctx !== null) {
			return { canvas: this.canvas, ctx: this.ctx };
		}

		const canvas = document.createElement("canvas");
		canvas.setAttribute("aria-hidden", "true");
		canvas.style.position = "fixed";
		canvas.style.inset = "0";
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		canvas.style.pointerEvents = "none";
		canvas.style.zIndex = String(this.zIndex);

		const ctx = canvas.getContext("2d");
		if (ctx === null) {
			throw new Error("Canvas 2D context is not available in this environment.");
		}

		document.body.appendChild(canvas);
		this.canvas = canvas;
		this.ctx = ctx;

		this.resize();
		this.attachResizeObserver();

		return { canvas, ctx };
	}

	/** Returns the mounted canvas and context, or null when not mounted. */
	public getContext(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
		if (this.canvas === null || this.ctx === null) return null;
		return { canvas: this.canvas, ctx: this.ctx };
	}

	/** Syncs canvas size with the current viewport and device pixel ratio. */
	public resize(): void {
		if (this.canvas === null || this.ctx === null) return;
		if (typeof window === "undefined") return;

		resizeCanvasToDisplay(this.canvas, this.ctx, {
			cssWidth: window.innerWidth,
			cssHeight: window.innerHeight,
			dpr: getDevicePixelRatio(),
		});
	}

	/** Removes the canvas after a short delay once animation finishes. */
	public scheduleUnmount(): void {
		this.cancelUnmount();
		this.unmountTimer = setTimeout(() => {
			this.destroy();
		}, UNMOUNT_DEBOUNCE_MS);
	}

	/** Cancels a pending delayed unmount. */
	public cancelUnmount(): void {
		if (this.unmountTimer !== null) {
			clearTimeout(this.unmountTimer);
			this.unmountTimer = null;
		}
	}

	/** Disconnects observers and removes the canvas from the DOM. */
	public destroy(): void {
		this.cancelUnmount();
		if (this.resizeObserver !== null) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
		if (this.canvas !== null) {
			this.canvas.remove();
			this.canvas = null;
			this.ctx = null;
		}
	}

	/** Watches body size changes and resizes the canvas accordingly. */
	private attachResizeObserver(): void {
		if (typeof ResizeObserver === "undefined" || typeof document === "undefined") return;
		this.resizeObserver = new ResizeObserver(() => this.resize());
		this.resizeObserver.observe(document.body);
	}
}

/** Returns false when reduced-motion or SSR prevents running animation. */
export function canRunAnimation(disableForReducedMotion: boolean): boolean {
	return !shouldDisableAnimation(disableForReducedMotion);
}
