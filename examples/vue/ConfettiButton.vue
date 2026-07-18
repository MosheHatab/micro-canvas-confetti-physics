import { confetti } from "micro-canvas-confetti-physics";
import { defineComponent } from "vue";

export default defineComponent({
	name: "ConfettiButton",
	setup() {
		const burst = (): void => {
			confetti({ preset: "subtle" });
		};
		return { burst };
	},
	template: `<button type="button" @click="burst">Celebrate!</button>`,
});
