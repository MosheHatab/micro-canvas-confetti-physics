/** Clamps a number to the given range. */
export function clamp(value: number, min: number, max: number): number {
	if (value < min) return min;
	if (value > max) return max;
	return value;
}

/** Returns true when the value is a finite number. */
export function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

/** Converts degrees to radians. */
export function degreesToRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

/** Computes frame delta time in seconds, capped for stability. */
export function computeDeltaSeconds(lastTimestamp: number, timestamp: number): number {
	if (lastTimestamp <= 0) return 1 / 60;
	const deltaMs = timestamp - lastTimestamp;
	return clamp(deltaMs / 1000, 0.001, 0.05);
}
