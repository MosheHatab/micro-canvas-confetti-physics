import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	root: "demo",
	base: "/micro-canvas-confetti-physics/",
	plugins: [tailwindcss()],
	resolve: {
		alias: {
			"micro-canvas-confetti-physics": resolve(__dirname, "src/index.ts"),
		},
	},
	server: {
		port: 5173,
		open: true,
	},
	build: {
		outDir: "../dist-demo",
		emptyOutDir: true,
	},
});
