/** Returns a random float between min and max, inclusive of min. */
export function randomInRange(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

/** Returns a random integer between min and max, inclusive. */
export function randomInt(min: number, max: number): number {
	return Math.floor(randomInRange(min, max + 1));
}

/** Picks a random item from a non-empty array. */
export function pickRandom<T>(items: readonly T[]): T {
	const index = randomInt(0, items.length - 1);
	return items[index] as T;
}
