import { MIN_FLATNESS } from "../constants";

/** Returns the horizontal scale for 3D wobble on a rotating piece. */
export function computeWobbleScale(phase: number, minFlatness: number = MIN_FLATNESS): number {
	const flatness = Math.abs(Math.cos(phase));
	return Math.max(minFlatness, flatness);
}

/** Returns the skew applied to simulate depth during wobble. */
export function computeSkewX(phase: number, skewFactor: number): number {
	return Math.sin(phase) * skewFactor;
}
