import { confetti } from "micro-canvas-confetti-physics";

export function ConfettiButton(): React.ReactElement {
	return (
		<button type="button" onClick={() => confetti({ preset: "celebration" })}>
			Celebrate!
		</button>
	);
}
