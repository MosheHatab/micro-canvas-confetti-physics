import { resolve } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

const DEMO_BASE = "/micro-canvas-confetti-physics/";

/** Redirect /micro-canvas-confetti-physics → /micro-canvas-confetti-physics/ (Vite requires trailing slash). */
function demoBaseRedirect(): Plugin {
	const basePath = DEMO_BASE.replace(/\/$/, "");
	return {
		name: "demo-base-redirect",
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = req.url ?? "";
				const isExactBase = url === basePath || url.startsWith(`${basePath}?`);
				if (!isExactBase) {
					next();
					return;
				}
				const query = url.includes("?") ? url.slice(url.indexOf("?")) : "";
				res.writeHead(301, { Location: `${DEMO_BASE}${query}` });
				res.end();
			});
		},
	};
}

export default defineConfig({
	root: "demo",
	base: DEMO_BASE,
	plugins: [demoBaseRedirect(), tailwindcss()],
	resolve: {
		alias: {
			"micro-canvas-confetti-physics/physics": resolve(__dirname, "src/physics.ts"),
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
		rollupOptions: {
			input: {
				main: resolve(__dirname, "demo/index.html"),
				benchmark: resolve(__dirname, "demo/benchmark.html"),
			},
		},
	},
});
