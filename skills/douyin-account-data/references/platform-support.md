# Platform support

## macOS

Full collection requires Ego Lite and the `ego-browser` command.

1. Download Ego Lite from `https://lite.ego.app/download`.
2. Install and launch it.
3. Complete onboarding so Ego Lite can install `ego-browser` and its Agent Skill.
4. Log into the user's own Douyin Creator Center inside Ego Lite.
5. Reopen the Agent if it cannot discover the newly installed browser Skill.

Ego Lite supports Apple Silicon and Intel Macs. The browser login state stays in Ego Lite; this Skill must not extract it.

## Windows and Linux

Ego Lite does not currently provide a Windows or Linux release. Automatic Douyin Creator Center collection is therefore unsupported on those platforms.

Do not fall back to the archived Playwright collector. A future adapter is acceptable only after it reproduces the same authenticated-page coverage, download integrity, quality gates, cleanup guarantees, and Workbench contract tests.

The Workbench and its synthetic demo remain usable without live collection.
