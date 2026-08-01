import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT ?? 4173);
const PREFIX = "/micro-canvas-confetti-physics";
const ROOT = join(process.cwd(), "dist-demo");

const MIME = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".woff2": "font/woff2",
	".map": "application/json",
};

function resolvePath(urlPath) {
	let pathname = decodeURIComponent(urlPath.split("?")[0] ?? "/");
	if (pathname === PREFIX || pathname === `${PREFIX}/`) {
		pathname = "/index.html";
	} else if (pathname.startsWith(`${PREFIX}/`)) {
		pathname = pathname.slice(PREFIX.length);
	}
	if (pathname.endsWith("/")) {
		pathname = `${pathname}index.html`;
	}
	const filePath = normalize(join(ROOT, pathname.replace(/^\//, "")));
	if (!filePath.startsWith(ROOT)) return null;
	return filePath;
}

const server = createServer((req, res) => {
	const filePath = resolvePath(req.url ?? "/");
	if (filePath === null || !existsSync(filePath) || !statSync(filePath).isFile()) {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not found");
		return;
	}
	res.writeHead(200, { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" });
	createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
	console.log(`serve-pages: http://localhost:${PORT}${PREFIX}/`);
});
