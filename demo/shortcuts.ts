import { toggleFullscreen } from "./fullscreen";

interface ShortcutHandlers {
	readonly burst: () => void;
	readonly reset: () => void;
}

export function initShortcuts(handlers: ShortcutHandlers): void {
	const help = document.getElementById("shortcut-help");
	const closeHelp = document.getElementById("close-help");

	const toggleHelp = (): void => {
		help?.classList.toggle("hidden");
	};

	closeHelp?.addEventListener("click", () => help?.classList.add("hidden"));

	document.addEventListener("keydown", (e) => {
		const target = e.target as HTMLElement;
		const isInput = target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA";

		if (e.key === "?" && !isInput) {
			e.preventDefault();
			toggleHelp();
			return;
		}

		if (e.key === "Escape") {
			help?.classList.add("hidden");
			return;
		}

		if (isInput) return;

		if (e.key === " ") {
			e.preventDefault();
			handlers.burst();
		} else if (e.key === "r" || e.key === "R") {
			handlers.reset();
		} else if (e.key === "f" || e.key === "F") {
			toggleFullscreen("demo-stage");
		}
	});
}
