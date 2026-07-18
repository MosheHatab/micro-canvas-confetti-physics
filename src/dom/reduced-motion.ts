/** Returns true when animation should be skipped for prefers-reduced-motion. */
export function shouldDisableAnimation(disableForReducedMotion: boolean): boolean {
	if (!disableForReducedMotion) return false;
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Subscribes to prefers-reduced-motion changes.
 * Returns an unsubscribe function, or null when unavailable.
 */
export function createReducedMotionListener(callback: () => void): (() => void) | null {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return null;
	}
	const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
	const handler = (): void => callback();
	mq.addEventListener("change", handler);
	return () => mq.removeEventListener("change", handler);
}
