import { describe, expect, it } from "vitest";

import { createSpatialHash } from "../../src/planned/collisions";

describe("spatial hash (experimental)", () => {
	it("returns neighboring indices for a query", () => {
		const hash = createSpatialHash(50);
		hash.insert({ x: 10, y: 10, radius: 5, index: 0 });
		hash.insert({ x: 200, y: 200, radius: 5, index: 1 });
		const near = hash.query(12, 12, 20);
		expect(near).toContain(0);
		expect(near).not.toContain(1);
	});

	it("clears cells", () => {
		const hash = createSpatialHash(40);
		hash.insert({ x: 0, y: 0, radius: 1, index: 3 });
		hash.clear();
		expect(hash.query(0, 0, 10)).toEqual([]);
	});
});
