import { describe, expect, it } from "vitest";

import { DEFAULT_PHYSICS } from "../../src/constants";
import { applyDrag, applyDrag2D } from "../../src/physics/drag";

describe("applyDrag", () => {
	it("reduces velocity over time", () => {
		const result = applyDrag(100, 0.08, 0.016);
		expect(result).toBeLessThan(100);
		expect(result).toBeGreaterThan(0);
	});

	it("returns same velocity when drag is zero", () => {
		expect(applyDrag(50, 0, 0.016)).toBeCloseTo(50);
	});
});

describe("applyDrag2D", () => {
	it("damps both axes", () => {
		const { vx, vy } = applyDrag2D(100, -50, 0.08, 0.016);
		expect(Math.abs(vx)).toBeLessThan(100);
		expect(Math.abs(vy)).toBeLessThan(50);
	});
});

describe("integrate with drag", () => {
	it("velocity approaches zero with sustained drag", () => {
		let vx = 100;
		for (let i = 0; i < 2000; i++) {
			vx = applyDrag(vx, DEFAULT_PHYSICS.drag, 1 / 60);
		}
		expect(vx).toBeLessThan(10);
	});
});
