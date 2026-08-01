import { spawnSync } from "node:child_process";
import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const distDemo = resolve(root, "dist-demo");
const docsApi = resolve(root, "docs/api");
const pagesApi = resolve(distDemo, "api");

function run(command, args) {
	const result = spawnSync(command, args, {
		stdio: "inherit",
		shell: true,
		cwd: root,
	});
	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

console.log("build-pages: building demo…");
run("npm", ["run", "build:demo"]);

console.log("build-pages: generating TypeDoc…");
run("npm", ["run", "docs"]);

console.log("build-pages: copying docs → dist-demo/api…");
await rm(pagesApi, { recursive: true, force: true });
await mkdir(pagesApi, { recursive: true });
await cp(docsApi, pagesApi, { recursive: true });

console.log("build-pages: ready — demo at dist-demo/, API at dist-demo/api/");
