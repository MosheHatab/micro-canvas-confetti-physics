# Roadmap

## v0.1 — shipped

- `confetti()` / `confetti.promise()` API
- Presets: `celebration`, `subtle`, `cannon`
- `prefers-reduced-motion` support
- ESM + CJS + `./physics` subpath
- GitHub Pages demo, CI, Dependabot, FPS HUD

## v0.2 — shipped (polish)

| Feature | Status | Notes |
|---------|--------|-------|
| `duration: 'short' \| 'normal' \| 'long'` | ✅ | Controls how long a burst lasts |
| `scalar` | ✅ | Particle size multiplier (micro bursts) |
| `decay` | ✅ | Faster fade-out |
| `spark` preset | ✅ | 8 mini pieces, ~1s burst |
| `burstRadius` | ✅ | Max distance from origin; natural fade at limit |
| `confetti.snapshot()` | ✅ | PNG data URL of current canvas |
| `confettiSequence()` | ✅ | Staged multi-burst choreography |
| Motion trails | ✅ | `trails`, `trailLength` |
| `createParticle` hook | ✅ | Per-particle customization |
| Velocity heatmap debug | ✅ | `debugVelocityHeatmap` |
| TypeDoc | ✅ | `npm run docs` → `docs/api/`; deployed under Pages `/api/` |
| Playwright smoke | ✅ | `npm run test:e2e` |
| Benchmark page | ✅ | `demo/benchmark.html` |
| Husky pre-commit | ✅ | lint + format on commit |
| React / Vue / StackBlitz examples | ✅ | `examples/` |
| URL state sharing | ✅ | Shareable demo query params |
| IIFE CDN build | ✅ | `npm run build:iife` |
| Demo redesign | ✅ | Fredoka + Nunito, preset cards |
| Pages site (demo + API) | ✅ | `npm run build:pages` → `dist-demo/` + `dist-demo/api/` |
| Lighthouse CI | ✅ | `.github/workflows/lighthouse.yml` against built Pages site |

## v1+ — experimental / deferred

| Feature | Status | Notes |
|---------|--------|-------|
| Web Worker physics | 🧪 Experimental | Implemented in `src/planned/worker-physics.ts` — **not** in public API / bundle |
| OffscreenCanvas | 🧪 Experimental | Implemented in `src/planned/offscreen-render.ts` — not wired into `FrameLoop` |
| Spatial indexing / collisions | 🧪 Experimental | `src/planned/collisions.ts` spatial hash — not wired into spawn loop |
| VitePress docs site | ⏸ Deferred | TypeDoc on Pages `/api/` covers API reference |
| i18n | ⏸ Deferred | Demo English only; library has no user-facing copy |
| npm provenance | ✅ Workflow ready | Completes on first successful publish |

Imports from `src/planned/` are **not** published. See `src/planned/README.md`.
