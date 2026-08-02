# Micro Canvas Confetti

[![npm version](https://img.shields.io/npm/v/micro-canvas-confetti-physics.svg)](https://www.npmjs.com/package/micro-canvas-confetti-physics)
[![bundle size](https://img.shields.io/badge/bundle-<5kB-brightgreen)](https://github.com/MosheHatab/micro-canvas-confetti-physics)
[![CI](https://github.com/MosheHatab/micro-canvas-confetti-physics/actions/workflows/ci.yml/badge.svg)](https://github.com/MosheHatab/micro-canvas-confetti-physics/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/micro-canvas-confetti-physics.svg)](https://github.com/MosheHatab/micro-canvas-confetti-physics/blob/main/LICENSE)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-blue)](https://www.npmjs.com/package/micro-canvas-confetti-physics)

A **zero-dependency**, high-performance canvas confetti library — trigger bursts from a click, preset, or sequence. Custom motion engine with gravity, drag, and 3D wobble at 60fps.

> Package name on npm is `micro-canvas-confetti-physics` (historical). The public API is confetti-first: `confetti()`, presets, duration, and scalar — not a generic physics SDK.

[**Live demo**](https://moshehatab.github.io/micro-canvas-confetti-physics/) · [**API docs**](https://moshehatab.github.io/micro-canvas-confetti-physics/api/)

## Install

```bash
npm install micro-canvas-confetti-physics
```

## Quick start

```typescript
import { confetti } from "micro-canvas-confetti-physics";

// Burst from viewport center
confetti();

// Burst from cursor coordinates
confetti({
  origin: { x: 200, y: 400 },
  particleCount: 100,
  spread: 60,
});

// Quick micro burst — ends in ~1 second
confetti({ preset: "spark" });

// Short custom burst with small pieces
confetti({ particleCount: 20, duration: "short", scalar: 0.6 });

// Limit how far pieces can travel from the origin (px). 0 = no limit.
confetti({ preset: "celebration", burstRadius: 200, origin: { x: 400, y: 300 } });

// Await completion
await confetti.promise({ preset: "celebration" });

// Staged sequence
import { confettiSequence } from "micro-canvas-confetti-physics";

confettiSequence([
  { delay: 0, options: { preset: "cannon", origin: { x: 300, y: 500 } } },
  { delay: 450, options: { preset: "celebration" } },
]);
```

## API

| Option | Default | Description |
|--------|---------|-------------|
| `particleCount` | `80` | Number of pieces (1–500) |
| `origin` | viewport center | `{ x, y }` burst origin in CSS pixels |
| `angle` | `270` | Burst direction in degrees (up) |
| `spread` | `45` | Cone half-angle in degrees (0–360) |
| `startVelocity` | `45` | Initial speed in px/s |
| `gravity` | `1.2` | Downward acceleration px/s² |
| `drag` | `0.08` | Air resistance coefficient |
| `duration` | `'normal'` | `'short'` \| `'normal'` \| `'long'` — how long the burst lasts |
| `scalar` | `1` | Size multiplier (`0.2`–`3`) for micro or oversized pieces |
| `decay` | `0` | Extra fade speed (higher = disappears faster) |
| `burstRadius` | `0` | Max distance in px from origin. `0` = no limit. Pieces fade when they cross it |
| `colors` | festive palette | Array of CSS colors |
| `shapes` | `['rect','circle']` | Piece shapes |
| `preset` | — | `'celebration'` \| `'subtle'` \| `'cannon'` \| `'spark'` |
| `trails` | `false` | Motion trails behind pieces |
| `trailLength` | `6` | Trail history length when `trails` is enabled |
| `debugVelocityHeatmap` | `false` | Color pieces by speed (demo debug) |
| `createParticle` | — | Hook to customize each piece at spawn |
| `disableForReducedMotion` | `true` | No-op when user prefers reduced motion |

### Methods

- `confetti(options?)` — trigger a burst; returns `{ reset, isActive }`
- `confetti.promise(options?)` — returns `Promise<void>` when all pieces finish
- `confetti.snapshot()` — PNG data URL of the current canvas (or `null`)
- `confettiSequence(steps)` — staged bursts with per-step `delay` (alias: `sequence`)
- `reset()` — cancel animation, clear pieces, remove canvas
- `getActiveParticleCount()` — live piece count
- `getLastFrameMs()` — last frame render time in ms
- `downloadSnapshot(dataUrl, filename?)` — save a PNG in the browser

**v1.0.0** is published on npm. See [CHANGELOG.md](./CHANGELOG.md) and [ROADMAP.md](./ROADMAP.md) for shipped features and post-1.0 experiments.

### CDN (IIFE)

```bash
npm run build:iife   # → dist/confetti.iife.js
```

See `examples/cdn/index.html` for a script-tag usage sample.

### Subpath import (physics only)

```typescript
import { spawnParticles, integrateParticles } from "micro-canvas-confetti-physics/physics";
```

## Comparison with canvas-confetti

| | **micro-canvas-confetti-physics** | canvas-confetti |
|---|---|---|
| Bundle size | < 5 KB gzipped | ~7 KB+ |
| Runtime dependencies | **0** | 0 |
| TypeScript | First-class types | @types package |
| Physics | Custom drag + 3D wobble | Basic |
| `prefers-reduced-motion` | Built-in | Manual |
| `confetti.promise()` | Yes | No |
| `confetti.snapshot()` / sequences | Yes | No |
| `burstRadius` (reach limit) | Yes | No |
| Presets | Yes (`celebration`, `subtle`, `cannon`, `spark`) | No |
| `duration` / `scalar` | Yes | No |

## Development

```bash
npm install
npm run dev          # demo at http://localhost:5173
npm test             # unit tests
npm run test:e2e     # Playwright smoke
npm run lint
npm run typecheck
npm run build        # ESM + CJS → dist/
npm run build:iife   # CDN bundle
npm run build:demo   # static demo only
npm run build:pages  # demo + TypeDoc → dist-demo/ and dist-demo/api/
npm run docs         # TypeDoc → docs/api/
npm run benchmark    # integrator throughput
npm run size         # bundle budget (< 5 KB brotlied)
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © Moshe Hatab
