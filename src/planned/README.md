# Planned APIs (v1+, not implemented)

This folder documents future APIs. Nothing here is exported from the package entry point.

## Web Worker physics (`worker-physics.ts`)

Goal: run `integrateParticles` in a worker and post particle buffers back each frame.

```typescript
// Future shape (not available today)
import { createWorkerPhysicsEngine } from "micro-canvas-confetti-physics/planned/worker-physics";

const engine = createWorkerPhysicsEngine();
await engine.init();
engine.integrate(particles, dt);
```

## OffscreenCanvas render (`offscreen-render.ts`)

Goal: render on `OffscreenCanvas` inside a worker when supported.

## Collision pass (`collisions.ts`)

Goal: optional light spatial hash for overlapping rects — disabled by default to preserve bundle budget.
