# Contributing

Thanks for your interest in contributing to **micro-canvas-confetti-physics**!

## Development setup

```bash
git clone https://github.com/MosheHatab/micro-canvas-confetti-physics.git
cd micro-canvas-confetti-physics
npm install
npm run dev    # http://localhost:5173
```

**Requirements:** Node.js >= 18, npm >= 9.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start demo dev server with HMR |
| `npm test` | Run unit tests (physics + DOM) |
| `npm run test:e2e` | Playwright smoke tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict check |
| `npm run build` | Build library to `dist/` |
| `npm run build:iife` | CDN IIFE bundle (`dist/confetti.iife.js`) |
| `npm run build:demo` | Build static demo to `dist-demo/` |
| `npm run preview:demo` | Preview built demo locally |
| `npm run size` | Bundle size budget check |
| `npm run benchmark` | Physics integrator benchmark |
| `npm run docs` | Generate TypeDoc API reference |

## Architecture rules

- **Physics** lives in `src/physics/` — pure functions, no DOM imports
- **Rendering** lives in `src/render/` — canvas 2D commands only
- **DOM** lifecycle in `src/dom/` — mount/unmount, resize, reduced-motion
- **No `any`** — strict TypeScript throughout
- Every `requestAnimationFrame` must be paired with `cancelAnimationFrame`

## Pull request checklist

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` succeeds
- [ ] `npm run size` within budget (< 5 KB gzipped)
- [ ] No unrelated file changes
- [ ] Add a changeset if the public API changed: `npx changeset`

## Changesets & releases

We use [Changesets](https://github.com/changesets/changesets) for versioning. `changeset version` auto-generates `CHANGELOG.md`.

```bash
npx changeset          # describe your change
# After merge to main, CI opens a Version Packages PR
```

## Code review

Run `/confetti-code-review` in Cursor for an advisory checklist.
