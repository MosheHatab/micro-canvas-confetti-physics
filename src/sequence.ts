import type { ConfettiOptions, ConfettiSequenceHandle, ConfettiSequenceStep } from "./types";

type BurstFn = (options?: ConfettiOptions) => { reset: () => void; isActive: () => boolean };

/**
 * Builds a sequence runner that schedules bursts through the given trigger function.
 */
export function createSequenceRunner(burst: BurstFn): (
	steps: readonly ConfettiSequenceStep[],
) => ConfettiSequenceHandle {
	return (steps: readonly ConfettiSequenceStep[]): ConfettiSequenceHandle => {
		const timers: ReturnType<typeof setTimeout>[] = [];
		let cancelled = false;

		const promise = new Promise<void>((resolve) => {
			if (steps.length === 0) {
				resolve();
				return;
			}

			let completed = 0;
			const total = steps.length;

			for (const step of steps) {
				const timer = setTimeout(() => {
					if (cancelled) return;
					burst(step.options);
					completed += 1;
					if (completed >= total) {
						resolve();
					}
				}, step.delay);
				timers.push(timer);
			}
		});

		return {
			cancel: () => {
				cancelled = true;
				for (const timer of timers) {
					clearTimeout(timer);
				}
			},
			promise,
		};
	};
}
