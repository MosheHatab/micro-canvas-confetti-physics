# Roadmap

## v1.0.0 — shipped (npm)

Stable package published: [`micro-canvas-confetti-physics@1.0.0`](https://www.npmjs.com/package/micro-canvas-confetti-physics)

- Confetti-first API: `confetti()`, `confetti.promise()`, presets (`celebration`, `subtle`, `cannon`, `spark`)
- `duration` / `scalar` / `decay`, `burstRadius`, trails, `confetti.snapshot()`, `confettiSequence()`
- ESM + CJS + types + `./physics` subpath
- [Live demo](https://moshehatab.github.io/micro-canvas-confetti-physics/) and [API docs](https://moshehatab.github.io/micro-canvas-confetti-physics/api/)

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

## After 1.0 — automation & experimental

| Feature | Status | Notes |
|---------|--------|-------|
| npm Trusted Publishing (OIDC) | ⬜ Manual once | Package settings → Trusted Publisher → `MosheHatab/micro-canvas-confetti-physics` + `release.yml` |
| npm provenance on CI publish | ✅ Ready | Set when Trusted Publisher or `NPM_TOKEN` publishes from Actions |
| Web Worker physics | 🧪 Experimental | `src/planned/worker-physics.ts` — **not** in public API / bundle |
| OffscreenCanvas | 🧪 Experimental | `src/planned/offscreen-render.ts` — not wired into `FrameLoop` |
| Spatial indexing / collisions | 🧪 Experimental | `src/planned/collisions.ts` — not wired into spawn loop |
| VitePress docs site | ⏸ Deferred | TypeDoc on Pages `/api/` covers API reference |
| i18n | ⏸ Deferred | Demo English only; library has no user-facing copy |

Imports from `src/planned/` are **not** published. See `src/planned/README.md`.
