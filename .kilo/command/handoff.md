---
description: Summarize CodeNest project state and the next step (read-only)
---

You are resuming the CodeNest project. Do **not** modify files.

1. Read `AGENTS.md` in the project root.
2. Read `docs/ROADMAP.md`.
3. Verify the actual state:
   - `Test-Path package.json`
   - `Test-Path app`
   - `Test-Path studio`
   - `Get-ChildItem -Force`
   - `git status --short` (if Git is initialized)
4. Report in this order:
   - Current phase and status.
   - What exists vs what is missing.
   - Last completed work.
   - Blockers or risks.
   - The next concrete task.
   - The exact commands to run next.
5. If `package.json` is missing, state clearly: "The app is not scaffolded; start Phase 0."
6. Do not create a new plan and do not rebuild the docs.
7. Keep the report short and actionable.