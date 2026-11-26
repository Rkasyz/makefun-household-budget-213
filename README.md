# Hearth & Ledger — a household budget site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Rkasyz/makefun-household-budget-213/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Rkasyz/makefun-household-budget-213/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A working household budget site for the Marlowe household, built for the
make.fun bounty "Make the best household budget site". It runs entirely from
static files in `app/` — no build step, no network request, nothing leaves
the browser.

## What it does

- **Dashboard** — the month at a glance: income, spending, saving, budget
  left, a donut of spending by category, budgets to watch, savings goals,
  and the latest transactions.
- **Transactions** — every entry for the month, with filters by type and
  category, a search box, and a working add / edit / delete form.
- **Budgets** — a monthly limit per category, with spent-so-far, progress
  bars and over-budget warnings; limits are editable and saved.
- **Goals** — savings goals with targets, progress, add-funds, and a form to
  start a new goal.
- **Reports** — six months of income vs spending as a bar chart, a category
  breakdown against budget, averages and the biggest single expense.
- **Settings** — household name, currency, export of the household's data as
  JSON, and reset to the demo data.

Everything is saved in `localStorage`, so edits survive a reload. The demo
household ships with six months of realistic figures (June–November 2026).

## How it works

- `app/index.html` — the page; loads `style.css` and `main.js` (ES module).
- `app/data.js` — categories, budgets, goals and the seed transactions.
- `app/store.js` — load/save state and the sums every view needs.
- `app/charts.js` — hand-drawn SVG donut and bar charts.
- `app/views.js` — the six pages, each reached by a hash link.
- `app/main.js` — hash router and the wiring for every control.
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes
  `/output/dossier.json` with the kit's `vendor/makefun-frontend.ts`.
- `serve.ts` — a tiny static server for local testing (`node serve.ts`,
  then open http://localhost:8080).

Run it with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
