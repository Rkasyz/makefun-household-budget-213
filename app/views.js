// Views for Hearth & Ledger: every page of the household budget site.
// Each view returns HTML; main.js renders it and wires the controls.
// Every number shown is computed from the household's real state.

import { CATEGORIES, CURRENCIES, INCOME_CATEGORIES, MONTH_NAMES } from './data.js';
import { barChart, donutChart, donutSlices, legendList } from './charts.js';
import {
  categoryTotals, escape, lastSixMonths, money, moneyWhole, monthLabel,
  monthTotals, monthTransactions, shortDate,
} from './store.js';

const NAV = [
  ['#/', 'Dashboard'],
  ['#/transactions', 'Transactions'],
  ['#/budgets', 'Budgets'],
  ['#/goals', 'Goals'],
  ['#/reports', 'Reports'],
  ['#/settings', 'Settings'],
];

function progressBar(pct, tone) {
  const clamped = Math.max(0, Math.min(100, pct));
  return `<div class="bar"><div class="bar-fill ${tone}" style="width:${clamped}%"></div></div>`;
}

function budgetTone(pct) {
  if (pct > 100) return 'over';
  if (pct >= 80) return 'warn';
  return 'ok';
}

function monthStepper(state) {
  return `<div class="month-stepper" role="group" aria-label="Choose month">
    <button type="button" data-action="prev-month" aria-label="Previous month">&lsaquo;</button>
    <strong>${monthLabel(state.month)}</strong>
    <button type="button" data-action="next-month" aria-label="Next month">&rsaquo;</button>
  </div>`;
}

export function layout(state, route, body) {
  const links = NAV.map(
    ([href, label]) =>
      `<a href="${href}"${route === href ? ' aria-current="page"' : ''}>${label}</a>`,
  ).join('');
  return `<header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#/">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 2 3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10L12 2z" fill="currentColor"/></svg></span>
        <span><span class="brand-name">Hearth &amp; Ledger</span>
        <span class="brand-sub">${escape(state.householdName)}</span></span>
      </a>
      ${monthStepper(state)}
    </div>
    <nav class="wrap site-nav" aria-label="Sections">${links}</nav>
  </header>
  <main class="wrap">${body}</main>
  <footer class="site-footer"><div class="wrap">
    Your money stays on your device — Hearth &amp; Ledger works entirely offline, and nothing you type here ever leaves this browser.
  </div></footer>`;
}

// ---------------------------------------------------------------- dashboard

export function dashboard(state) {
  const t = monthTotals(state, state.month);
  const totals = categoryTotals(state, state.month);
  const slices = donutSlices(totals);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const budgetLeft = totalBudget - t.spent;
  const topCats = slices.slice(0, 4);
  const recent = [...monthTransactions(state, state.month)]
    .sort((a, b) => (a.d < b.d ? 1 : -1))
    .slice(0, 8);
  const goals = state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<li class="goal-mini">
      <span class="goal-mini-name">${escape(g.name)}</span>
      ${progressBar(pct, 'ok')}
      <span class="goal-mini-amt">${money(state, g.saved)} of ${money(state, g.target)} · ${pct}%</span>
    </li>`;
  }).join('');
  return `<h1>${monthLabel(state.month)} at a glance</h1>
  <p class="lede">Income, spending and saving for ${escape(state.householdName)} — every figure below is live, from the transactions you keep here.</p>
  <section class="stats" aria-label="Month summary">
    <div class="stat"><span class="stat-label">Income</span><strong class="stat-value income">${money(state, t.income)}</strong><span class="stat-note">${t.count} transactions</span></div>
    <div class="stat"><span class="stat-label">Spent</span><strong class="stat-value spent">${money(state, t.spent)}</strong><span class="stat-note">across ${slices.length} categories</span></div>
    <div class="stat"><span class="stat-label">Saved</span><strong class="stat-value ${t.saved >= 0 ? 'income' : 'spent'}">${money(state, t.saved)}</strong><span class="stat-note">${t.income > 0 ? Math.round((t.saved / t.income) * 100) : 0}% of income kept</span></div>
    <div class="stat"><span class="stat-label">Budget left</span><strong class="stat-value ${budgetLeft >= 0 ? 'income' : 'spent'}">${money(state, budgetLeft)}</strong><span class="stat-note">of ${money(state, totalBudget)} planned</span></div>
  </section>
  <div class="grid-2">
    <section class="card" aria-label="Spending by category">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutChart(slices, 'spent', moneyWhole(state, t.spent))}</div>
      ${legendList(slices, (v) => money(state, v))}
    </section>
    <section class="card" aria-label="Budgets at a glance">
      <h2>Budgets to watch</h2>
      ${topCats.length === 0 ? '<p class="muted">No spending recorded this month yet.</p>' : `<ul class="budget-mini">${topCats.map((s) => {
        const limit = state.budgets[s.name] ?? 0;
        const pct = limit > 0 ? Math.round((s.value / limit) * 100) : 0;
        return `<li><span class="budget-mini-name">${escape(s.name)}</span>
          <span class="budget-mini-amt">${money(state, s.value)} of ${money(state, limit)}</span>
          ${progressBar(pct, budgetTone(pct))}
          <span class="budget-mini-pct">${pct}% used</span></li>`;
      }).join('')}</ul>`}
      <p><a class="btn" href="#/budgets">See all budgets &rsaquo;</a></p>
      <h2 class="subhead">Savings goals</h2>
      <ul class="goal-minis">${goals}</ul>
      <p><a class="btn" href="#/goals">See all goals &rsaquo;</a></p>
    </section>
  </div>
  <section class="card">
    <h2>Recent transactions</h2>
    ${recent.length === 0 ? '<p class="muted">Nothing recorded this month yet — add your first transaction.</p>' : `<table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th></tr></thead>
      <tbody>${recent.map((tx) => `<tr>
        <td>${shortDate(tx.d)}</td><td>${escape(tx.desc)}</td><td>${escape(tx.cat)}</td>
        <td class="num ${tx.type}">${tx.type === 'income' ? '+' : '−'}${money(state, tx.amt)}</td></tr>`).join('')}</tbody>
    </table>`}
    <p><a class="btn" href="#/transactions">All transactions &rsaquo;</a></p>
  </section>`;
}

// ---------------------------------------------------------------- transactions

export function transactions(state, ui) {
  const all = [...monthTransactions(state, state.month)].sort((a, b) => (a.d < b.d ? 1 : -1));
  const filtered = all.filter((tx) => {
    if (ui.txType !== 'all' && tx.type !== ui.txType) return false;
    if (ui.txCategory !== 'all' && tx.cat !== ui.txCategory) return false;
    if (ui.txSearch && !`${tx.desc} ${tx.cat}`.toLowerCase().includes(ui.txSearch.toLowerCase())) return false;
    return true;
  });
  const t = monthTotals(state, state.month);
  const editing = ui.editingId ? state.transactions.find((x) => x.id === ui.editingId) : null;
  const formTx = editing ?? { d: `${state.month}-26`, desc: '', cat: 'Groceries', amt: '', type: 'expense' };
  const catOptions = (list) => list.map((c) => `<option value="${escape(c)}"${formTx.cat === c ? ' selected' : ''}>${escape(c)}</option>`).join('');
  return `<h1>Transactions</h1>
  <p class="lede">Everything ${escape(state.householdName)} spent and earned in ${monthLabel(state.month)} — ${t.count} entries, ${money(state, t.income)} in and ${money(state, t.spent)} out.</p>
  <div class="filter-bar">
    <label>Type
      <select data-bind="tx-type">
        <option value="all"${ui.txType === 'all' ? ' selected' : ''}>All</option>
        <option value="income"${ui.txType === 'income' ? ' selected' : ''}>Income</option>
        <option value="expense"${ui.txType === 'expense' ? ' selected' : ''}>Expenses</option>
      </select>
    </label>
    <label>Category
      <select data-bind="tx-category">
        <option value="all">All categories</option>
        ${[...CATEGORIES, ...INCOME_CATEGORIES].map((c) => `<option value="${escape(c)}"${ui.txCategory === c ? ' selected' : ''}>${escape(c)}</option>`).join('')}
      </select>
    </label>
    <label class="grow">Search
      <input type="search" data-bind="tx-search" placeholder="Search description or category" value="${escape(ui.txSearch)}">
    </label>
    <button type="button" class="btn primary" data-action="toggle-add-tx">${ui.showAddTx || editing ? 'Hide form' : '+ Add transaction'}</button>
  </div>
  ${ui.showAddTx || editing ? `<section class="card form-card">
    <h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <form data-form="${editing ? 'edit-tx' : 'add-tx'}">
      <input type="hidden" name="id" value="${editing ? editing.id : ''}">
      <div class="form-grid">
        <label>Date <input type="date" name="d" value="${formTx.d}" required></label>
        <label>Description <input type="text" name="desc" value="${escape(formTx.desc)}" placeholder="e.g. GreenMart weekly shop" required maxlength="80"></label>
        <label>Amount <input type="number" name="amt" value="${formTx.amt}" min="0.01" step="0.01" placeholder="0.00" required></label>
        <label>Type
          <select name="type" data-form-type>
            <option value="expense"${formTx.type === 'expense' ? ' selected' : ''}>Expense</option>
            <option value="income"${formTx.type === 'income' ? ' selected' : ''}>Income</option>
          </select>
        </label>
        <label>Category <select name="cat" data-form-cat>${catOptions(formTx.type === 'income' ? INCOME_CATEGORIES : CATEGORIES)}</select></label>
      </div>
      <p class="form-actions">
        <button type="submit" class="btn primary">${editing ? 'Save changes' : 'Add transaction'}</button>
        ${editing ? '<button type="button" class="btn" data-action="cancel-edit">Cancel</button>' : ''}
      </p>
    </form>
  </section>` : ''}
  <section class="card">
    <h2>${filtered.length} transaction${filtered.length === 1 ? '' : 's'}</h2>
    ${filtered.length === 0 ? '<p class="muted">Nothing matches these filters. Try clearing the search or choosing another category.</p>' : `<table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th><span class="visually-hidden">Actions</span></th></tr></thead>
      <tbody>${filtered.map((tx) => `<tr>
        <td>${shortDate(tx.d)}</td><td>${escape(tx.desc)}</td><td>${escape(tx.cat)}</td>
        <td class="num ${tx.type}">${tx.type === 'income' ? '+' : '−'}${money(state, tx.amt)}</td>
        <td class="row-actions">
          <button type="button" data-action="edit-tx" data-id="${tx.id}">Edit</button>
          <button type="button" data-action="delete-tx" data-id="${tx.id}">Delete</button>
        </td></tr>`).join('')}</tbody>
    </table>`}
  </section>`;
}

// ---------------------------------------------------------------- budgets

export function budgets(state) {
  const totals = categoryTotals(state, state.month);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.values(totals).reduce((a, b) => a + b, 0);
  const over = CATEGORIES.filter((c) => totals[c] > (state.budgets[c] ?? 0));
  return `<h1>Budgets</h1>
  <p class="lede">Monthly limits for ${monthLabel(state.month)}. ${money(state, totalSpent)} spent of ${money(state, totalBudget)} planned${over.length ? ` — ${over.length} categor${over.length === 1 ? 'y' : 'ies'} over budget: ${over.map(escape).join(', ')}.` : ', and every category is inside its limit.'}</p>
  <div class="budget-grid">
  ${CATEGORIES.map((c) => {
    const spent = totals[c] ?? 0;
    const limit = state.budgets[c] ?? 0;
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const left = limit - spent;
    return `<section class="card budget-card">
      <h2>${escape(c)}</h2>
      <p class="big-figure">${money(state, spent)} <span class="muted">of ${money(state, limit)}</span></p>
      ${progressBar(pct, budgetTone(pct))}
      <p class="budget-note">${left >= 0 ? `${money(state, left)} left` : `${money(state, -left)} over budget`} · ${pct}% used</p>
      <label class="limit-edit">Monthly limit
        <span class="limit-row">
          <input type="number" min="0" step="1" value="${limit}" data-budget-input="${escape(c)}" aria-label="Monthly limit for ${escape(c)}">
          <button type="button" class="btn" data-action="save-budget" data-cat="${escape(c)}">Save</button>
        </span>
      </label>
    </section>`;
  }).join('')}
  </div>`;
}

// ---------------------------------------------------------------- goals

export function goals(state, ui) {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  return `<h1>Savings goals</h1>
  <p class="lede">${money(state, totalSaved)} saved towards ${money(state, totalTarget)} across ${state.goals.length} goals. Add money whenever you can — small amounts count.</p>
  <div class="goal-grid">
  ${state.goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const done = g.saved >= g.target;
    return `<section class="card goal-card">
      <h2>${escape(g.name)}</h2>
      <p class="muted">${escape(g.note)}</p>
      <p class="big-figure">${money(state, g.saved)} <span class="muted">of ${money(state, g.target)}</span></p>
      ${progressBar(pct, done ? 'ok' : 'warn')}
      <p class="budget-note">${done ? 'Goal reached — well done!' : `${pct}% there · ${money(state, g.target - g.saved)} to go`}</p>
      <label class="limit-edit">Add funds
        <span class="limit-row">
          <input type="number" min="1" step="1" placeholder="Amount" data-funds-input="${g.id}" aria-label="Amount to add to ${escape(g.name)}">
          <button type="button" class="btn primary" data-action="add-funds" data-id="${g.id}">Add</button>
        </span>
      </label>
      <p><button type="button" class="link-danger" data-action="delete-goal" data-id="${g.id}">Remove this goal</button></p>
    </section>`;
  }).join('')}
  </div>
  <section class="card form-card">
    <h2>Start a new goal</h2>
    <form data-form="add-goal">
      <div class="form-grid">
        <label>Goal name <input type="text" name="name" placeholder="e.g. New washing machine" required maxlength="60"></label>
        <label>Target amount <input type="number" name="target" min="1" step="1" placeholder="0" required></label>
        <label>Already saved <input type="number" name="saved" min="0" step="1" value="0"></label>
        <label>Note <input type="text" name="note" placeholder="Why this goal matters" maxlength="90"></label>
      </div>
      <p class="form-actions"><button type="submit" class="btn primary">Add goal</button></p>
    </form>
    ${ui.goalMsg ? `<p class="saved-msg" role="status">${escape(ui.goalMsg)}</p>` : ''}
  </section>`;
}

// ---------------------------------------------------------------- reports

export function reports(state) {
  const months = lastSixMonths(state);
  const income = months.map((m) => monthTotals(state, m).income);
  const spent = months.map((m) => monthTotals(state, m).spent);
  const saved = months.map((m, i) => income[i] - spent[i]);
  const avgSpent = spent.reduce((a, b) => a + b, 0) / spent.length;
  const avgSaved = saved.reduce((a, b) => a + b, 0) / saved.length;
  const best = months[saved.indexOf(Math.max(...saved))];
  const totals = categoryTotals(state, state.month);
  const slices = donutSlices(totals);
  const totalSpent = spent[spent.length - 1];
  const biggest = [...monthTransactions(state, state.month)]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amt - a.amt)[0];
  const shortMonth = (m) => `${MONTH_NAMES[Number(m.split('-')[1]) - 1].slice(0, 3)} ’${m.slice(2, 4)}`;
  return `<h1>Reports</h1>
  <p class="lede">Six months of the household's money, ending ${monthLabel(state.month)}. Averages are over the six months shown.</p>
  <section class="stats" aria-label="Six-month averages">
    <div class="stat"><span class="stat-label">Average spending</span><strong class="stat-value">${money(state, avgSpent)}</strong><span class="stat-note">per month</span></div>
    <div class="stat"><span class="stat-label">Average saving</span><strong class="stat-value ${avgSaved >= 0 ? 'income' : 'spent'}">${money(state, avgSaved)}</strong><span class="stat-note">per month</span></div>
    <div class="stat"><span class="stat-label">Best saving month</span><strong class="stat-value">${monthLabel(best)}</strong><span class="stat-note">${money(state, Math.max(...saved))} kept</span></div>
    <div class="stat"><span class="stat-label">Biggest single expense</span><strong class="stat-value">${biggest ? money(state, biggest.amt) : '—'}</strong><span class="stat-note">${biggest ? escape(biggest.desc) : `in ${monthLabel(state.month)}`}</span></div>
  </section>
  <section class="card">
    <h2>Income vs spending — last six months</h2>
    ${barChart(months.map(shortMonth), income, spent, (v) => moneyWhole(state, v))}
    <p class="chart-legend"><span class="swatch" style="background:#2f7d5b"></span> Income <span class="swatch" style="background:#b3541e"></span> Spending</p>
  </section>
  <section class="card">
    <h2>Where ${monthLabel(state.month)}’s money went</h2>
    ${slices.length === 0 ? '<p class="muted">No spending recorded this month yet.</p>' : `<table class="tx-table">
      <thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Share</th><th class="num">Budget</th><th class="num">Difference</th></tr></thead>
      <tbody>${slices.map((s) => {
        const limit = state.budgets[s.name] ?? 0;
        const diff = limit - s.value;
        return `<tr><td>${escape(s.name)}</td><td class="num">${money(state, s.value)}</td>
          <td class="num">${s.pct}%</td><td class="num">${money(state, limit)}</td>
          <td class="num ${diff >= 0 ? 'income' : 'spent'}">${diff >= 0 ? `${money(state, diff)} under` : `${money(state, -diff)} over`}</td></tr>`;
      }).join('')}</tbody>
      <tfoot><tr><td><strong>Total</strong></td><td class="num"><strong>${money(state, totalSpent)}</strong></td><td class="num"><strong>100%</strong></td><td class="num"><strong>${money(state, Object.values(state.budgets).reduce((a, b) => a + b, 0))}</strong></td><td></td></tr></tfoot>
    </table>`}
  </section>`;
}

// ---------------------------------------------------------------- settings

export function settings(state, ui) {
  const txCount = state.transactions.length;
  return `<h1>Settings</h1>
  <p class="lede">Household details and your data. Everything is stored only in this browser — there is no account and no server.</p>
  <section class="card form-card">
    <h2>Household</h2>
    <form data-form="settings">
      <div class="form-grid">
        <label>Household name <input type="text" name="householdName" value="${escape(state.householdName)}" maxlength="60" required></label>
        <label>Currency
          <select name="currency">
            ${Object.entries(CURRENCIES).map(([code, c]) => `<option value="${code}"${state.currency === code ? ' selected' : ''}>${escape(c.label)}</option>`).join('')}
          </select>
        </label>
      </div>
      <p class="form-actions"><button type="submit" class="btn primary">Save settings</button></p>
    </form>
    ${ui.settingsMsg ? `<p class="saved-msg" role="status">${escape(ui.settingsMsg)}</p>` : ''}
  </section>
  <section class="card">
    <h2>Your data</h2>
    <p>${txCount} transactions, ${state.goals.length} savings goals and ${Object.keys(state.budgets).length} category budgets are stored in this browser.</p>
    <p class="form-actions">
      <button type="button" class="btn" data-action="export-data">Download my data (.json)</button>
      <button type="button" class="btn danger" data-action="reset-data">${ui.resetArmed ? 'Click again to confirm reset' : 'Reset to demo data'}</button>
    </p>
    ${ui.resetArmed ? '<p class="warn-msg">Resetting replaces everything — transactions, budgets and goals — with the original demo household.</p>' : ''}
  </section>
  <section class="card">
    <h2>About Hearth &amp; Ledger</h2>
    <p>A household budget book that runs entirely from its own files. Add what you spend, set a limit per category, watch the month add up, and put a little aside for the things that matter. No account, no tracking, no network — your ledger never leaves your device.</p>
  </section>`;
}

export function missing() {
  return `<h1>Not found</h1>
  <p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
