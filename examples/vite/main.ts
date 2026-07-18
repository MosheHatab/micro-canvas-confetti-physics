import { confetti } from "micro-canvas-confetti-physics";

document.getElementById("btn")?.addEventListener("click", () => {
	confetti({ particleCount: 80, preset: "celebration" });
});
