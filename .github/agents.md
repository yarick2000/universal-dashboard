# Copilot Coding Agent – Repository Instructions

## Goals
- Maintain code quality, tests, and security while implementing changes.

## Tools and Preferences
- Prefer: TypeScript, npm, ESLint, 
- Avoid: Global installs; use repo scripts and lockfiles.

## Change Management
- Make minimal, focused diffs.
- Update docs and tests with code changes.
- For multi-file refactors, open a PR with a concise summary and checklist.

## Testing & CI
- Run unit tests locally before proposing changes.
- Honour existing CI scripts: `npm run test`, `npm run lint`.

## Security
- Do not add credentials or plaintext secrets.
- Use environment variables and existing secret stores (environment variables defined in config files under root src/config directory, the current secrest store is Vercel's environment variables store - could be updated by developer only).