// Hearth & Ledger: hash router and the wiring for every control.
// Views return HTML; this file renders it and handles clicks, forms and inputs.
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, INCOME_CATEGORIES } from './data.js';
import { loadState, nextGoalId, nextTransactionId, resetState, saveState, shiftMonth } from './store.js';
import { budgets, dashboard, goals, layout, missing, reports, settings, transactions } from './views.js';

const app = document.getElementById('app');
let state = loadState();

// Filter and form state for the Transactions page; settings/goal messages.
const ui = {
  txType: 'all',
  txCategory: 'all',
  txSearch: '',
  showAddTx: false,
  editingId: null,
  settingsMsg: '',
  goalMsg: '',
  resetArmed: false,
};

function route() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/reports')) return 'reports';
  if (hash.startsWith('#/settings')) return 'settings';
  return 'dashboard';
}

function render() {
  window.__shotReady = false;
  const r = route();
  let body;
  if (r === 'transactions') body = transactions(state, ui);
  else if (r === 'budgets') body = budgets(state);
  else if (r === 'goals') body = goals(state, ui);
  else if (r === 'reports') body = reports(state);
  else if (r === 'settings') body = settings(state, ui);
  else if (r === 'dashboard') body = dashboard(state);
  else body = missing();
  const titles = {
    dashboard: 'Hearth & Ledger — Household Budget',
    transactions: 'Transactions | Hearth & Ledger',
    budgets: 'Budgets | Hearth & Ledger',
    goals: 'Savings goals | Hearth & Ledger',
    reports: 'Reports | Hearth & Ledger',
    settings: 'Settings | Hearth & Ledger',
  };
  document.title = titles[r] ?? titles.dashboard;
  app.innerHTML = layout(state, r === 'dashboard' ? '#/' : `#/${r}`, body);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerender() {
  saveState(state);
  render();
}

function formValues(form) {
  const out = {};
  for (const el of new FormData(form).entries()) out[el[0]] = el[1];
  return out;
}

app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'prev-month') {
    state.month = shiftMonth(state.month, -1);
    ui.resetArmed = false;
    rerender();
  } else if (action === 'next-month') {
    state.month = shiftMonth(state.month, 1);
    ui.resetArmed = false;
    rerender();
  } else if (action === 'toggle-add-tx') {
    ui.showAddTx = !ui.showAddTx;
    ui.editingId = null;
    render();
  } else if (action === 'edit-tx') {
    ui.editingId = el.dataset.id;
    ui.showAddTx = true;
    render();
  } else if (action === 'cancel-edit') {
    ui.editingId = null;
    ui.showAddTx = false;
    render();
  } else if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== el.dataset.id);
    if (ui.editingId === el.dataset.id) {
      ui.editingId = null;
      ui.showAddTx = false;
    }
    rerender();
  } else if (action === 'save-budget') {
    const cat = el.dataset.cat;
    const input = app.querySelector(`[data-budget-input="${CSS.escape(cat)}"]`);
    const value = Number(input?.value);
    if (Number.isFinite(value) && value >= 0) {
      state.budgets[cat] = Math.round(value);
      rerender();
    }
  } else if (action === 'add-funds') {
    const id = el.dataset.id;
    const input = app.querySelector(`[data-funds-input="${CSS.escape(id)}"]`);
    const value = Number(input?.value);
    const goal = state.goals.find((g) => g.id === id);
    if (goal && Number.isFinite(value) && value > 0) {
      goal.saved += Math.round(value * 100) / 100;
      ui.goalMsg = `${value.toFixed(2)} added to ${goal.name}.`;
      rerender();
    }
  } else if (action === 'delete-goal') {
    state.goals = state.goals.filter((g) => g.id !== el.dataset.id);
    rerender();
  } else if (action === 'export-data') {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hearth-ledger-data.json';
    a.click();
    URL.revokeObjectURL(url);
  } else if (action === 'reset-data') {
    if (!ui.resetArmed) {
      ui.resetArmed = true;
      render();
    } else {
      state = resetState();
      ui.resetArmed = false;
      ui.settingsMsg = 'Demo data restored.';
      rerender();
    }
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-form]');
  if (!form) return;
  event.preventDefault();
  const kind = form.dataset.form;
  const v = formValues(form);
  if (kind === 'add-tx' || kind === 'edit-tx') {
    const amt = Number(v.amt);
    if (!v.d || !v.desc.trim() || !Number.isFinite(amt) || amt <= 0) return;
    const catList = v.type === 'income' ? INCOME_CATEGORIES : CATEGORIES;
    const cat = catList.includes(v.cat) ? v.cat : catList[0];
    if (kind === 'add-tx') {
      state.transactions.push({
        id: nextTransactionId(state),
        d: v.d,
        desc: v.desc.trim(),
        cat,
        amt: Math.round(amt * 100) / 100,
        type: v.type,
      });
      state.month = v.d.slice(0, 7);
    } else {
      const tx = state.transactions.find((t) => t.id === v.id);
      if (tx) {
        tx.d = v.d;
        tx.desc = v.desc.trim();
        tx.cat = cat;
        tx.amt = Math.round(amt * 100) / 100;
        tx.type = v.type;
        state.month = v.d.slice(0, 7);
      }
    }
    ui.showAddTx = false;
    ui.editingId = null;
    rerender();
  } else if (kind === 'add-goal') {
    const target = Number(v.target);
    const saved = Number(v.saved) || 0;
    if (!v.name.trim() || !Number.isFinite(target) || target <= 0) return;
    state.goals.push({
      id: nextGoalId(state),
      name: v.name.trim(),
      target: Math.round(target * 100) / 100,
      saved: Math.max(0, Math.round(saved * 100) / 100),
      note: (v.note ?? '').trim(),
    });
    ui.goalMsg = `Goal “${v.name.trim()}” added.`;
    rerender();
  } else if (kind === 'settings') {
    if (v.householdName.trim()) state.householdName = v.householdName.trim();
    if (v.currency) state.currency = v.currency;
    ui.settingsMsg = 'Settings saved.';
    rerender();
  }
});

// Category options in the transaction form follow the chosen type.
app.addEventListener('change', (event) => {
  const el = event.target;
  if (el.matches('[data-bind="tx-type"]')) {
    ui.txType = el.value;
    render();
  } else if (el.matches('[data-bind="tx-category"]')) {
    ui.txCategory = el.value;
    render();
  } else if (el.matches('[data-form-type]')) {
    const form = el.closest('form');
    const catSelect = form?.querySelector('[data-form-cat]');
    if (catSelect) {
      const list = el.value === 'income' ? INCOME_CATEGORIES : CATEGORIES;
      catSelect.innerHTML = list.map((c) => `<option value="${c}">${c}</option>`).join('');
    }
  }
});

app.addEventListener('input', (event) => {
  const el = event.target;
  if (el.matches('[data-bind="tx-search"]')) {
    ui.txSearch = el.value;
    // Re-render, then put the caret back in the search box.
    const pos = el.selectionStart;
    render();
    const next = app.querySelector('[data-bind="tx-search"]');
    if (next) {
      next.focus();
      next.setSelectionRange(pos, pos);
    }
  }
});

window.addEventListener('hashchange', () => {
  ui.editingId = null;
  ui.showAddTx = false;
  ui.settingsMsg = '';
  ui.goalMsg = '';
  ui.resetArmed = false;
  render();
});

render();
