# API Growth PM take-home — Tanvir Kaur

Three clickable prototypes accompanying the written response. Tab between them at the top of the page.

**Live:** _replace with your GitHub Pages URL once enabled_

## Ideas

- **Idea 1 · "Open in Claude Code" CTAs** — six placements explored for the API docs/console, from inline banner to floating bar. Click "Copy prompt" on any variant to put a Claude Code–ready prompt on your clipboard.
- **Idea 2 · GitHub-based onboarding** — replace the post-signin "Buy credits" screen with a Connect GitHub flow. Five-step walkthrough: sign in → welcome → GitHub auth → repo picker → analyzing → dashboard with a generated PR. Jump between steps via the pill at the bottom-left of each screen.
- **Idea 3 · OpenAI → Claude migration** — a first-party migration wizard: welcome → repo picker (OpenAI-heavy repos) → scanning/transformation → PR review with side-by-side diff + optimization recommendations → celebration screen with a credit bonus.

## Running locally

All three prototypes are React/Babel rendered in-browser via CDN — no build step. Serve the folder over HTTP (opening `index.html` via `file://` works for most features but blocks clipboard access on some browsers):

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Notes for evaluators

- Each flow persists its last step in `localStorage` — use the "Restart" button in the bottom-left pill to reset.
- If scripts fail to load, it's almost certainly the unpkg CDN — a refresh usually fixes it.
