/**
 * Experimental v1+ spatial hash for optional particle–particle overlap queries.
 *
 * Not exported from the published package. Disabled by default in product
 * confetti — collisions are O(n) neighborhood checks after binning, but still
 * costlier than the pass-through model and not needed for celebration bursts.
 */

export interface SpatialPoint {
	readonly x: number;
	readonly y: number;
	readonly radius: number;
	readonly index: number;
}

export interface SpatialHash {
	readonly cellSize: number;
	clear(): void;
	insert(point: SpatialPoint): void;
	/** Returns candidate indices that may overlap the query circle. */
	query(x: number, y: number, radius: number): number[];
}

/** Creates a uniform grid spatial hash (experimental). */
export function createSpatialHash(cellSize: number): SpatialHash {
	const size = Math.max(1, cellSize);
	const cells = new Map<string, number[]>();

	const key = (cx: number, cy: number): string => `${cx},${cy}`;

	return {
		cellSize: size,
		clear() {
			cells.clear();
		},
		insert(point) {
			const cx = Math.floor(point.x / size);
			const cy = Math.floor(point.y / size);
			const k = key(cx, cy);
			const bucket = cells.get(k);
			if (bucket) {
				bucket.push(point.index);
			} else {
				cells.set(k, [point.index]);
			}
		},
		query(x, y, radius) {
			const minX = Math.floor((x - radius) / size);
			const maxX = Math.floor((x + radius) / size);
			const minY = Math.floor((y - radius) / size);
			const maxY = Math.floor((y + radius) / size);
			const hits: number[] = [];
			const seen = new Set<number>();
			for (let cx = minX; cx <= maxX; cx++) {
				for (let cy = minY; cy <= maxY; cy++) {
					const bucket = cells.get(key(cx, cy));
					if (!bucket) continue;
					for (const index of bucket) {
						if (!seen.has(index)) {
							seen.add(index);
							hits.push(index);
						}
					}
				}
			}
			return hits;
		},
	};
}
