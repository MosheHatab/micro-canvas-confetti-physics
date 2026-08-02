# AGENTS.md — Agent guide for micro-canvas-confetti-physics

## Project overview

Zero-dependency TypeScript npm package: canvas confetti with custom 2D physics (gravity, drag, 3D wobble). Published on npm as **`micro-canvas-confetti-physics@1.0.0`** (ESM + CJS with types).

Public API highlights: `confetti()`, presets, `duration`/`scalar`, `burstRadius` (reach limit), `confetti.promise()`, `confetti.snapshot()`, `confettiSequence()`.

## Module boundaries

| Path | Responsibility | Must NOT contain |
|------|----------------|------------------|
| `src/physics/` | Pure physics math | DOM, canvas, `window` |
| `src/render/` | Canvas 2D drawing | Physics formulas inline |
| `src/dom/` | Canvas mount/resize/cleanup | Draw or integrate logic |
| `src/utils/validation.ts` | Option parsing | Side effects |
| `demo/` | Playground UI only | Published library code |

## Forbidden patterns

- `any` type (ESLint error)
- Magic numbers in logic — use `src/constants.ts`
- `requestAnimationFrame` without `cancelAnimationFrame` cleanup
- Inline physics math in render files

## Commands

- `/confetti-code-review` — advisory code review checklist (`.cursor/commands/confetti-code-review.md`)

## Design system

For demo UI work, read:
1. `design-system/micro-canvas-confetti/pages/demo.md` (if exists)
2. `design-system/micro-canvas-confetti/MASTER.md` (if exists)
3. `.cursor/skills/ui-ux-pro-max/SKILL.md`

## Key scripts

```bash
npm run dev        # demo server
npm test           # vitest
npm run build      # lib build
npm run build:iife # CDN bundle
npm run docs       # TypeDoc API reference
npm run size       # bundle budget
```

## Bundle budget

`dist/index.js` must stay < 5 KB gzipped. Run `npm run size` after changes.
