// State for Hearth & Ledger: load, save, and the sums every view needs.
// The state lives in localStorage, so the household's edits survive a reload;
// the seed from data.js is used only the first time the site is opened.

import { CATEGORIES, CURRENCIES, DEFAULT_STATE, MONTH_NAMES } from './data.js';

const STORAGE_KEY = 'hearth-ledger-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !parsed.budgets || !Array.isArray(parsed.goals)) {
      return clone(DEFAULT_STATE);
    }
    return parsed;
  } catch {
    return clone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return clone(DEFAULT_STATE);
}

export function monthLabel(month) {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthTransactions(state, month) {
  return state.transactions.filter((t) => t.d.startsWith(month));
}

export function monthTotals(state, month) {
  const txs = monthTransactions(state, month);
  let income = 0;
  let spent = 0;
  for (const t of txs) {
    if (t.type === 'income') income += t.amt;
    else spent += t.amt;
  }
  return { income, spent, saved: income - spent, count: txs.length };
}

export function categoryTotals(state, month) {
  const totals = {};
  for (const c of CATEGORIES) totals[c] = 0;
  for (const t of monthTransactions(state, month)) {
    if (t.type === 'expense') totals[t.cat] = (totals[t.cat] ?? 0) + t.amt;
  }
  return totals;
}

export function lastSixMonths(state) {
  const out = [];
  let m = state.month;
  for (let i = 0; i < 6; i++) {
    out.unshift(m);
    m = shiftMonth(m, -1);
  }
  return out;
}

export function money(state, amount) {
  const symbol = (CURRENCIES[state.currency] ?? CURRENCIES.USD).symbol;
  const n = Math.abs(amount);
  const text = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${amount < 0 ? '-' : ''}${symbol}${text}`;
}

export function moneyWhole(state, amount) {
  const symbol = (CURRENCIES[state.currency] ?? CURRENCIES.USD).symbol;
  const n = Math.abs(amount);
  const text = Math.round(n).toLocaleString('en-US');
  return `${amount < 0 ? '-' : ''}${symbol}${text}`;
}

export function shortDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}, ${y}`;
}

export function nextTransactionId(state) {
  let max = 0;
  for (const t of state.transactions) {
    const n = Number(String(t.id).replace(/^t/, ''));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `t${max + 1}`;
}

export function nextGoalId(state) {
  return `g${Date.now().toString(36)}${state.goals.length}`;
}

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
