# Version Change Workflow

## 1. Prepare Product Release Notes
1. Open `prd/releases.json`.
2. Insert a new entry at the **top** of the array with:
   - `version`: semantic version string (e.g. `3.3.2`).
   - `releaseDate`: ISO date (e.g. `2025-10-21`).
   - `product`, `technical`, and `rollout` blocks filled with the product narrative, engineering changes, and rollout checklist. These values feed both the changelog page and tooltip messaging.

## 2. Create a Release Branch
1. Start from `main` and pull latest changes.
2. Create a feature branch such as `release/v3.3.2-product-sync`.
3. All subsequent edits for the version bump happen in this branch.

## 3. Sync Application Version Metadata
Run from the repository root:
```bash
pnpm --filter=app run sync-version
```
This script aligns:
- Root `package.json` and `.app/package.json` versions.
- `nuxt.config.ts` runtime `appVersion`.
- PWA files (`public/manifest.json`, `public/sw.js`).
- Service-worker cache keys and validates the new `prd/releases.json` entry.

## 4. Verify UI and Data Hooks
1. Launch the app (or run a preview build) and open `/changelog` to ensure the new release renders correctly.
2. Confirm the version badge in the bottom-right corner shows the new version and its tooltip matches the release summary.
3. Spot-check any product messaging that references the new release.

## 5. Test and Stabilize
1. Run `pnpm --filter=app build` and resolve any failures.
2. Execute additional automated or manual tests required by the release (e.g. smoke tests, PWA installation checks).

## 6. Finalize and Ship
1. Review changes with `git status` and `git diff`.
2. Commit using a descriptive message (e.g. `chore: release 3.3.2`) and include co-author metadata if needed.
3. Push the branch and open a pull request describing the release scope.
4. After approval, merge into `main` and tag the release if desired.
5. Publish external communications (release notes, announcements) based on the new `prd/releases.json` entry.
