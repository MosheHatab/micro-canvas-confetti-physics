export { PRESET_OPTIONS } from "./constants";
export type { ConfettiPreset } from "./types";

import { PRESET_OPTIONS } from "./constants";
import type { ConfettiOptions } from "./types";

/** Merges a preset with optional overrides into a single options object. */
export function applyPreset(
	preset: keyof typeof PRESET_OPTIONS,
	overrides?: ConfettiOptions,
): ConfettiOptions {
	return { ...PRESET_OPTIONS[preset], ...overrides, preset };
}
