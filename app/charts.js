// Small SVG charts, drawn by hand — no library, no network.
// donutChart: spending by category as a ring with a hole for the total.
// barChart: grouped income-vs-spending bars for six months.

import { CATEGORY_COLORS } from './data.js';

export function donutChart(slices, totalLabel, totalValue) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 84;
  const width = 30;
  const circumference = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e2d6" stroke-width="${width}"/>
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${totalValue}</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">${totalLabel}</text>
    </svg>`;
  }
  let offset = 0;
  const rings = slices
    .map((s) => {
      const frac = s.value / total;
      const len = frac * circumference;
      const dash = `${Math.max(len - 2, 0)} ${circumference - Math.max(len - 2, 0)}`;
      const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${width}" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" />`;
      offset += len;
      return el;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category">
    <g transform="rotate(-90 ${cx} ${cy})">${rings}</g>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="donut-total">${totalValue}</text>
    <text x="${cx}" y="${cy + 20}" text-anchor="middle" class="donut-label">${totalLabel}</text>
  </svg>`;
}

export function legendList(slices, fmt) {
  if (slices.length === 0) return '<p class="muted">No spending in this month yet.</p>';
  return `<ul class="legend">${slices
    .map(
      (s) => `<li><span class="swatch" style="background:${s.color}"></span>
        <span class="legend-name">${s.name}</span>
        <span class="legend-value">${fmt(s.value)}</span>
        <span class="legend-pct">${s.pct}%</span></li>`,
    )
    .join('')}</ul>`;
}

export function barChart(months, income, spent, fmt) {
  const w = 640;
  const h = 260;
  const padL = 56;
  const padB = 34;
  const padT = 14;
  const max = Math.max(...income, ...spent, 1);
  const chartW = w - padL - 16;
  const chartH = h - padT - padB;
  const groupW = chartW / months.length;
  const barW = Math.min(26, (groupW - 18) / 2);
  const y = (v) => padT + chartH - (v / max) * chartH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + chartH * (1 - f);
    return `<line x1="${padL}" y1="${gy}" x2="${w - 16}" y2="${gy}" class="grid-line"/>
      <text x="${padL - 8}" y="${gy + 4}" text-anchor="end" class="axis-label">${fmt(max * f)}</text>`;
  }).join('');
  const bars = months
    .map((m, i) => {
      const gx = padL + i * groupW + groupW / 2;
      return `<rect x="${gx - barW - 3}" y="${y(income[i])}" width="${barW}" height="${padT + chartH - y(income[i])}" rx="3" class="bar-income">
        <title>${m}: income ${fmt(income[i])}</title></rect>
      <rect x="${gx + 3}" y="${y(spent[i])}" width="${barW}" height="${padT + chartH - y(spent[i])}" rx="3" class="bar-spent">
        <title>${m}: spending ${fmt(spent[i])}</title></rect>
      <text x="${gx}" y="${h - 12}" text-anchor="middle" class="axis-label">${m}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Income and spending by month">
    ${grid}${bars}
    <line x1="${padL}" y1="${padT + chartH}" x2="${w - 16}" y2="${padT + chartH}" class="axis-line"/>
  </svg>`;
}

export function donutSlices(totals) {
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  return Object.entries(totals)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] ?? '#8a8a8a',
      pct: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
}
