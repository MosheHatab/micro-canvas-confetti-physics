# /confetti-code-review

Run a focused code review against this library's engineering rules.

## Checklist

### Typing & API
- [ ] No `any`. Types in `src/types.ts`, exported from `src/index.ts`.

### Architecture
- [ ] Physics in `src/physics/` — none inline in render.
- [ ] Render in `src/render/` — canvas commands only.
- [ ] DOM in `src/dom/` — lifecycle only.

### Performance & cleanup
- [ ] rAF cancelled on cleanup.
- [ ] ResizeObserver disconnected on destroy.
- [ ] No per-frame allocations in hot loop.

### Accessibility
- [ ] `prefers-reduced-motion` honored.
- [ ] Canvas has `aria-hidden="true"`.

### Robustness
- [ ] Input validation in `parseConfettiOptions`.
- [ ] SSR guards on browser APIs.

### Bundle
- [ ] `npm run size` < 5 KB gzipped.

## Verdict

PASS or CHANGES REQUESTED with severity, file:line, rule, and fix.
