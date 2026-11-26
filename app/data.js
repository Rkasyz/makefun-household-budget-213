// Seed data for Hearth & Ledger: the Marlowe household's budget.
// Every figure is invented for this demo household. Amounts are in dollars;
// the currency symbol shown on screen comes from settings, the numbers stay.

export const CATEGORIES = [
  'Groceries',
  'Housing',
  'Utilities',
  'Transport',
  'Dining Out',
  'Health',
  'Kids & School',
  'Entertainment',
  'Shopping',
  'Subscriptions',
  'Other',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other income'];

export const CATEGORY_COLORS = {
  Groceries: '#2f7d5b',
  Housing: '#3b5b8c',
  Utilities: '#7a6a2f',
  Transport: '#8c4a2f',
  'Dining Out': '#b3541e',
  Health: '#5b7d8c',
  'Kids & School': '#7d5ba6',
  Entertainment: '#a63d6e',
  Shopping: '#4a6b8a',
  Subscriptions: '#6b7d3a',
  Other: '#8a8a8a',
};

export const DEFAULT_BUDGETS = {
  Groceries: 650,
  Housing: 1650,
  Utilities: 240,
  Transport: 320,
  'Dining Out': 280,
  Health: 200,
  'Kids & School': 350,
  Entertainment: 150,
  Shopping: 300,
  Subscriptions: 85,
  Other: 150,
};

export const DEFAULT_GOALS = [
  { id: 'g-car', name: 'New family car', target: 12000, saved: 7350, note: 'Replace the 2011 hatchback before winter.' },
  { id: 'g-holiday', name: 'Summer holiday', target: 3200, saved: 2140, note: 'A week by the coast in July.' },
  { id: 'g-emergency', name: 'Emergency fund', target: 10000, saved: 6800, note: 'Six months of essentials, kept separate.' },
];

// One transaction: { d: 'YYYY-MM-DD', desc, cat, amt, type: 'income' | 'expense' }.
// June–October are shorter histories so the six-month report has real figures;
// November, the current month, is the full working month.
export const SEED_TRANSACTIONS = [
  // ---- November 2026 (current month) ----
  { d: '2026-11-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-11-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-11-02', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 148.2, type: 'expense' },
  { d: '2026-11-03', desc: 'Bus passes (2 adults)', cat: 'Transport', amt: 96, type: 'expense' },
  { d: '2026-11-03', desc: 'Electricity — City Power', cat: 'Utilities', amt: 87.4, type: 'expense' },
  { d: '2026-11-04', desc: 'Tom freelance — logo refresh', cat: 'Freelance', amt: 620, type: 'income' },
  { d: '2026-11-05', desc: 'School lunches — November', cat: 'Kids & School', amt: 132, type: 'expense' },
  { d: '2026-11-06', desc: 'Cinema — family night', cat: 'Entertainment', amt: 46, type: 'expense' },
  { d: '2026-11-07', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 121.75, type: 'expense' },
  { d: '2026-11-08', desc: 'Pizza night — Bella’s', cat: 'Dining Out', amt: 38.5, type: 'expense' },
  { d: '2026-11-09', desc: 'Water bill', cat: 'Utilities', amt: 54.1, type: 'expense' },
  { d: '2026-11-10', desc: 'Pharmacy — flu jabs', cat: 'Health', amt: 64, type: 'expense' },
  { d: '2026-11-11', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 52.3, type: 'expense' },
  { d: '2026-11-12', desc: 'Tom freelance — wedding invites', cat: 'Freelance', amt: 380, type: 'income' },
  { d: '2026-11-13', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 139.9, type: 'expense' },
  { d: '2026-11-14', desc: 'Kids’ football boots', cat: 'Kids & School', amt: 74.95, type: 'expense' },
  { d: '2026-11-15', desc: 'Streaming — films + music', cat: 'Subscriptions', amt: 27.98, type: 'expense' },
  { d: '2026-11-15', desc: 'Internet — Fiber 200', cat: 'Utilities', amt: 49, type: 'expense' },
  { d: '2026-11-16', desc: 'New winter coats (2)', cat: 'Shopping', amt: 118, type: 'expense' },
  { d: '2026-11-17', desc: 'Lunch — Corner Deli', cat: 'Dining Out', amt: 24.6, type: 'expense' },
  { d: '2026-11-18', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 132.4, type: 'expense' },
  { d: '2026-11-19', desc: 'Dentist — check-up x2', cat: 'Health', amt: 110, type: 'expense' },
  { d: '2026-11-20', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 48.7, type: 'expense' },
  { d: '2026-11-21', desc: 'Birthday gift — Grandma', cat: 'Shopping', amt: 42, type: 'expense' },
  { d: '2026-11-22', desc: 'Sunday roast — The Oak', cat: 'Dining Out', amt: 61.2, type: 'expense' },
  { d: '2026-11-23', desc: 'School trip — science museum', cat: 'Kids & School', amt: 36, type: 'expense' },
  { d: '2026-11-24', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 126.55, type: 'expense' },
  { d: '2026-11-25', desc: 'Tom freelance — menu design', cat: 'Freelance', amt: 450, type: 'income' },
  { d: '2026-11-26', desc: 'Mobile top-up (2 lines)', cat: 'Utilities', amt: 40, type: 'expense' },
  // ---- October 2026 ----
  { d: '2026-10-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-10-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-10-03', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 141.3, type: 'expense' },
  { d: '2026-10-06', desc: 'Electricity — City Power', cat: 'Utilities', amt: 92.15, type: 'expense' },
  { d: '2026-10-08', desc: 'Tom freelance — poster series', cat: 'Freelance', amt: 540, type: 'income' },
  { d: '2026-10-10', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 129.8, type: 'expense' },
  { d: '2026-10-12', desc: 'Car service + MOT', cat: 'Transport', amt: 214, type: 'expense' },
  { d: '2026-10-15', desc: 'Streaming — films + music', cat: 'Subscriptions', amt: 27.98, type: 'expense' },
  { d: '2026-10-17', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 155.6, type: 'expense' },
  { d: '2026-10-19', desc: 'School shoes — Leo', cat: 'Kids & School', amt: 58, type: 'expense' },
  { d: '2026-10-21', desc: 'Dinner — Thai House', cat: 'Dining Out', amt: 47.3, type: 'expense' },
  { d: '2026-10-24', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 138.45, type: 'expense' },
  { d: '2026-10-26', desc: 'Pharmacy — prescriptions', cat: 'Health', amt: 38.2, type: 'expense' },
  { d: '2026-10-28', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 55.4, type: 'expense' },
  { d: '2026-10-30', desc: 'Halloween costumes', cat: 'Shopping', amt: 63, type: 'expense' },
  // ---- September 2026 ----
  { d: '2026-09-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-09-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-09-04', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 133.9, type: 'expense' },
  { d: '2026-09-07', desc: 'School uniforms + books', cat: 'Kids & School', amt: 187.5, type: 'expense' },
  { d: '2026-09-09', desc: 'Tom freelance — brochure', cat: 'Freelance', amt: 720, type: 'income' },
  { d: '2026-09-11', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 147.2, type: 'expense' },
  { d: '2026-09-14', desc: 'Electricity — City Power', cat: 'Utilities', amt: 78.6, type: 'expense' },
  { d: '2026-09-18', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 126.75, type: 'expense' },
  { d: '2026-09-20', desc: 'Family picnic + train', cat: 'Entertainment', amt: 58.4, type: 'expense' },
  { d: '2026-09-23', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 49.9, type: 'expense' },
  { d: '2026-09-25', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 142.1, type: 'expense' },
  { d: '2026-09-27', desc: 'Dinner — Thai House', cat: 'Dining Out', amt: 52.8, type: 'expense' },
  // ---- August 2026 ----
  { d: '2026-08-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-08-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-08-05', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 158.3, type: 'expense' },
  { d: '2026-08-08', desc: 'Tom freelance — festival posters', cat: 'Freelance', amt: 890, type: 'income' },
  { d: '2026-08-12', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 144.6, type: 'expense' },
  { d: '2026-08-15', desc: 'Beach day — parking + ice cream', cat: 'Entertainment', amt: 41.2, type: 'expense' },
  { d: '2026-08-19', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 151.9, type: 'expense' },
  { d: '2026-08-22', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 61.2, type: 'expense' },
  { d: '2026-08-26', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 137.4, type: 'expense' },
  { d: '2026-08-29', desc: 'Dinner — Thai House', cat: 'Dining Out', amt: 49.5, type: 'expense' },
  // ---- July 2026 ----
  { d: '2026-07-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-07-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-07-03', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 139.5, type: 'expense' },
  { d: '2026-07-10', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 152.8, type: 'expense' },
  { d: '2026-07-14', desc: 'Tom freelance — café branding', cat: 'Freelance', amt: 1050, type: 'income' },
  { d: '2026-07-17', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 128.6, type: 'expense' },
  { d: '2026-07-20', desc: 'Kids’ summer camp (2)', cat: 'Kids & School', amt: 240, type: 'expense' },
  { d: '2026-07-24', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 146.3, type: 'expense' },
  { d: '2026-07-28', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 57.8, type: 'expense' },
  // ---- June 2026 ----
  { d: '2026-06-01', desc: 'Maya salary — Northwind Studio', cat: 'Salary', amt: 5400, type: 'income' },
  { d: '2026-06-01', desc: 'Rent — 14 Alder Street', cat: 'Housing', amt: 1650, type: 'expense' },
  { d: '2026-06-05', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 131.4, type: 'expense' },
  { d: '2026-06-09', desc: 'Tom freelance — flyers', cat: 'Freelance', amt: 410, type: 'income' },
  { d: '2026-06-12', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 143.7, type: 'expense' },
  { d: '2026-06-16', desc: 'Electricity — City Power', cat: 'Utilities', amt: 84.3, type: 'expense' },
  { d: '2026-06-19', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 129.9, type: 'expense' },
  { d: '2026-06-23', desc: 'Petrol — Shell Alder Rd', cat: 'Transport', amt: 53.6, type: 'expense' },
  { d: '2026-06-26', desc: 'GreenMart weekly shop', cat: 'Groceries', amt: 137.8, type: 'expense' },
  { d: '2026-06-30', desc: 'Dinner — Thai House', cat: 'Dining Out', amt: 44.1, type: 'expense' },
];

export const DEFAULT_STATE = {
  householdName: 'Marlowe household',
  currency: 'USD',
  month: '2026-11',
  budgets: { ...DEFAULT_BUDGETS },
  goals: DEFAULT_GOALS.map((g) => ({ ...g })),
  transactions: SEED_TRANSACTIONS.map((t, i) => ({ id: `t${i + 1}`, ...t })),
};

export const CURRENCIES = {
  USD: { symbol: '$', label: 'US dollar ($)' },
  EUR: { symbol: '€', label: 'Euro (€)' },
  GBP: { symbol: '£', label: 'British pound (£)' },
  IDR: { symbol: 'Rp', label: 'Indonesian rupiah (Rp)' },
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
