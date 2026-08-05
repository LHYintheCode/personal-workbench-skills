---
name: douyin-account-data
description: Collect the user's own authorized Douyin Creator Center analytics, validate the official exports, and update the complete data contract consumed by Personal AI Workbench. Use when the user asks to pull, refresh, validate, or display their own Douyin account data in the Workbench. Do not use for other creators, public-account scraping, private messages, content strategy, or topic recommendations.
---

# Douyin Account Data

## Scope

Only collect data from a Douyin Creator Center account that the user has explicitly authorized and can access in Ego Lite. Produce data facts for Personal AI Workbench; do not generate content recommendations, account strategy, or publishing actions.

This workflow supports macOS only because the authenticated collector requires Ego Lite and `ego-browser`. On Windows or Linux, stop and explain that automatic collection is not currently supported. Do not silently switch to the legacy Playwright collector or claim partial data is complete.

## Required inputs

Resolve both paths before collection:

- Personal AI Workbench root containing `Workbench/server/vault-index.mjs`.
- A private knowledge-base root where `30_self_media/douyin/` may be written.

Prefer paths explicitly provided by the user, then `PERSONAL_DASHBOARD_ROOT` and `PERSONAL_DASHBOARD_VAULT_ROOT`. If either path remains unknown, ask the user. Never guess a username, home directory, repository name, or Vault name.

Read [platform-support.md](references/platform-support.md) when setup, Ego Lite, login, Windows, or Linux is involved. Read [data-contract.md](references/data-contract.md) before changing collection coverage or the Workbench output schema.

## Safety gate

Before running:

1. Confirm the account belongs to the user or the user is authorized to access it.
2. Confirm Ego Lite is installed and the user has completed onboarding.
3. Confirm the user has logged into Douyin Creator Center inside Ego Lite.
4. Confirm the target knowledge base is private and is not the public synthetic demo directory in a Git repository.
5. Confirm `node`, `python3`, `jq`, `ego-browser`, and Python package `openpyxl` are available.

Never read, print, copy, or persist cookies, passwords, browser profiles, login tokens, or session parameters. Stop on QR login, CAPTCHA, phone confirmation, account selection, permission denial, or rate limiting and ask the user to complete the required action in Ego Lite.

## Collect and publish

Run the bundled entry point:

```bash
bash <本 Skill 目录>/scripts/collect.sh \
  --dashboard-root <Personal AI Workbench 根目录> \
  --vault-root <私人知识库根目录>
```

The script must:

1. Probe the existing Ego Lite login state.
2. Download official account, follower, work, collection, and per-work detail exports into a uniquely created system temporary directory.
3. Capture only the page evidence required for fields without official Excel coverage.
4. Inventory and parse the exports.
5. Reject missing, duplicate, invalid, or internally inconsistent data.
6. Build the exact Workbench model using the installed Workbench parser.
7. Atomically replace `<Vault>/30_self_media/douyin/` only after all quality gates pass.
8. Delete temporary exports and page snapshots on success or failure.
9. Verify the published `current.json` before reporting success.

Use `--work-ids <comma-separated platform work ids>` only when the user explicitly asks to refresh specific work details or when automatic discovery cannot find them. Never place real work IDs in this repository or its documentation.

## Completion report

Report:

- collection status;
- target `current.json` path;
- capture time;
- number of works and deep-detail packages;
- account daily row count and collection count;
- quality status;
- whether temporary sources were deleted;
- any unavailable fields or platform coverage limits.

Do not print raw downloaded rows, private page text, work IDs, account identifiers, local browser paths, or session-bearing URLs.
