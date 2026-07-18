import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		dts({
			include: ["src"],
			exclude: ["tests/**", "src/planned/**"],
			tsconfigPath: "./tsconfig.build.json",
			bundleTypes: true,
		}),
	],
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
				physics: resolve(__dirname, "src/physics.ts"),
			},
			formats: ["es", "cjs"],
			fileName: (format, entryName) =>
				`${entryName}.${format === "es" ? "js" : "cjs"}`,
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: false,
				manualChunks: undefined,
			},
		},
		sourcemap: true,
	},
});
