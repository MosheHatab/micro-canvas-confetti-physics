/** Captures the confetti canvas as a PNG data URL, or null if unavailable. */
export function captureCanvasSnapshot(): string | null {
	if (typeof document === "undefined") return null;
	const canvas = document.querySelector("canvas");
	if (!(canvas instanceof HTMLCanvasElement)) return null;
	try {
		return canvas.toDataURL("image/png");
	} catch {
		return null;
	}
}

/** Downloads a PNG snapshot in the browser. */
export function downloadSnapshot(dataUrl: string, filename = "confetti.png"): void {
	if (typeof document === "undefined") return;
	const link = document.createElement("a");
	link.href = dataUrl;
	link.download = filename;
	link.click();
}
