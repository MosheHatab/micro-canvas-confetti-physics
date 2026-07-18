import { describe, expect, it } from "vitest";

import { MIN_FLATNESS } from "../../src/constants";
import { computeSkewX, computeWobbleScale } from "../../src/physics/wobble";

describe("computeWobbleScale", () => {
	it("returns 1 at phase 0", () => {
		expect(computeWobbleScale(0)).toBeCloseTo(1);
	});

	it("returns minFlatness at phase PI/2", () => {
		expect(computeWobbleScale(Math.PI / 2)).toBeCloseTo(MIN_FLATNESS);
	});

	it("never goes below minFlatness", () => {
		for (let phase = 0; phase < Math.PI * 2; phase += 0.1) {
			expect(computeWobbleScale(phase)).toBeGreaterThanOrEqual(MIN_FLATNESS);
		}
	});
});

describe("computeSkewX", () => {
	it("returns zero at phase 0", () => {
		expect(computeSkewX(0, 0.3)).toBeCloseTo(0);
	});

	it("returns max skew at phase PI/2", () => {
		expect(computeSkewX(Math.PI / 2, 0.3)).toBeCloseTo(0.3);
	});
});
