/**
 * Post-build step: copies .d.ts declaration files to .d.cts for CJS type resolution.
 */
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve(process.cwd(), "dist");

for (const entry of ["index", "physics"]) {
	await copyFile(resolve(dist, `${entry}.d.ts`), resolve(dist, `${entry}.d.cts`));
	console.log(`postbuild: copied dist/${entry}.d.ts -> dist/${entry}.d.cts`);
}
