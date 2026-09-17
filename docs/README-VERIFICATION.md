# PowerBookmark README verification notes

This file records the evidence used for the SWIR README PRO v2 migration. It is not a product roadmap and does not change extension behavior.

## Evidence reviewed

- `manifest.json`: Manifest V3, extension version `2.0`, `storage` / `activeTab` / `scripting`, `<all_urls>` host permission, popup/icon and a content script on all URLs.
- `popup.html` / `popup.js`: Polish popup UI, local script list, add/edit/delete/toggle flow and page-tool launch controls.
- `content.js`: execution of user-supplied JavaScript in page context plus page-element inspection/editing helpers.
- `.github/workflows/release.yml`: manifest/file validation, ZIP packaging and GitHub Release publishing workflow.
- GitHub release metadata: public `v2.0.0` with Chromium ZIP and SHA-256 sidecar, published September 12, 2026.
- Open pull requests: none existed before this migration branch was created.

## Corrections made in the v2 README

- Product readiness is **N/A**, because the repository has no canonical measurable roadmap. A published release is not converted into a completion percentage.
- The README no longer claims a working JSON backup/restore feature. `popup.html` contains a JSON backup button, but the current `popup.js` has no event handler for that control.
- The current interface is documented as Polish only; an English variant is not presented as implemented.
- Broad host permissions and arbitrary custom-script execution are called out explicitly. Page modification tools are framed for pages the user owns or is authorized to test; the documentation does not promote bypassing site protections.
- No `LICENSE` file exists in the current tree, so no licensing terms are inferred.

## Verification scope

The migration changes only documentation, README artwork and deterministic documentation tooling. It does not change extension source, permissions, manifest version, published packages, release tags, workflow behavior or licensing.

The existing release workflow does not run for README/assets changes; it runs on version tags, manual dispatch or edits to the workflow itself. Therefore a documentation-only PR may have no GitHub Actions run. Documentation verification consists of reading back the branch/default-branch files, checking the v2/Search Keywords markers and local links, keeping card/mini/text status consistent, and using `tools/generate_readme_progress.py --check` in an environment where the checkout is available.

No Chrome Web Store publication, browser-runtime regression test or permission audit beyond source/manifest review is claimed by this migration.
