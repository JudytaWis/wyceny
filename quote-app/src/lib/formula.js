// src/lib/formula.js — number parsing, formatting, formula evaluation, manpower row helpers.

export const parseNum = (v) => {
  if (v === '' || v === null || v === undefined) return 0;
  const cleaned = String(v).replace(/\s+/g, '').replace(/,/g, '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

export const formatNum = (n, decimals = 2) => {
  if (typeof n !== 'number' || isNaN(n)) return '';
  return n.toLocaleString('sv-SE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

/**
 * Build a formula string from legacy row fields (hours / discount / rate).
 * Legacy shape: { hours, discount, rate } — all optional strings.
 * Also handles the newer shape where qty/unit/rate exist.
 */
export const buildFormulaFromLegacy = (r) => {
  // New-style: qty + unit + rate
  if (r.qty != null && r.qty !== '') {
    const parts = [];
    if (r.qty != null && r.qty !== '') parts.push(String(r.qty));
    if (r.unit != null && r.unit !== '') parts.push(String(r.unit));
    if (r.rate != null && r.rate !== '') parts.push(String(r.rate));
    return parts.length > 0 ? parts.join(' × ') : '';
  }
  // Legacy-style: hours / discount / rate
  const h = (r.hours || '').toString().trim();
  const d = (r.discount || '').toString().trim();
  const rate = (r.rate || '').toString().trim();
  if (!h && !rate) return '';
  if (d && d !== '0') return `(${h} - ${d}) h × ${rate} kr`;
  return `${h} h × ${rate} kr`;
};

/**
 * Safely evaluate a formula string.
 * Supports × / x / * as multiplication, comma as decimal separator.
 * Rejects any input that contains non-numeric/operator characters.
 * Returns 0 on failure (never throws, never executes arbitrary code).
 */
export const computeFromFormula = (s) => {
  if (!s) return 0;
  const cleaned = String(s)
    .replace(/[×x*·]/gi, '*')
    .replace(/\s+/g, '')
    .replace(/,/g, '.');
  // safe-ish eval: only digits, operators, dots, parens
  if (!/^[\d+\-*/().]+$/.test(cleaned)) return 0;
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${cleaned})`)();
    return typeof v === 'number' && isFinite(v) ? v : 0;
  } catch (e) { return 0; }
};

export const computeRowTotal = (r) => computeFromFormula(r.formula);

/**
 * Returns array of rows for a manpower block.
 * Handles three schemas:
 *   1. Modern: block.rows[] where each row has .formula
 *   2. Legacy per-row: block.rows[] where each row has hours/discount/rate
 *   3. Legacy block-level: no rows array, fields on the block itself
 */
export const manpowerRows = (b) => {
  if (Array.isArray(b.rows) && b.rows.length > 0) {
    return b.rows.map(r => {
      if (r.formula != null) return r;
      return { ...r, formula: buildFormulaFromLegacy(r) };
    });
  }
  // Block-level legacy fallback
  return [{
    id: 'legacy',
    label: b.label || '',
    formula: buildFormulaFromLegacy(b),
    total: b.total || '',
    auto: b.auto !== false,
  }];
};

export const computeManpowerTotal = (b) => {
  return manpowerRows(b).reduce((s, r) => {
    // If auto is explicitly false, use stored total instead of formula
    if (r.auto === false) {
      return s + (parseNum(r.total) || 0);
    }
    return s + computeFromFormula(r.formula);
  }, 0);
};
