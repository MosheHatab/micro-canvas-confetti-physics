# Planned / experimental APIs (v1+)

Nothing in this folder is exported from the published package entry (`src/index.ts`).
Import only from source, tests, or demos.

| Module | Status | Notes |
|--------|--------|-------|
| `worker-physics.ts` | **Experimental (implemented)** | Blob Worker + Float32Array stride protocol |
| `offscreen-render.ts` | **Experimental (implemented)** | `transferControlToOffscreen` when supported |
| `collisions.ts` | **Experimental (implemented)** | Uniform grid spatial hash; not wired into the frame loop |

## Why these stay out of the public bundle

- Worker + Offscreen paths need opt-in wiring in `FrameLoop` and careful fallbacks.
- Collision queries add per-frame cost for little visual gain in celebration confetti.
- Keeping them here preserves the < 5 KB gzipped public budget.

## VitePress

Narrative docs site is deferred. TypeDoc is deployed to GitHub Pages at `/api/` via `npm run build:pages`.
