# GitHub Backups and Restore Plan

This site uses GitHub as the main safety net for board-edited CMS content.

## Backup strategy

1. **Every CMS edit is a Git commit.**
   - The CMS writes changes to the configured branch, currently `staging`.
   - GitHub keeps the full commit history, so individual bad edits can be reverted.

2. **Daily backup tags keep a simple 30-day restore trail.**
   - The workflow `.github/workflows/cms-backup.yml` creates one timestamped tag per run.
   - Tags are named like `cms-backups/2026-05-17-061500`.
   - The default retention window is 30 days.
   - Older `cms-backups/*` tags are pruned by the workflow, while normal Git commit history remains intact.

3. **Protected publishing should still be used.**
   - Board edits should land in the review/preview flow first.
   - The live production branch should stay protected so bad copy does not go live without approval.

## What can be restored

### Restore one bad CMS edit

Use this when a board member changes copy incorrectly and the next commit should undo only that edit.

```bash
git checkout staging
git pull origin staging
git revert <bad_commit_sha>
git push origin staging
```

### Restore one content file from an earlier backup

Use this when only one file is wrong, such as `data/board.json`.

```bash
git fetch --tags
git checkout staging
git pull origin staging
git checkout <backup_tag_or_commit> -- data/board.json
git commit -m "Restore board content from backup"
git push origin staging
```

Examples of files likely to be restored:

- `data/site.json`
- `data/board.json`
- `data/faq.json`
- `data/calendar.json`
- `data/bylaws.json`

### Restore the whole staging site to a backup snapshot

Use this only when several files are wrong and staging should return to a known-good snapshot.

```bash
git fetch --tags
git checkout staging
git pull origin staging
git checkout <backup_tag> -- .
git commit -m "Restore staging site from backup snapshot"
git push origin staging
```

This creates a normal restore commit instead of rewriting history.

## Finding backup tags in GitHub

1. Open the repository on GitHub.
2. Click the branch/tag selector near the top-left of the file list.
3. Switch from **Branches** to **Tags**.
4. Search for `cms-backups/`.
5. Pick the timestamp closest to the known-good version.

## Recommended live-site safety rules

- Keep `main` as the live production branch.
- Keep `staging` as the CMS/edit/review branch.
- Require pull requests before merging into `main`.
- Do not give board members direct write access to `main`.
- Use Vercel preview/staging deployments to review board edits before production.

## Emergency guidance

If a bad edit reaches production:

1. Identify the bad commit or last known-good backup tag.
2. Restore on `staging` first when possible.
3. Verify the preview deployment.
4. Merge or promote the fix to `main` after approval.

Avoid force-pushing or resetting protected branches unless Jeff explicitly approves it.
