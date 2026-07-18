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
| TypeDoc | ✅ | `npm run docs` → `docs/api/` |
| Playwright smoke | ✅ | `npm run test:e2e` |
| Benchmark page | ✅ | `demo/benchmark.html` |
| Husky pre-commit | ✅ | lint + format on commit |
| React / Vue / StackBlitz examples | ✅ | `examples/` |
| URL state sharing | ✅ | Shareable demo query params |
| IIFE CDN build | ✅ | `npm run build:iife` |
| Demo redesign | ✅ | Fredoka + Nunito, preset cards |

## v1+ — planned (not built)

These are intentionally deferred. Stubs and design notes live in `src/planned/`.

| Feature | Why deferred |
|---------|--------------|
| Web Worker physics | Off-main-thread integration; needs transferable buffers + sync model |
| OffscreenCanvas | Pairs with worker path; browser support matrix is uneven |
| Spatial indexing / collisions | Particle–particle hits; out of scope for lightweight confetti |
| VitePress docs site | TypeDoc covers API; marketing site is separate effort |
| Lighthouse CI | Demo perf gate; needs stable baseline after Pages deploy |
| i18n | Demo strings only; library has no user-facing copy |
| npm provenance | Release workflow flag; enable at first publish |

To preview a planned API shape, see `src/planned/README.md`. Imports from `src/planned/` are **not** published and will throw if called.
