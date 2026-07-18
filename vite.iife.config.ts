import { resolve } from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "MicroCanvasConfetti",
			formats: ["iife"],
			fileName: () => "confetti.iife.js",
		},
		outDir: "dist",
		emptyOutDir: false,
	},
});
