/** Applies exponential drag to a scalar velocity. */
export function applyDrag(velocity: number, drag: number, dt: number): number {
	const dragDecay = Math.exp(-drag * dt);
	return velocity * dragDecay;
}

/** Applies exponential drag to a 2D velocity vector. */
export function applyDrag2D(
	vx: number,
	vy: number,
	drag: number,
	dt: number,
): { vx: number; vy: number } {
	const dragDecay = Math.exp(-drag * dt);
	return { vx: vx * dragDecay, vy: vy * dragDecay };
}
