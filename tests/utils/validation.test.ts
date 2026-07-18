import { describe, expect, it } from "vitest";

import { DEFAULT_PARTICLE_COUNT } from "../../src/constants";
import { parseConfettiOptions } from "../../src/utils/validation";

describe("parseConfettiOptions", () => {
	it("returns defaults when no options provided", () => {
		const resolved = parseConfettiOptions();
		expect(resolved.particleCount).toBe(DEFAULT_PARTICLE_COUNT);
		expect(resolved.gravity).toBeGreaterThan(0);
		expect(resolved.colors.length).toBeGreaterThan(0);
	});

	it("clamps particle count to valid range", () => {
		expect(parseConfettiOptions({ particleCount: 0 }).particleCount).toBe(1);
		expect(parseConfettiOptions({ particleCount: 9999 }).particleCount).toBe(500);
	});

	it("merges preset with overrides", () => {
		const resolved = parseConfettiOptions({
			preset: "subtle",
			particleCount: 50,
		});
		expect(resolved.particleCount).toBe(50);
		expect(resolved.startVelocity).toBeLessThan(45);
	});

	it("clamps spread to 0-360", () => {
		expect(parseConfettiOptions({ spread: -10 }).spread).toBe(0);
		expect(parseConfettiOptions({ spread: 400 }).spread).toBe(360);
	});

	it("defaults disableForReducedMotion to true", () => {
		expect(parseConfettiOptions().disableForReducedMotion).toBe(true);
	});
});
