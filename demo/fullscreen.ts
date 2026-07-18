export function initFullscreen(elementId: string): void {
	const el = document.getElementById(elementId);
	if (!el) return;

	const toggle = (): void => {
		if (!document.fullscreenElement) {
			void el.requestFullscreen().catch(() => undefined);
		} else {
			void document.exitFullscreen().catch(() => undefined);
		}
	};

	(el as HTMLElement & { _toggleFullscreen?: () => void })._toggleFullscreen = toggle;
}

export function toggleFullscreen(elementId: string): void {
	const el = document.getElementById(elementId) as HTMLElement & { _toggleFullscreen?: () => void };
	el?._toggleFullscreen?.();
}
