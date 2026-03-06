# MAINTAINERS.md

This repo is maintained proactively on a recurring basis.

## Purpose
Keep `ejholmes/ejholmes.github.io` healthy, secure, and easy to update.

## Cadence
- Weekly lightweight maintenance pass
- Ad-hoc pass when CI fails, dependencies go stale, or publishing breaks

## Weekly checklist
1. **Dependency drift**
   - Check for updates in `Gemfile.lock` dependencies.
   - Check dev tooling updates (`devbox.json` / `devbox.lock`) when relevant.
2. **Build + test sanity**
   - Run the local build flow used by the repo.
   - Fix or file an issue for any breakage.
3. **CI health**
   - Review recent GitHub Actions runs.
   - Triage recurring flakes/failures.
4. **Content/repo hygiene**
   - Watch for broken links, obvious formatting regressions, or stale metadata.
   - Keep docs current when workflows change.
5. **Security posture**
   - Review dependency/security alerts and patch low-risk updates.

## Change policy
- Prefer small, focused PRs (single axis of change).
- For risky or uncertain changes, open an issue first with context and rollout plan.

