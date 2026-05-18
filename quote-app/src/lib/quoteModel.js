// src/lib/quoteModel.js — quote/point/block factories + type metadata.

import { uid, todayStr } from './slug.js';

export const blockTypes = [
  { type: 'scope',           label: 'Scope (Tak / Nie)', color: 'blue' },
  { type: 'subsection',      label: 'Subsection (z podblokami)', color: 'blue' },
  { type: 'manpower',        label: 'Manpower (h × stawka)', color: 'gold' },
  { type: 'bullet',          label: 'Bullet list', color: 'navy' },
  { type: 'paragraph',       label: 'Paragraph', color: 'navy' },
  { type: 'budgetEstimate',  label: 'Budget Estimate', color: 'gold' },
  { type: 'totalFixedPrice', label: 'Total Fixed Price', color: 'navy' },
];

export const subBlockTypes = blockTypes.filter(b => b.type !== 'subsection');

/**
 * Factory for a new block of the given type.
 *
 * Shape notes vs. legacy (_legacy/index.html lines 471-489):
 *  - scope:          legacy used items:[{text,strike}]; we carry that shape forward
 *                    while also providing the `label` field used by renderers.
 *  - manpower rows:  legacy had {id,label,hours,discount,rate,total,auto}; we keep
 *                    all of those AND add formula:'' so modern code can use either path.
 *  - bullet:         legacy items were [{text,strike,bool}]; preserved here.
 *  - paragraph:      legacy default was 'Akapit tekstu.'; kept so existing docs render.
 *  - budgetEstimate: maps to legacy 'budget' type; carries all legacy fields
 *                    (workType, hours, rate, total, min, max) plus new label/note.
 */
export const newBlock = (type) => {
  const base = { id: uid(), type };
  switch (type) {
    case 'scope':
      return {
        ...base,
        color: 'blue',
        label: 'Encompassing arbetet',
        // Legacy shape: array of {text, strike} objects
        items: [{ text: 'Nytt arbetspunkt', strike: false }],
      };
    case 'subsection':
      return {
        ...base,
        color: 'blue',
        label: 'Arbetskostnader',
        price: '',
        oldPrice: '',
        children: [],
      };
    case 'manpower':
      return {
        ...base,
        color: 'gold',
        label: 'MANPOWER',
        rows: [
          {
            id: uid(),
            // Modern fields
            title: '',
            formula: '',
            // Legacy fields — preserved so old data and buildFormulaFromLegacy both work
            label: '',
            hours: '',
            discount: '',
            rate: '',
            total: '',
            auto: true,
          },
        ],
      };
    case 'bullet':
      return {
        ...base,
        color: 'navy',
        label: '',
        // Legacy shape: array of {text, strike, bold} objects
        items: [{ text: 'Punkt', strike: false, bold: false }],
      };
    case 'paragraph':
      return {
        ...base,
        color: 'navy',
        // Legacy default text preserved so existing docs render identically
        text: 'Akapit tekstu.',
      };
    case 'budgetEstimate':
      return {
        ...base,
        color: 'gold',
        label: 'Budgetestimat – Etapp',
        note: '',
        // Legacy 'budget' fields carried forward
        workType: 'Arbetskostnad',
        hours: '1000',
        rate: '650',
        total: '650 000',
        min: '605 000',
        max: '695 000',
        price: '',
      };
    case 'totalFixedPrice':
      return {
        ...base,
        color: 'navy',
        label: 'TOTAL FAST PRIS – ETAPP',
        price: '',
        oldPrice: '',
      };
    default:
      return base;
  }
};

export const blankPoint = (n) => ({
  id: uid(),
  title: n === 1 ? 'Kitchen Renovation' : `ETAPP ${n}: Ny etapp`,
  mainPrice: '',
  subtitle: '',
  blocks: [
    {
      id: uid(),
      type: 'subsection',
      color: 'blue',
      label: 'Labour costs',
      price: '',
      oldPrice: '',
      children: [],
    },
  ],
});

export const blankQuote = (slug, title) => ({
  meta: {
    slug,
    title: title || 'Ny offert',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  header: {
    offerNumber: '',
    date: todayStr(),
    customerName: '',
    customerAddress: '',
    projectName: '',
  },
  points: [blankPoint(1)],
  summary: {
    enabled: true,
    label: 'SUMMARY ALL POINTS',
    original: '',
    beforeROT: '',
    afterROT: '',
    taxMode: 'rot',     // 'rot' | 'rut' | 'none'
    extraInfo: '',      // yellow callout text below totals
  },
  optional: {
    enabled: false,
    oldPrice: '',
    newPrice: '',
    items: [],
  },
  otherCosts: {
    enabled: true,
    title: 'Tilläggsarbeten – timpriser (2026)',
    rows: [
      { item: 'Arbetstimme bygg', unit: 'timme', price: '650' },
      { item: 'Materialtransport 1x (Sprinter)', unit: 'tur', price: '1 500' },
      { item: 'Avfallstransport (1x Sprinter 5m³)', unit: 'plus deponifaktura/tur', price: '1 500' },
    ],
  },
  values: { enabled: true },
  terms: { enabled: true, validity: 30, paymentPolicy: '10 dagar' },
});
