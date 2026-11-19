---
name: ui-polish
description: Use when asked to improve the look and feel of the web app ("make it fancy", "make it nicer", "make it look professional", "modernise").
---
# UI polish: our house style

Goal: calm, premium, operational. Clean like a modern SaaS dashboard. Nothing that looks like a template or generic AI design.

1. Keep every feature, field, button, filter and the user switcher. Change presentation only.
2. Layout: top bar (app name, user switcher) -> page header (title + one-line summary) -> KPI cards in one row -> filters in one row -> table in a card -> forms in a card.
3. Colour: one accent colour only, deep blue #1e46c8. Neutral greys for everything else. White cards on a #f6f7f9 page. No gradients, no shadows heavier than a soft 1px border.
4. Status and priority as soft-tinted pills with a dot: high = red tint, medium = amber tint, low = grey; closed = green tint, awaiting_hse = amber.
5. Typography: system font stack, clear hierarchy (24 / 16 / 14 / 12 px), numbers in KPI cards large and bold.
6. Spacing in multiples of 4px. Tables: row hover, no vertical borders, left-aligned text, right-aligned numbers.
7. Accessibility: AA contrast, visible focus rings, a label for every input.
8. Only web/src/index.css and web/src/*.jsx. No new libraries.

Before opening the PR: bash scripts/verify.sh, before and after screenshots, then pr-evidence.
Never: change api/, mcp/ or auth; remove a feature; add a dependency.
