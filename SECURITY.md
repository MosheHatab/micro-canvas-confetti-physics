# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email or open a [GitHub Security Advisory](https://github.com/MosheHatab/micro-canvas-confetti-physics/security/advisories/new) on this repository.
3. Include: description, reproduction steps, impact assessment, and suggested fix if any.

We aim to respond within 7 days and will coordinate disclosure timing with you.

## Scope

This library mounts a temporary fullscreen `<canvas>` with `pointer-events: none`. It does not:
- Make network requests
- Store user data
- Execute user-provided code (no `eval`)

Report issues related to DOM manipulation, memory leaks, or denial-of-service via excessive particle counts.
