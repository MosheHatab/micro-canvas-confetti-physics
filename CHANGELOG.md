# Changelog

## 0.2.0

### Minor Changes

- Pages deploy ships TypeDoc under `/api/` via `npm run build:pages`
- Lighthouse CI workflow against the built Pages site
- Experimental v1+ modules under `src/planned/` (worker physics, OffscreenCanvas, spatial hash) — not in public API
- Confetti-native options: `duration`, `scalar`, `decay`, `trails`, `trailLength`, `createParticle`
- `burstRadius` — max travel distance from burst origin; pieces fade naturally when they cross it
- `spark` preset — micro 8-piece burst that ends in ~1s (default 80px reach)
- `confetti.snapshot()`, `confettiSequence()`, velocity heatmap debug
- IIFE CDN build (`npm run build:iife`), TypeDoc (`npm run docs`)
- Demo redesign: preset cards, duration/reach controls, Fredoka/Nunito typography
- `ROADMAP.md` and `src/planned/` stubs for v1+ worker/offscreen APIs
- JSDoc on public functions across `src/` and `scripts/`

### Fixed

- Demo presets stay selected when burst settings are tweaked (preset + overrides merge)
- Reach radius no longer stacks all pieces on the boundary ring

## 0.1.0

### Minor Changes

- Initial release of micro-canvas-confetti-physics
- Zero-dependency canvas confetti with custom 2D physics (gravity, drag, 3D wobble)
- `confetti()` and `confetti.promise()` API
- Preset bursts: celebration, subtle, cannon
- `prefers-reduced-motion` support
- ESM + CJS dual exports with TypeScript types
- `./physics` subpath for framework-agnostic engine
