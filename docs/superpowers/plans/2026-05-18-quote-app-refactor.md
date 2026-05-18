# Quote-app refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rozbić `quote-app/index.html` (2028 linii, monolit React+Babel+CDN) na czystą strukturę plików z buildem Vite. Zamienić localStorage na pliki JSON w `quote-app/wyceny/`. Usunąć całkowicie publish/PDF/print. Zachować 1:1 wygląd i logikę edytora.

**Architecture:** Vite + React 18 + Tailwind 3 (jako proper build, nie CDN). Custom Vite plugin (`vite-plugin-wyceny.js`) udostępnia lokalne REST API (`/api/wyceny/...`) operujące na plikach w `quote-app/wyceny/`. Storage layer w apce używa `fetch()` zamiast `localStorage`. Migracja danych z `localStorage.bodo_quotes_v1` jednorazowo przy pierwszym starcie.

**Tech Stack:** Vite 5, React 18, Tailwind 3, pnpm, Node 24, JavaScript (ESM, brak TypeScript).

**Spec:** [`docs/superpowers/specs/2026-05-18-quote-app-refactor-design.md`](../specs/2026-05-18-quote-app-refactor-design.md)

**Verification model:** Brak automatycznych testów (user explicit). Każdy task ma manualny krok weryfikacji w `pnpm dev` lub `cat`. Po każdym tasku — commit (mały, atomowy).

---

## File structure (target)

```
quote-app/
├─ wyceny/                                  # NEW — gitignored
│   └─ alexander-mork-eidem-5c-2026.json    # moved from seeds/
├─ src/
│   ├─ main.jsx                             # NEW — entry, mounts App
│   ├─ App.jsx                              # NEW — root component
│   ├─ styles.css                           # NEW — Tailwind directives + custom CSS extracted from old <style>
│   ├─ components/
│   │   ├─ Sidebar.jsx                      # NEW
│   │   ├─ TopBar.jsx                       # NEW (simplified: Undo/Redo/PokażHTML only)
│   │   ├─ QuoteHeader.jsx                  # NEW
│   │   ├─ QuoteHeaderReadonly.jsx          # NEW
│   │   ├─ SummarySection.jsx               # NEW
│   │   ├─ OptionalSection.jsx              # NEW
│   │   ├─ TimelineRow.jsx                  # NEW
│   │   ├─ Point.jsx                        # NEW
│   │   ├─ pages/
│   │   │   ├─ CoverPage.jsx                # NEW
│   │   │   ├─ QuotePage.jsx                # NEW
│   │   │   ├─ OtherCostsPage.jsx           # NEW
│   │   │   ├─ ValuesPage.jsx               # NEW
│   │   │   └─ TermsPage.jsx                # NEW
│   │   ├─ blocks/
│   │   │   ├─ Block.jsx                    # NEW — dispatcher
│   │   │   ├─ BlockTools.jsx               # NEW
│   │   │   ├─ BlockAdder.jsx               # NEW
│   │   │   ├─ NestedBlockAdder.jsx         # NEW
│   │   │   ├─ ScopeBlock.jsx               # NEW
│   │   │   ├─ SubsectionBlock.jsx          # NEW
│   │   │   ├─ ManpowerBlock.jsx            # NEW
│   │   │   ├─ BulletBlock.jsx              # NEW
│   │   │   ├─ ParagraphBlock.jsx           # NEW
│   │   │   ├─ BudgetBlock.jsx              # NEW
│   │   │   └─ TotalFixedPriceBlock.jsx     # NEW
│   │   └─ shared/
│   │       ├─ EditableText.jsx             # NEW
│   │       ├─ BodoLogo.jsx                 # NEW
│   │       ├─ Icon.jsx                     # NEW
│   │       └─ PageFooter.jsx               # NEW
│   └─ lib/
│       ├─ quoteModel.js                    # NEW — blankQuote, blankPoint, newBlock, blockTypes, subBlockTypes
│       ├─ formula.js                       # NEW — parseNum, formatNum, computeFromFormula, etc.
│       ├─ slug.js                          # NEW — slugify, getQuoteFromURL, setQuoteInURL, todayStr, uid
│       ├─ storage.js                       # NEW — list/get/put/delete via /api/wyceny
│       ├─ migration.js                     # NEW — one-shot localStorage → files
│       └─ buildStandaloneHTML.js           # NEW — for "Pokaż HTML" (stripped of publish/PDF bits)
├─ vite-plugin-wyceny.js                    # NEW — REST API for wyceny/*.json
├─ vite.config.js                           # NEW
├─ tailwind.config.js                       # NEW
├─ postcss.config.js                        # NEW
├─ package.json                             # NEW
├─ index.html                               # REWRITTEN — shell only (<div id="root"></div> + module script)
├─ .gitignore                               # MODIFY — add quote-app/wyceny/
├─ public/                                  # UNTOUCHED (legacy)
├─ assets/                                  # UNTOUCHED
├─ seeds/                                   # DELETED at end (after move to wyceny/)
├─ import-alexander.html                    # UNTOUCHED (legacy import tools)
├─ import-alexander-5C.html                 # UNTOUCHED
└─ wycena-A-print.html                      # UNTOUCHED
```

**Original `quote-app/index.html`** zostaje skopiowany do `quote-app/_legacy/index.html` jako referencja PRZED nadpisaniem, na wypadek gdyby trzeba było coś zerknąć. Folder `_legacy/` w .gitignore na 1 commit, potem usuwamy po zakończeniu refaktoru.

---

## Task 1: Bootstrap Vite + Tailwind (scaffold)

**Files:**
- Create: `quote-app/package.json`
- Create: `quote-app/vite.config.js`
- Create: `quote-app/tailwind.config.js`
- Create: `quote-app/postcss.config.js`
- Create: `quote-app/src/main.jsx`
- Create: `quote-app/src/App.jsx`
- Create: `quote-app/src/styles.css`
- Modify: `quote-app/index.html` → kopia do `quote-app/_legacy/index.html` + nowy shell
- Modify: `quote-app/.gitignore` (lub utwórz `.gitignore` w root jeśli nie ma → dodaj `quote-app/_legacy/`)

- [ ] **Step 1: Skopiuj obecny index.html do _legacy**

```bash
mkdir -p quote-app/_legacy
cp quote-app/index.html quote-app/_legacy/index.html
```

- [ ] **Step 2: Dodaj _legacy do .gitignore**

Edit `.gitignore` w root repo (utwórz jeśli nie istnieje):

```
# Legacy file kept locally during refactor — delete at end of refactor
quote-app/_legacy/
```

- [ ] **Step 3: Utwórz `quote-app/package.json`**

```json
{
  "name": "bodo-quote-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 4: Utwórz `quote-app/vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wycenyPlugin } from './vite-plugin-wyceny.js';

export default defineConfig({
  plugins: [react(), wycenyPlugin()],
  server: {
    port: 5173,
    open: true,
  },
});
```

- [ ] **Step 5: Utwórz `quote-app/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Utwórz `quote-app/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 7: Utwórz `quote-app/src/styles.css`** — tymczasowo tylko dyrektywy Tailwinda. Custom CSS z `<style>` w `_legacy/index.html` (linie 13-129) dokleimy w późniejszym tasku.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS will be moved here from _legacy/index.html in Task 5 */
```

- [ ] **Step 8: Utwórz tymczasowy stub `vite-plugin-wyceny.js`** (żeby vite.config.js się sparsował — pełna implementacja w Task 2)

```js
// vite-plugin-wyceny.js — placeholder. Real implementation in Task 2.
export function wycenyPlugin() {
  return { name: 'wyceny-plugin-stub' };
}
```

- [ ] **Step 9: Utwórz `quote-app/src/main.jsx`**

```jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
```

- [ ] **Step 10: Utwórz `quote-app/src/App.jsx`** — tymczasowy "Hello"

```jsx
export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold text-[#2A3978]">BODO Quote-app — refactor scaffold</h1>
      <p className="text-gray-500 mt-4">Jeśli to widzisz, Vite + React + Tailwind działa.</p>
    </div>
  );
}
```

- [ ] **Step 11: Nadpisz `quote-app/index.html` shellem**

```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BODO · Offert Generator</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 12: Install + run dev**

```bash
cd quote-app && pnpm install
pnpm dev
```

Otwiera `http://localhost:5173`. Spodziewane: napis "BODO Quote-app — refactor scaffold" na szarym tle, font Montserrat, kolor `#2A3978`. Brak błędów w konsoli.

- [ ] **Step 13: Verify & commit**

```bash
git add quote-app/package.json quote-app/vite.config.js quote-app/tailwind.config.js \
        quote-app/postcss.config.js quote-app/vite-plugin-wyceny.js \
        quote-app/src/main.jsx quote-app/src/App.jsx quote-app/src/styles.css \
        quote-app/index.html .gitignore
git commit -m "refactor(quote-app): bootstrap Vite + React + Tailwind scaffold"
```

`pnpm-lock.yaml` po `pnpm install` — committed razem.

---

## Task 2: Implementacja `vite-plugin-wyceny.js` (REST API)

**Files:**
- Modify: `quote-app/vite-plugin-wyceny.js` (zastąp stub pełną implementacją)

- [ ] **Step 1: Napisz plugin**

```js
// vite-plugin-wyceny.js
// Local REST API for quote-app/wyceny/*.json files.
// Dev-only — operates on the filesystem via Node fs.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WYCENY_DIR = path.resolve(__dirname, 'wyceny');
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;

async function ensureDir() {
  await fs.mkdir(WYCENY_DIR, { recursive: true });
}

function send(res, status, body, contentType = 'application/json; charset=utf-8') {
  res.statusCode = status;
  if (body == null) {
    res.end();
    return;
  }
  res.setHeader('Content-Type', contentType);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; if (raw.length > 5_000_000) reject(new Error('body too large')); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : null); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export function wycenyPlugin() {
  return {
    name: 'wyceny-plugin',
    configureServer(server) {
      server.middlewares.use('/api/wyceny', async (req, res, next) => {
        try {
          await ensureDir();
          const url = new URL(req.url, 'http://localhost');
          const parts = url.pathname.split('/').filter(Boolean); // [] for /api/wyceny, ['slug'] for /api/wyceny/slug
          const slug = parts[0];

          // GET /api/wyceny — list slugs
          if (req.method === 'GET' && !slug) {
            const files = await fs.readdir(WYCENY_DIR);
            const slugs = files.filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''));
            return send(res, 200, slugs);
          }

          if (!slug || !SLUG_RE.test(slug)) return send(res, 400, { error: 'invalid slug' });
          const filepath = path.join(WYCENY_DIR, `${slug}.json`);

          if (req.method === 'GET') {
            try {
              const raw = await fs.readFile(filepath, 'utf8');
              return send(res, 200, raw); // already JSON string
            } catch (e) {
              if (e.code === 'ENOENT') return send(res, 404, { error: 'not found' });
              throw e;
            }
          }

          if (req.method === 'PUT') {
            const body = await readJsonBody(req);
            if (!body || typeof body !== 'object') return send(res, 400, { error: 'invalid JSON body' });
            await fs.writeFile(filepath, JSON.stringify(body, null, 2) + '\n', 'utf8');
            return send(res, 204, null);
          }

          if (req.method === 'DELETE') {
            try {
              await fs.unlink(filepath);
              return send(res, 204, null);
            } catch (e) {
              if (e.code === 'ENOENT') return send(res, 404, { error: 'not found' });
              throw e;
            }
          }

          return send(res, 405, { error: 'method not allowed' });
        } catch (err) {
          console.error('[wyceny-plugin]', err);
          return send(res, 500, { error: err.message });
        }
      });
    },
  };
}
```

- [ ] **Step 2: Restart dev + ręczny test API**

W jednym terminalu: `cd quote-app && pnpm dev`. W drugim:

```bash
# 1) Folder pusty — lista powinna być []
curl -s http://localhost:5173/api/wyceny
# Expected: []

# 2) Zapis testowy
curl -s -X PUT http://localhost:5173/api/wyceny/test-slug \
  -H 'Content-Type: application/json' \
  -d '{"meta":{"slug":"test-slug","title":"Test"}}' -w '\nHTTP:%{http_code}\n'
# Expected: HTTP:204

# 3) Lista
curl -s http://localhost:5173/api/wyceny
# Expected: ["test-slug"]

# 4) Plik na dysku
cat quote-app/wyceny/test-slug.json
# Expected: pretty JSON z meta.slug

# 5) GET
curl -s http://localhost:5173/api/wyceny/test-slug
# Expected: ten sam JSON

# 6) DELETE
curl -s -X DELETE http://localhost:5173/api/wyceny/test-slug -w '\nHTTP:%{http_code}\n'
# Expected: HTTP:204

# 7) 404
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/api/wyceny/test-slug
# Expected: 404

# 8) Slug walidacja
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/api/wyceny/../etc-passwd
# Expected: 400 albo 404 (Vite rozparsuje URL i odetnie traversal)
```

- [ ] **Step 3: Dodaj `wyceny/` do `.gitignore`** (root repo)

Append:

```
# Quote-app data files — local-only, contain customer info
quote-app/wyceny/
```

- [ ] **Step 4: Commit**

```bash
git add quote-app/vite-plugin-wyceny.js .gitignore
git commit -m "feat(quote-app): vite plugin with REST API for wyceny/*.json"
```

---

## Task 3: Czysta logika do `src/lib/` (slug, formula, quoteModel)

Wyciągamy 3 pure-logic moduły z `_legacy/index.html`. Bez React, bez UI — tylko funkcje.

**Files:**
- Create: `quote-app/src/lib/slug.js`
- Create: `quote-app/src/lib/formula.js`
- Create: `quote-app/src/lib/quoteModel.js`

- [ ] **Step 1: `src/lib/slug.js`** — kopia z `_legacy/index.html` linie 195-200, 213-218, 282-291

```js
// src/lib/slug.js — URL routing + slugify + ID helpers.

export const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || ('quote-' + Date.now().toString(36));

export const todayStr = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

export const uid = () => 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const getQuoteFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('quote');
};

export const setQuoteInURL = (slug) => {
  const u = new URL(window.location.href);
  if (slug) u.searchParams.set('quote', slug);
  else u.searchParams.delete('quote');
  window.history.replaceState({}, '', u);
};
```

**Uwaga:** w oryginale linia 197 ma znak unicode w regex (`[̀-ͯ]` jako combining marks). W naszej wersji używamy bezpiecznego `̀-ͯ` — to ten sam zakres, ale jako escape sequence (bezpieczniejsze przy ewentualnym przeszlościowaniu w toolingu).

- [ ] **Step 2: `src/lib/formula.js`** — kopia z `_legacy/index.html` linie 491-557

```js
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

export const buildFormulaFromLegacy = (r) => {
  const parts = [];
  if (r.qty != null && r.qty !== '') parts.push(String(r.qty));
  if (r.unit != null && r.unit !== '') parts.push(String(r.unit));
  if (r.rate != null && r.rate !== '') parts.push(String(r.rate));
  return parts.length > 0 ? parts.join(' × ') : '';
};

export const computeFromFormula = (s) => {
  if (!s) return 0;
  const cleaned = String(s)
    .replace(/[×x*]/gi, '*')
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

export const manpowerRows = (b) => {
  if (!Array.isArray(b.rows)) return [];
  return b.rows.map(r => {
    if (r.formula) return r;
    const formula = buildFormulaFromLegacy(r);
    return { ...r, formula };
  });
};

export const computeManpowerTotal = (b) => {
  return manpowerRows(b).reduce((s, r) => {
    return s + computeFromFormula(r.formula);
  }, 0);
};
```

**Verify**: open node REPL —

```bash
cd quote-app && node -e "
import('./src/lib/formula.js').then(m => {
  console.log('parseNum(\"1 234,56\") =', m.parseNum('1 234,56'));  // 1234.56
  console.log('formatNum(1234.5) =', m.formatNum(1234.5));            // '1 234,50' (sv-SE)
  console.log('computeFromFormula(\"3 × 50 + 20\") =', m.computeFromFormula('3 × 50 + 20'));  // 170
  console.log('computeFromFormula(\"alert(1)\") =', m.computeFromFormula('alert(1)'));         // 0
});
"
```

- [ ] **Step 3: `src/lib/quoteModel.js`** — kopia z `_legacy/index.html` linie 220-277, 453-489

```js
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

export const newBlock = (type) => {
  const base = { id: uid(), type };
  switch (type) {
    case 'scope':
      return { ...base, color: 'blue', label: '', rows: [] };
    case 'subsection':
      return { ...base, color: 'blue', label: '', price: '', oldPrice: '', children: [] };
    case 'manpower':
      return { ...base, color: 'gold', label: '', rows: [{ id: uid(), title: '', formula: '' }] };
    case 'bullet':
      return { ...base, color: 'navy', label: '', items: [''] };
    case 'paragraph':
      return { ...base, color: 'navy', text: '' };
    case 'budgetEstimate':
      return { ...base, color: 'gold', label: '', price: '', note: '' };
    case 'totalFixedPrice':
      return { ...base, color: 'navy', label: '', price: '', oldPrice: '' };
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
```

**Uwaga**: oryginał miał `newBlock` w lekko innej formie (linie 471-489). Powyższa wersja jest **bardziej kompletna** — dla każdego typu zwraca minimalnie wszystkie pola, których wymaga renderer. Jeśli któryś typ ma dodatkowe pola w `_legacy/index.html`, dopisać. (Sprawdzić sekcje od linii 583 do 891 podczas Task 7.)

- [ ] **Step 4: Commit**

```bash
git add quote-app/src/lib/
git commit -m "refactor(quote-app): extract pure logic to src/lib/ (slug, formula, quoteModel)"
```

---

## Task 4: Storage layer (`storage.js`) + migracja (`migration.js`)

**Files:**
- Create: `quote-app/src/lib/storage.js`
- Create: `quote-app/src/lib/migration.js`

- [ ] **Step 1: `src/lib/storage.js`**

```js
// src/lib/storage.js — REST client for /api/wyceny.

const API = '/api/wyceny';

export const storage = {
  async list() {
    const r = await fetch(API);
    if (!r.ok) throw new Error(`list failed: ${r.status}`);
    return r.json();
  },
  async get(slug) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`);
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`get(${slug}) failed: ${r.status}`);
    return r.json();
  },
  async put(slug, quote) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (!r.ok) throw new Error(`put(${slug}) failed: ${r.status}`);
  },
  async delete(slug) {
    const r = await fetch(`${API}/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    if (r.status === 404) return;
    if (!r.ok) throw new Error(`delete(${slug}) failed: ${r.status}`);
  },
  async loadAll() {
    const slugs = await this.list();
    const entries = await Promise.all(slugs.map(async (s) => [s, await this.get(s)]));
    const out = {};
    for (const [s, q] of entries) if (q) out[s] = q;
    return out;
  },
};
```

- [ ] **Step 2: `src/lib/migration.js`**

```js
// src/lib/migration.js — one-shot import from localStorage.bodo_quotes_v1 to filesystem.

import { storage } from './storage.js';

const LEGACY_KEY = 'bodo_quotes_v1';
const MIGRATION_DONE_KEY = 'bodo_migration_to_files_done_v1';

export async function migrateLocalStorageIfNeeded() {
  if (typeof window === 'undefined') return { migrated: 0, skipped: true };
  if (localStorage.getItem(MIGRATION_DONE_KEY) === '1') return { migrated: 0, skipped: true };

  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATION_DONE_KEY, '1');
    return { migrated: 0, skipped: true };
  }

  let data;
  try { data = JSON.parse(raw); } catch (e) { return { migrated: 0, skipped: true, error: 'invalid JSON in localStorage' }; }
  if (!data || typeof data !== 'object') return { migrated: 0, skipped: true };

  const existing = await storage.list();
  const existingSet = new Set(existing);

  let migrated = 0;
  for (const [slug, quote] of Object.entries(data)) {
    if (existingSet.has(slug)) continue; // never overwrite existing file
    if (!quote || typeof quote !== 'object') continue;
    await storage.put(slug, quote);
    migrated++;
  }

  localStorage.setItem(MIGRATION_DONE_KEY, '1');
  // intentionally DO NOT clear LEGACY_KEY — leave as belt-and-suspenders backup
  return { migrated, skipped: false };
}
```

- [ ] **Step 3: Manualny test storage w przeglądarce (DevTools console)**

W dev serwerze (`pnpm dev`), otwórz konsolę i wklej:

```js
const m = await import('/src/lib/storage.js');
await m.storage.put('manual-test', { meta: { slug: 'manual-test', title: 'CLI test' }, foo: 'bar' });
console.log(await m.storage.list());       // includes 'manual-test'
console.log(await m.storage.get('manual-test')); // full object
await m.storage.delete('manual-test');
console.log(await m.storage.list());       // no 'manual-test'
```

- [ ] **Step 4: Commit**

```bash
git add quote-app/src/lib/storage.js quote-app/src/lib/migration.js
git commit -m "feat(quote-app): storage layer + localStorage->files migration helper"
```

---

## Task 5: CSS — przenieś custom style z `_legacy/index.html`

**Files:**
- Modify: `quote-app/src/styles.css` — dopisz custom CSS z `_legacy/index.html` (między `<style>` linie 13-129 + całe `@media print { ... }` linie 73-129).

- [ ] **Step 1: Skopiuj custom CSS**

Otwórz `quote-app/_legacy/index.html` linie 13-129. Skopiuj zawartość `<style>` (BEZ tagów `<style>...</style>`) do `quote-app/src/styles.css` **PO** dyrektywach Tailwinda.

Wynik powinien wyglądać tak (skrót):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bodo-blue: #5498D9;
  --bodo-navy: #2A3978;
  --bodo-gold: #A49251;
  --bodo-gold-light: #D8D0B3;
  --bodo-dark: #1A1A1A;
  --bodo-accent-purple: #6366F1;
}
html, body { font-family: 'Montserrat', system-ui, sans-serif; background: #F3F4F6; }
.doc-page, .doc-page * { font-family: 'Montserrat', system-ui, sans-serif !important; }
/* ... pozostałe reguły 1:1 z _legacy/index.html linie 22-129 ... */
@media print {
  /* ... */
}
```

- [ ] **Step 2: Sprawdź w przeglądarce**

`pnpm dev` musi nadal działać bez błędów. `console` w DevTools — brak warningów CSS. Strona dalej pokazuje "BODO Quote-app — refactor scaffold".

- [ ] **Step 3: Commit**

```bash
git add quote-app/src/styles.css
git commit -m "refactor(quote-app): move custom CSS from monolith to styles.css"
```

---

## Task 6: Shared components (`Icon`, `BodoLogo`, `EditableText`, `PageFooter`)

**Files:**
- Create: `quote-app/src/components/shared/Icon.jsx`
- Create: `quote-app/src/components/shared/BodoLogo.jsx`
- Create: `quote-app/src/components/shared/EditableText.jsx`
- Create: `quote-app/src/components/shared/PageFooter.jsx`

- [ ] **Step 1: `Icon.jsx`** — kopia z `_legacy/index.html` linie 175-188 (cały obiekt `Icon`)

```jsx
// src/components/shared/Icon.jsx
export const Icon = {
  Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  Trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>),
  Edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Print: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>),
  Save: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  Doc: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  Copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>),
  ArrowUp: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 19V5M5 12l7-7 7 7"/></svg>),
  ArrowDown: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>),
  Eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Strike: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16"/></svg>),
  Star: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>),
};
```

- [ ] **Step 2: `BodoLogo.jsx`** — kopia z `_legacy/index.html` linie 143-148 (tylko `BodoLogo`, NIE `_BodoLogoInline`)

```jsx
// src/components/shared/BodoLogo.jsx
export const BodoLogo = ({ size = 'md', className = '', variant = 'onWhite' }) => {
  const heights = { sm: 28, md: 42, lg: 72, xl: 110 };
  const h = heights[size] || 42;
  const src = variant === 'onDark' ? '/assets/bodo-logo-on-dark.svg' : '/assets/bodo-logo-on-white.svg';
  return <img src={src} alt="BODO Build & Track AB" style={{ height: h }} className={className} />;
};
```

**Uwaga**: zmiana `assets/...` → `/assets/...` (root-absolute). Vite serwuje `quote-app/assets/...` jako static — TYLKO jeśli folder jest pod `public/`. Sprawdź w Step 5 czy trzeba przenieść.

- [ ] **Step 3: `EditableText.jsx`** — kopia z `_legacy/index.html` linie 296-322

```jsx
// src/components/shared/EditableText.jsx
import { useEffect, useRef } from 'react';

export const EditableText = ({ value, onChange, placeholder = '', className = '', as: As = 'span', multiline = false, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  return (
    <As
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      style={style}
      onBlur={(e) => onChange(e.target.innerText)}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      }}
    />
  );
};
```

- [ ] **Step 4: `PageFooter.jsx`** — kopia z `_legacy/index.html` linie 324-329

```jsx
// src/components/shared/PageFooter.jsx
export const PageFooter = ({ num, total }) => (
  <div className="page-number">
    {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);
```

- [ ] **Step 5: Naprawa ścieżki do assets**

Vite serwuje `public/` jako static root (`/`). Logo siedzi w `quote-app/assets/`, NIE w `public/`. Mamy 2 opcje:
  - **(A)** Przenieść `quote-app/assets/` do `quote-app/public/assets/` → `<img src="/assets/...">` działa
  - **(B)** Import logo jako moduł: `import logoOnWhite from '../../../assets/bodo-logo-on-white.svg'`

Wybieramy **(A)** — prostsze, działa też w buildzie i w innych miejscach (cover images).

```bash
mkdir -p quote-app/public/assets
git mv quote-app/assets/bodo-logo-on-white.svg quote-app/public/assets/
git mv quote-app/assets/bodo-logo-on-dark.svg quote-app/public/assets/
git mv quote-app/assets/bodo-logo.svg quote-app/public/assets/
git mv quote-app/assets/cover quote-app/public/assets/cover
rmdir quote-app/assets
```

**Uwaga**: `quote-app/public/` jest już używane jako deploy target dla Vercela (folder z `index.html` redirectem + `alexander-mork-eidem-5c-2026.html`). Ale **Vite traktuje `public/` jako static root automatycznie**. Te legacy pliki nadal tam będą — Vite je zaserwuje jako `/index.html` i `/alexander-...html`. To NIEporządane bo Vite ma własny `index.html`. → **Trzeba przenieść legacy `public/index.html` i `public/alexander-...html` do `_legacy/`**:

```bash
mkdir -p quote-app/_legacy/published
git mv quote-app/public/index.html quote-app/_legacy/published/index.html
git mv quote-app/public/alexander-mork-eidem-5c-2026.html quote-app/_legacy/published/alexander-mork-eidem-5c-2026.html
```

Po tym `quote-app/public/` zawiera tylko `assets/`.

- [ ] **Step 6: Restart `pnpm dev`, otwórz `http://localhost:5173/assets/bodo-logo-on-white.svg`**

Spodziewane: SVG ładuje się w przeglądarce.

- [ ] **Step 7: Commit**

```bash
git add quote-app/src/components/shared/ quote-app/public/ quote-app/_legacy/
git commit -m "refactor(quote-app): extract shared components (Icon, BodoLogo, EditableText, PageFooter)"
```

---

## Task 7: Block components (12 plików)

To największy task. Wszystkie bloki zachowują się 1:1 jak w `_legacy/index.html`. Wyciągnijmy je razem, bo są ze sobą sprzężone (`Block` dispatcher woła konkretne typy).

**Files:**
- Create: `quote-app/src/components/blocks/Block.jsx` — dispatcher, linie 560-572
- Create: `quote-app/src/components/blocks/BlockTools.jsx` — linie 574-581
- Create: `quote-app/src/components/blocks/ScopeBlock.jsx` — linie 583-618
- Create: `quote-app/src/components/blocks/SubsectionBlock.jsx` — linie 620-704
- Create: `quote-app/src/components/blocks/NestedBlockAdder.jsx` — linie 706-728
- Create: `quote-app/src/components/blocks/ManpowerBlock.jsx` — linie 730-803
- Create: `quote-app/src/components/blocks/BulletBlock.jsx` — linie 805-837
- Create: `quote-app/src/components/blocks/ParagraphBlock.jsx` — linie 839-851
- Create: `quote-app/src/components/blocks/TotalFixedPriceBlock.jsx` — linie 853-866
- Create: `quote-app/src/components/blocks/BudgetBlock.jsx` — linie 868-890
- Create: `quote-app/src/components/blocks/BlockAdder.jsx` — linie 973-1001

- [ ] **Step 1: Procedura ekstrakcji (dla KAŻDEGO pliku)**

Dla każdego komponentu:

1. Otwórz `quote-app/_legacy/index.html` na wskazanych liniach
2. Skopiuj kod (od `const ComponentName = ...` do najbliższego `};`)
3. Wklej do nowego pliku JSX
4. Na górze pliku dodaj importy:
   - React hooks używane przez komponent: `import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';` (zostaw tylko te które są używane)
   - `Icon` z `'../shared/Icon.jsx'` jeśli używa
   - `EditableText` z `'../shared/EditableText.jsx'` jeśli używa
   - Inne block components z `'./XBlock.jsx'`
   - `parseNum`, `formatNum`, `computeFromFormula`, `computeRowTotal`, `manpowerRows`, `computeManpowerTotal` z `'../../lib/formula.js'`
   - `newBlock`, `subBlockTypes` z `'../../lib/quoteModel.js'`
   - `uid` z `'../../lib/slug.js'`
5. Zmień `const X =` na `export const X =`
6. Zapisz

- [ ] **Step 2: `Block.jsx` — dispatcher**

```jsx
// src/components/blocks/Block.jsx
import { ScopeBlock } from './ScopeBlock.jsx';
import { SubsectionBlock } from './SubsectionBlock.jsx';
import { ManpowerBlock } from './ManpowerBlock.jsx';
import { BulletBlock } from './BulletBlock.jsx';
import { ParagraphBlock } from './ParagraphBlock.jsx';
import { TotalFixedPriceBlock } from './TotalFixedPriceBlock.jsx';
import { BudgetBlock } from './BudgetBlock.jsx';

export const Block = ({ block, onChange, onDelete, onMove }) => {
  const props = { block, set: onChange, onDelete, onMove };
  switch (block.type) {
    case 'scope':           return <ScopeBlock {...props} />;
    case 'subsection':      return <SubsectionBlock {...props} />;
    case 'manpower':        return <ManpowerBlock {...props} />;
    case 'bullet':          return <BulletBlock {...props} />;
    case 'paragraph':       return <ParagraphBlock {...props} />;
    case 'totalFixedPrice': return <TotalFixedPriceBlock {...props} />;
    case 'budgetEstimate':  return <BudgetBlock {...props} />;
    default:                return null;
  }
};
```

Ten dispatcher musi pasować do tego co jest w `_legacy/index.html` linie 560-572. Po wklejeniu — porównaj że obsługuje WSZYSTKIE typy z `blockTypes`.

- [ ] **Step 3: `BlockTools.jsx`**

```jsx
// src/components/blocks/BlockTools.jsx
import { Icon } from '../shared/Icon.jsx';

export const BlockTools = ({ onDelete, onMove }) => (
  // ... 1:1 z _legacy/index.html linii 574-581
);
```

(Wstaw realną zawartość z `_legacy/index.html`.)

- [ ] **Step 4-12: Pozostałe komponenty blokowe**

Wykonaj procedurę z Step 1 dla każdego: ScopeBlock, SubsectionBlock, NestedBlockAdder, ManpowerBlock, BulletBlock, ParagraphBlock, TotalFixedPriceBlock, BudgetBlock, BlockAdder.

**Pułapka 1**: `SubsectionBlock` używa `Block` (dla swoich children) — to circular import. Rozwiązanie: w `SubsectionBlock.jsx` importuj `Block` z `'./Block.jsx'` — ESM obsłuży cycle, bo Block używa SubsectionBlock przez import, ale wywołuje go dopiero w runtime.

**Pułapka 2**: `BlockAdder` (linie 973-1001) i `NestedBlockAdder` (linie 706-728) korzystają z `blockTypes`/`subBlockTypes`. Importuj z `quoteModel.js`.

- [ ] **Step 13: Tymczasowy test — wyrenderuj jeden Block**

W `quote-app/src/App.jsx` chwilowo wklej:

```jsx
import { newBlock } from './lib/quoteModel.js';
import { Block } from './components/blocks/Block.jsx';
import { useState } from 'react';

export default function App() {
  const [b, setB] = useState(newBlock('paragraph'));
  return (
    <div className="p-8">
      <Block block={b} onChange={setB} onDelete={() => {}} onMove={() => {}} />
      <pre className="mt-4 bg-gray-100 p-2 text-xs">{JSON.stringify(b, null, 2)}</pre>
    </div>
  );
}
```

`pnpm dev`. Spodziewane: render edytowalnego paragrafu. Wpisz tekst → JSON-dump pod spodem odzwierciedla zmianę. Zmień typ na `'manpower'` — pokazuje się tabela z rzędem. Test kolejno każdego typu.

**WAŻNE**: ten App.jsx jest TYMCZASOWY tylko do tego task — w Task 11 całkowicie go nadpiszemy.

- [ ] **Step 14: Commit**

```bash
git add quote-app/src/components/blocks/
git commit -m "refactor(quote-app): extract 11 block components from monolith"
```

---

## Task 8: Sections components (`QuoteHeader`, `Summary`, `Optional`, `TimelineRow`, `Point`)

**Files:**
- Create: `quote-app/src/components/QuoteHeader.jsx` — linie 414-451
- Create: `quote-app/src/components/QuoteHeaderReadonly.jsx` — linie 1165-1176
- Create: `quote-app/src/components/SummarySection.jsx` — linie 1003-1075
- Create: `quote-app/src/components/OptionalSection.jsx` — linie 1077-1130
- Create: `quote-app/src/components/TimelineRow.jsx` — linie 892-908
- Create: `quote-app/src/components/Point.jsx` — linie 910-971

- [ ] **Step 1: Ekstrakcja każdego komponentu**

Procedura jak w Task 7 Step 1 — kopiuj, dodaj importy, dodaj `export`.

Wymagane importy:
- React hooks
- `Icon`, `EditableText` z `shared/`
- `Block`, `BlockAdder` z `blocks/`
- `parseNum`, `formatNum`, `computeFromFormula` z `lib/formula.js`
- `newBlock` z `lib/quoteModel.js`
- `uid` z `lib/slug.js`

- [ ] **Step 2: Smoke test**

Tymczasowo w `App.jsx`:

```jsx
import { blankQuote } from './lib/quoteModel.js';
import { QuoteHeader } from './components/QuoteHeader.jsx';

export default function App() {
  const [q, setQ] = useState(blankQuote('test', 'Test'));
  return <QuoteHeader header={q.header} setHeader={(h) => setQ({ ...q, header: h })} />;
}
```

Otwórz w przeglądarce, edytuj pola, sprawdź. Powtórz dla `SummarySection`, `OptionalSection`, `Point`.

- [ ] **Step 3: Commit**

```bash
git add quote-app/src/components/QuoteHeader.jsx \
        quote-app/src/components/QuoteHeaderReadonly.jsx \
        quote-app/src/components/SummarySection.jsx \
        quote-app/src/components/OptionalSection.jsx \
        quote-app/src/components/TimelineRow.jsx \
        quote-app/src/components/Point.jsx
git commit -m "refactor(quote-app): extract section components (Header, Summary, Optional, Timeline, Point)"
```

---

## Task 9: Page components (5 stron)

**Files:**
- Create: `quote-app/src/components/pages/CoverPage.jsx` — linie 331-412
- Create: `quote-app/src/components/pages/QuotePage.jsx` — linie 1284-1343
- Create: `quote-app/src/components/pages/OtherCostsPage.jsx` — linie 1132-1163
- Create: `quote-app/src/components/pages/ValuesPage.jsx` — linie 1178-1222
- Create: `quote-app/src/components/pages/TermsPage.jsx` — linie 1224-1282

- [ ] **Step 1: Ekstrakcja każdej strony**

Procedura jak w Task 7 Step 1.

Wymagane importy:
- React hooks
- `BodoLogo`, `Icon`, `EditableText`, `PageFooter` z `shared/`
- `QuoteHeader`, `QuoteHeaderReadonly`, `SummarySection`, `OptionalSection`, `TimelineRow`, `Point` z `components/`
- `parseNum`, `formatNum`, `computeFromFormula` z `lib/formula.js`
- `newBlock` z `lib/quoteModel.js`
- `uid` z `lib/slug.js`

**Uwaga (CoverPage)**: w `_legacy/index.html` cover używa zdjęć `assets/cover/1-kitchen.webp`, itd. Po Task 6 Step 5 są pod `quote-app/public/assets/cover/`. Vite serwuje to jako `/assets/cover/1-kitchen.webp`. **Sprawdź ścieżki w skopiowanym kodzie — jeśli są `assets/cover/...` (bez slasha) — popraw na `/assets/cover/...`.**

- [ ] **Step 2: Smoke test każdej strony**

W `App.jsx`:

```jsx
import { CoverPage } from './components/pages/CoverPage.jsx';
import { blankQuote } from './lib/quoteModel.js';

export default function App() {
  return <CoverPage pageNum={1} totalPages={5} />;
}
```

Sprawdź wizualnie. Powtórz dla pozostałych stron (`QuotePage` wymaga `quote` i `setQuote`).

- [ ] **Step 3: Commit**

```bash
git add quote-app/src/components/pages/
git commit -m "refactor(quote-app): extract page components (Cover, Quote, OtherCosts, Values, Terms)"
```

---

## Task 10: Sidebar component

**Files:**
- Create: `quote-app/src/components/Sidebar.jsx` — linie 1345-1483

- [ ] **Step 1: Ekstrakcja**

Skopiuj cały `Sidebar` z `_legacy/index.html` linie 1345-1483.

Importy:
- React hooks (głównie `useState`)
- `Icon`, `BodoLogo` z `shared/`

**Uwaga**: w oryginale Sidebar woła `onRename`, `onTogglePage`, `onExportAll`, `onImportAll`, ale w App props są: `onRename`, `onTogglePage`, `onExportAll`, `onImportAll` — sprawdź wszystkie propsy. Jeśli czegoś brakuje (np. `onRename` nie jest przekazywany z App — sprawdź linie 1966-1977), w Task 11 wire-up musimy to dodać.

- [ ] **Step 2: Smoke test**

```jsx
import { Sidebar } from './components/Sidebar.jsx';
import { blankQuote } from './lib/quoteModel.js';

export default function App() {
  const quotes = { 'foo': blankQuote('foo', 'Foo'), 'bar': blankQuote('bar', 'Bar') };
  return <Sidebar quotes={quotes} currentSlug="foo" onSelect={() => {}} onNew={() => {}} onDelete={() => {}} onDuplicate={() => {}} onTogglePage={() => {}} onExportAll={() => {}} onImportAll={() => {}} quote={quotes.foo} />;
}
```

Spodziewane: lista 2 wycen, aktywna `foo`, klik na "+ Nowa" robi nic (no-op handlery).

- [ ] **Step 3: Commit**

```bash
git add quote-app/src/components/Sidebar.jsx
git commit -m "refactor(quote-app): extract Sidebar component"
```

---

## Task 11: TopBar (uproszczony) + `buildStandaloneHTML` + "Pokaż HTML"

**Files:**
- Create: `quote-app/src/components/TopBar.jsx` — uproszczona wersja
- Create: `quote-app/src/lib/buildStandaloneHTML.js` — z `_legacy/index.html` linie 1454-1505
- Create: `quote-app/src/lib/openAsURL.js` — `openQuoteAsURL` z `_legacy/index.html` linie 1617-1623

- [ ] **Step 1: `src/lib/buildStandaloneHTML.js`** — kopia z `_legacy/index.html` linie 1454-1505

Skopiuj funkcję 1:1. Ważne:
  - `sourceStyle` w oryginale czyta `document.querySelector('style')?.innerHTML`. To było OK gdy CSS był w `<style>` w `index.html`. W Vite CSS jest w osobnym chunku — **trzeba zmienić podejście**: zbiera CSS z `<style>` i `<link rel="stylesheet">` obecnych w `document.head`.

```js
// src/lib/buildStandaloneHTML.js
export const buildStandaloneHTML = async (quote) => {
  const pages = document.querySelectorAll('.doc-page');
  if (pages.length === 0) return { html: '', imageFailures: 0 };

  // Embed images as data URLs
  const srcMap = {};
  let imageFailures = 0;
  for (const img of document.querySelectorAll('.doc-page img')) {
    const src = img.getAttribute('src');
    if (!src || srcMap[src]) continue;
    try {
      const r = await fetch(src);
      if (!r.ok) throw new Error('fetch failed');
      const blob = await r.blob();
      srcMap[src] = await new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => rej(fr.error);
        fr.readAsDataURL(blob);
      });
    } catch (e) { imageFailures++; srcMap[src] = src; }
  }

  const pagesHTML = Array.from(pages).map(p => {
    const clone = p.cloneNode(true);
    // Strip editor-only elements
    clone.querySelectorAll('.no-print').forEach(n => n.remove());
    clone.querySelectorAll('img').forEach(img => {
      const s = img.getAttribute('src');
      if (s && srcMap[s]) img.setAttribute('src', srcMap[s]);
    });
    clone.querySelectorAll('[contenteditable]').forEach(n => n.removeAttribute('contenteditable'));
    return clone.outerHTML;
  }).join('\n');

  // Collect all CSS from current document — inline <style> + linked stylesheets we control
  let css = '';
  for (const s of document.querySelectorAll('style')) css += s.innerHTML + '\n';
  // Inline imported stylesheet (Vite injects link[rel=stylesheet] for /src/styles.css in dev,
  // but in build it's a single CSS chunk). Fetch and embed.
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('https://')) continue; // skip external (Google Fonts is OK to keep as link)
    try {
      const r = await fetch(href);
      if (r.ok) css += await r.text() + '\n';
    } catch (e) { /* ignore */ }
  }

  const CLOSE = '<' + '/script>';
  const html = '<!DOCTYPE html>\n' +
'<html lang="sv">\n' +
'<head>\n' +
'<meta charset="UTF-8" />\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
'<title>BODO Offert · ' + (quote.meta.title || '').replace(/[<>]/g, '') + '</title>\n' +
'<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">\n' +
'<style>' + css + '\n' +
'  body { background: #F3F4F6; padding: 32px 0; font-family: Montserrat, system-ui, sans-serif; }\n' +
'  @media print { body { padding: 0; background: white; } }\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
pagesHTML + '\n' +
'</body>\n' +
'</html>';

  return { html, imageFailures };
};
```

**Uwaga**: w oryginalnym kodzie był `<script src="https://cdn.tailwindcss.com">` w outpucie. Usuwam — zamiast tego inline CSS, bo Tailwind w buildzie generuje statyczny CSS, więc nie potrzeba runtime'u.

- [ ] **Step 2: `src/lib/openAsURL.js`**

```js
// src/lib/openAsURL.js
import { buildStandaloneHTML } from './buildStandaloneHTML.js';

export const openQuoteAsURL = async (quote) => {
  const { html, imageFailures } = await buildStandaloneHTML(quote);
  if (!html) return;
  if (imageFailures > 0) {
    console.warn(`[openQuoteAsURL] failed to embed ${imageFailures} images`);
  }
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
```

- [ ] **Step 3: `src/components/TopBar.jsx`** — uproszczona wersja

```jsx
// src/components/TopBar.jsx — 3 actions only: Undo, Redo, Show HTML.
import { openQuoteAsURL } from '../lib/openAsURL.js';

export const TopBar = ({ quote, onTitleChange, savedAt, onUndo, onRedo, canUndo, canRedo }) => (
  <div className="no-print sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-8 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <input
        type="text"
        value={quote.meta.title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-[18px] font-bold bg-transparent outline-none w-full max-w-[400px] focus:bg-gray-50 px-2 py-1 rounded"
        placeholder="Tytuł wyceny..."
      />
      <span className="text-[11px] text-gray-400">/{quote.meta.slug}</span>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-2.5 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        title="Cofnij (Cmd+Z)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.7 3L3 13"/></svg>
        Cofnij
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="px-2.5 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
        title="Ponów (Cmd+Shift+Z)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 13"/></svg>
        Ponów
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1"></div>
      {savedAt && <span className="text-[11px] text-gray-400">Zapisano {savedAt}</span>}
      <button
        onClick={() => openQuoteAsURL(quote)}
        className="px-3 py-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm rounded-lg flex items-center gap-1.5"
        title="Otwórz wycenę jako stronę HTML w nowej zakładce"
      >
        Pokaż HTML
      </button>
    </div>
  </div>
);
```

Zauważ: **brak** props `onPublish`, `onUnpublish`. **Brak** przycisków HTML/PDF ciągły/Drukuj A4. **Brak** banera "URL".

- [ ] **Step 4: Smoke test**

```jsx
import { TopBar } from './components/TopBar.jsx';
import { blankQuote } from './lib/quoteModel.js';
import { useState } from 'react';

export default function App() {
  const [q, setQ] = useState(blankQuote('foo', 'Foo'));
  return <TopBar quote={q} onTitleChange={t => setQ({ ...q, meta: { ...q.meta, title: t } })} savedAt="12:34" onUndo={() => {}} onRedo={() => {}} canUndo canRedo />;
}
```

W przeglądarce: widzisz title input, 3 przyciski (Cofnij/Ponów/Pokaż HTML). Klik "Pokaż HTML" otwiera nową zakładkę (pustą — bo nie ma `.doc-page` w DOMie).

- [ ] **Step 5: Commit**

```bash
git add quote-app/src/lib/buildStandaloneHTML.js \
        quote-app/src/lib/openAsURL.js \
        quote-app/src/components/TopBar.jsx
git commit -m "feat(quote-app): TopBar with Undo/Redo/ShowHTML only (drop publish/PDF/print)"
```

---

## Task 12: Wire-up `App.jsx` (root) + autosave + migracja + URL routing

**Files:**
- Modify: `quote-app/src/App.jsx` — pełna wersja zastępująca tymczasowe wersje z task'ów 7-11

- [ ] **Step 1: Pełna implementacja `App.jsx`**

```jsx
// src/App.jsx — root component.
import { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from './lib/storage.js';
import { migrateLocalStorageIfNeeded } from './lib/migration.js';
import { blankQuote } from './lib/quoteModel.js';
import { slugify, getQuoteFromURL, setQuoteInURL } from './lib/slug.js';
import { Sidebar } from './components/Sidebar.jsx';
import { TopBar } from './components/TopBar.jsx';
import { CoverPage } from './components/pages/CoverPage.jsx';
import { QuotePage } from './components/pages/QuotePage.jsx';
import { OtherCostsPage } from './components/pages/OtherCostsPage.jsx';
import { ValuesPage } from './components/pages/ValuesPage.jsx';
import { TermsPage } from './components/pages/TermsPage.jsx';
import { BodoLogo } from './components/shared/BodoLogo.jsx';
import { Icon } from './components/shared/Icon.jsx';

const AUTOSAVE_DEBOUNCE_MS = 1000;

export default function App() {
  const [quotes, setQuotes] = useState({});
  const [currentSlug, setCurrentSlug] = useState(() => getQuoteFromURL());
  const [savedAt, setSavedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationNote, setMigrationNote] = useState(null);

  // Undo / Redo history (per-slug, in-memory only, max 30 steps)
  const historyRef = useRef({});
  const [, forceUpdate] = useState(0);

  // Autosave queue: { slug: { timer, dirtyQuote } }
  const saveQueueRef = useRef({});

  // Initial load: migrate then load all from disk
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await migrateLocalStorageIfNeeded();
        if (m.migrated > 0) setMigrationNote(`Zaimportowano ${m.migrated} wycen z poprzedniej wersji (localStorage). Backup pozostaje w przeglądarce.`);
        const all = await storage.loadAll();
        if (!cancelled) {
          setQuotes(all);
          setLoading(false);
        }
      } catch (err) {
        console.error('[App] init failed', err);
        alert('Nie udało się załadować wycen. Sprawdź czy `pnpm dev` działa i czy folder `quote-app/wyceny/` istnieje.\n\nBłąd: ' + err.message);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Sync URL with currentSlug
  useEffect(() => { setQuoteInURL(currentSlug); }, [currentSlug]);
  useEffect(() => {
    if (!loading && currentSlug && !quotes[currentSlug]) setCurrentSlug(null);
  }, [currentSlug, quotes, loading]);

  // Keyboard shortcuts: Cmd+Z / Cmd+Shift+Z / Cmd+Y
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const pushHistory = (slug, oldQuote) => {
    if (!historyRef.current[slug]) historyRef.current[slug] = { past: [], future: [] };
    historyRef.current[slug].past.push(JSON.stringify(oldQuote));
    if (historyRef.current[slug].past.length > 30) historyRef.current[slug].past.shift();
    historyRef.current[slug].future = [];
  };

  const undo = () => {
    if (!currentSlug) return;
    const h = historyRef.current[currentSlug];
    if (!h || h.past.length === 0) return;
    const prev = JSON.parse(h.past.pop());
    h.future.push(JSON.stringify(quotes[currentSlug]));
    setQuotes(qs => ({ ...qs, [currentSlug]: prev }));
    scheduleSave(currentSlug, prev);
    forceUpdate(x => x + 1);
  };

  const redo = () => {
    if (!currentSlug) return;
    const h = historyRef.current[currentSlug];
    if (!h || h.future.length === 0) return;
    const next = JSON.parse(h.future.pop());
    h.past.push(JSON.stringify(quotes[currentSlug]));
    setQuotes(qs => ({ ...qs, [currentSlug]: next }));
    scheduleSave(currentSlug, next);
    forceUpdate(x => x + 1);
  };

  // Debounced filesystem save per slug
  const scheduleSave = useCallback((slug, quote) => {
    const q = saveQueueRef.current;
    if (q[slug]?.timer) clearTimeout(q[slug].timer);
    q[slug] = {
      dirtyQuote: quote,
      timer: setTimeout(async () => {
        try {
          await storage.put(slug, q[slug].dirtyQuote);
          setSavedAt(new Date().toLocaleTimeString().slice(0, 5));
        } catch (err) {
          console.error('[autosave] failed', err);
          alert('Autosave się nie powiódł: ' + err.message);
        } finally {
          delete q[slug];
        }
      }, AUTOSAVE_DEBOUNCE_MS),
    };
  }, []);

  const updateQuote = (next) => {
    const slug = next.meta.slug;
    const prev = quotes[slug];
    if (prev) pushHistory(slug, prev);
    next.meta.updatedAt = new Date().toISOString();
    setQuotes(qs => ({ ...qs, [slug]: next }));
    scheduleSave(slug, next);
  };

  const newQuote = async () => {
    const title = prompt('Tytuł nowej wyceny:', 'Nowa wycena');
    if (title === null) return;
    let slug = slugify(title);
    if (quotes[slug]) slug = slug + '-' + Date.now().toString(36).slice(-4);
    const q = blankQuote(slug, title);
    await storage.put(slug, q);
    setQuotes(qs => ({ ...qs, [slug]: q }));
    setCurrentSlug(slug);
  };

  const duplicateQuote = async (slug) => {
    const src = quotes[slug];
    if (!src) return;
    const newTitle = src.meta.title + ' (kopia)';
    let newSlug = slugify(newTitle);
    if (quotes[newSlug]) newSlug = newSlug + '-' + Date.now().toString(36).slice(-4);
    const copy = JSON.parse(JSON.stringify(src));
    copy.meta = { ...copy.meta, slug: newSlug, title: newTitle, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await storage.put(newSlug, copy);
    setQuotes(qs => ({ ...qs, [newSlug]: copy }));
    setCurrentSlug(newSlug);
  };

  const deleteQuote = async (slug) => {
    if (!confirm(`Usunąć wycenę „${quotes[slug]?.meta.title}"?`)) return;
    await storage.delete(slug);
    setQuotes(qs => {
      const next = { ...qs };
      delete next[slug];
      return next;
    });
    if (currentSlug === slug) setCurrentSlug(null);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bodo-quotes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const importAll = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (typeof data !== 'object' || data === null) throw new Error('Nieprawidlowy plik JSON');
        const overlapping = Object.keys(data).filter(s => quotes[s]);
        let merged = { ...quotes };
        let saveList = Object.keys(data);
        if (overlapping.length > 0) {
          if (!confirm(`Znaleziono ${overlapping.length} wycen o tych samych slugach. Nadpisac istniejace?\n\n${overlapping.join(', ')}`)) {
            saveList = saveList.filter(s => !overlapping.includes(s));
          }
        }
        for (const s of saveList) {
          await storage.put(s, data[s]);
          merged[s] = data[s];
        }
        setQuotes(merged);
        alert(`Zaimportowano ${saveList.length} wycen.`);
      } catch (err) {
        alert('Blad importu: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const setQuoteTitle = (t) => quote && updateQuote({ ...quote, meta: { ...quote.meta, title: t } });
  const togglePage = (key, val) => quote && updateQuote({ ...quote, [key]: { ...quote[key], enabled: val } });

  const quote = currentSlug ? quotes[currentSlug] : null;
  const canUndo = !!(currentSlug && historyRef.current[currentSlug]?.past.length > 0);
  const canRedo = !!(currentSlug && historyRef.current[currentSlug]?.future.length > 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <BodoLogo size="md" className="mb-4" />
        <div className="text-sm">Ładowanie wycen z dysku…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        quotes={quotes}
        currentSlug={currentSlug}
        onSelect={setCurrentSlug}
        onNew={newQuote}
        onDelete={deleteQuote}
        onDuplicate={duplicateQuote}
        onTogglePage={togglePage}
        onExportAll={exportAll}
        onImportAll={importAll}
        quote={quote}
      />
      <main className="flex-1 min-w-0">
        {migrationNote && (
          <div className="no-print bg-amber-50 border-b border-amber-200 px-6 py-2 text-[12px] text-amber-900 flex justify-between items-center">
            <span>{migrationNote}</span>
            <button onClick={() => setMigrationNote(null)} className="text-amber-600 hover:text-amber-800">✕</button>
          </div>
        )}
        {!quote && (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <BodoLogo size="lg" className="mb-6" />
            <h1 className="text-2xl font-bold text-[#2A3978] mb-2">Offert Generator</h1>
            <p className="text-gray-500 mb-8 max-w-md">
              Lokalna aplikacja do tworzenia wycen w stylu BODO. Każda wycena to plik JSON w folderze <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[12px]">quote-app/wyceny/</code>.
            </p>
            <button onClick={newQuote} className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-lg flex items-center gap-2">
              <Icon.Plus width="16" height="16"/> Stwórz pierwszą wycenę
            </button>
          </div>
        )}
        {quote && (() => {
          const total =
            1 /* cover */ +
            1 /* main quote */ +
            (quote.otherCosts.enabled ? 1 : 0) +
            (quote.values.enabled ? 1 : 0) +
            (quote.terms.enabled ? 1 : 0);
          let n = 0;
          const next = () => ++n;
          return (
            <>
              <TopBar
                quote={quote}
                onTitleChange={setQuoteTitle}
                savedAt={savedAt}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
              <div className="py-8 px-4 bg-gray-100 min-h-screen">
                <CoverPage pageNum={next()} totalPages={total} />
                <QuotePage quote={quote} setQuote={updateQuote} pageNum={next()} totalPages={total} />
                {quote.otherCosts.enabled && (
                  <OtherCostsPage
                    otherCosts={quote.otherCosts}
                    setOtherCosts={(oc) => updateQuote({ ...quote, otherCosts: oc })}
                    header={quote.header}
                    pageNum={next()}
                    totalPages={total}
                  />
                )}
                {quote.values.enabled && <ValuesPage pageNum={next()} totalPages={total} />}
                {quote.terms.enabled && <TermsPage header={quote.header} terms={quote.terms} pageNum={next()} totalPages={total} />}
              </div>
            </>
          );
        })()}
      </main>
    </div>
  );
}
```

**Różnice vs `_legacy/index.html`**:
- `loadAll()` z localStorage → `storage.loadAll()` z dysku (async)
- Każda mutacja → `scheduleSave(slug, quote)` zamiast `saveAll(quotes)` na każdym render
- Migracja jednorazowa
- TopBar bez `onPublish`/`onUnpublish` — usunięte
- `publishCurrent` / `unpublishCurrent` — usunięte całkowicie

- [ ] **Step 2: Pierwszy pełny test end-to-end**

```bash
cd quote-app && pnpm dev
```

1. Otwórz `http://localhost:5173`
2. Empty-state powinien się pokazać — "Stwórz pierwszą wycenę"
3. Klik → prompt → "Test 1" → tworzy wycenę
4. Sprawdź `ls quote-app/wyceny/` — powinien być `test-1.json`
5. Edytuj title w TopBar → poczekaj 1s → `cat quote-app/wyceny/test-1.json` ma nowy title
6. Dodaj scope row, manpower row — zmiany się zapisują
7. Cmd+Z cofa, Cmd+Shift+Z ponawia
8. Klik "Pokaż HTML" → nowa zakładka z renderingiem wyceny
9. Duplikuj → drugi plik na dysku
10. Usuń → znika z sidebar + z dysku
11. Refresh strony → wyceny się ładują z plików

- [ ] **Step 3: Test migracji (jeśli masz wcześniej dane w localStorage)**

Jeśli wcześniej używałaś apki w przeglądarce:

1. Otwórz DevTools → Application → Local Storage → `http://localhost:5173`
2. Sprawdź czy istnieje klucz `bodo_quotes_v1`
3. Usuń klucz `bodo_migration_to_files_done_v1` (jeśli jest), żeby wymusić migrację
4. Refresh strony
5. Pojawia się żółty pasek "Zaimportowano N wycen…"
6. `ls quote-app/wyceny/` zawiera importowane pliki

- [ ] **Step 4: Commit**

```bash
git add quote-app/src/App.jsx
git commit -m "feat(quote-app): wire root App with filesystem storage + migration + autosave"
```

---

## Task 13: Seed wyceny + finalna inspekcja + sprzątanie

**Files:**
- Move: `quote-app/seeds/oferta-5C-2026.json` → `quote-app/wyceny/alexander-mork-eidem-5c-2026.json` (z dostosowaniem formatu do `blankQuote` jeśli trzeba)
- Delete: `quote-app/seeds/` (po przeniesieniu)
- Delete: `quote-app/_legacy/` (po finalnej weryfikacji)
- Modify: `.gitignore` — usuń linijkę `quote-app/_legacy/` (nieaktualna)

- [ ] **Step 1: Sprawdź format `seeds/oferta-5C-2026.json`**

```bash
cat quote-app/seeds/oferta-5C-2026.json | head -60
```

Jeśli ma kompletnie inny shape niż `blankQuote` (z spec wynika że ma — to ręcznie tworzona oferta z formatu Excel) — **nie ładujmy go bezpośrednio jako wycenę**. Lepiej:
  - Zostawiamy `seeds/` jako jest (sygnatura: "kiedyś przyda się jako import data")
  - Tworzymy DOMYŚLNĄ wycenę-przykład poprzez UI ("Stwórz pierwszą wycenę") gdy folder `wyceny/` jest pusty

**Decyzja**: jeśli format pasuje 1:1 do `blankQuote` → przenosimy. Jeśli nie — zostawiamy w `seeds/` z `.gitignore` na `quote-app/seeds/`.

- [ ] **Step 2: (Opcja A) Przenieś jeśli format zgodny**

```bash
mkdir -p quote-app/wyceny
cp quote-app/seeds/oferta-5C-2026.json quote-app/wyceny/alexander-mork-eidem-5c-2026.json
```

Restart `pnpm dev`. Otwórz apkę — sprawdź czy seed pojawia się w sidebar i renderuje bez crash'u. Jeśli crash — przejść do Opcji B.

- [ ] **Step 3: (Opcja B) Zostaw seeds, gitignore'uj**

Dodaj do `.gitignore`:

```
quote-app/seeds/
```

(Jeśli wcześniej był committed, `git rm --cached quote-app/seeds/oferta-5C-2026.json`.)

- [ ] **Step 4: Sprawdzenie czystości — szukaj zombi-kodu**

```bash
cd quote-app
# Te wzorce NIE powinny się pojawiać w src/ ani vite-plugin-wyceny.js ani vite.config.js:
grep -rn "localStorage" src/ vite-plugin-wyceny.js vite.config.js 2>/dev/null | grep -v migration.js
# Expected: brak (poza migration.js które MA dotykać localStorage)

grep -rn "html2pdf\|printContinuousPDF\|publishQuote\|exportQuoteToHTML\|window\.print" src/ 2>/dev/null
# Expected: brak

grep -rn "bodo_quotes_v1" src/ 2>/dev/null | grep -v migration.js
# Expected: brak (tylko migration.js powinien znać legacy key)

wc -l quote-app/index.html
# Expected: ≤ 20 linii
```

- [ ] **Step 5: Usuń `_legacy/`**

Po pełnym przejściu manualnej checklisty z spec (sekcja Verification):

```bash
rm -rf quote-app/_legacy/
# Remove _legacy entry from .gitignore
```

Edytuj `.gitignore` — usuń linijkę `quote-app/_legacy/`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore(quote-app): finalize refactor — drop _legacy, seed example quote, gitignore cleanup"
```

---

## Final verification (z `spec` sekcja Verification)

Po wszystkich tasks, manualnie:

1. `pnpm install && pnpm dev` startuje bez błędów ✓
2. Sidebar pokazuje 1+ wycenę z `wyceny/` ✓
3. Klik w wycenę otwiera ją w edytorze, wszystkie strony renderują się 1:1 jak teraz ✓
4. Edycja tekstu w bloku → po 1s plik w `wyceny/<slug>.json` ma nową zawartość ✓
5. Cofnij/Ponów działa ✓
6. "Pokaż HTML" otwiera nową zakładkę z renderem wyceny ✓
7. Nowa wycena → tworzy plik ✓
8. Usunięcie wyceny → kasuje plik ✓
9. W kodzie nigdzie nie ma: `localStorage.getItem('bodo_quotes_v1')` (poza migration.js), `html2pdf`, `publishQuote`, `exportQuoteToHTML`, `printContinuousPDF`, `window.print` ✓
10. `quote-app/index.html` ma ≤ 20 linii ✓

---

## Self-Review

**1. Spec coverage:**
- Sekcja "Zostaje (1:1)" — wszystkie komponenty wyciągnięte w Tasks 6-9.
- "Znika" — `localStorage` zastąpiony w Tasks 2-4 i Task 12; publish/PDF/print usunięte w Task 11.
- "TopBar ma TRZY akcje" — pokryte w Task 11 Step 3.
- "Decyzje (zatwierdzone)" — gitignore w Task 2 Step 3, seeds w Task 13.
- Architektura (folder layout) — pokryta przez kolejność Tasków.
- Migration on first run — Task 4 + Task 12 Step 2.

**2. Placeholder scan:** Brak "TBD"/"TODO". Każdy task ma konkretny kod do wklejenia + verification steps.

**3. Type consistency:**
- `storage.list/get/put/delete/loadAll` — używane konsekwentnie w Task 4, 12.
- `blankQuote/blankPoint/newBlock` — zdefiniowane w Task 3, używane w Tasks 7, 8, 12.
- `openQuoteAsURL` — Task 11.
- `buildStandaloneHTML` zwraca `{ html, imageFailures }` — używane konsekwentnie.

**4. Ambiguity:**
- Task 13 ma rozgałęzienie A/B dla seed file — jasne kryterium decyzji (format zgodny vs nie).
- Task 6 Step 5 jasno wyjaśnia przeniesienie assets + dlaczego.

Plan gotowy.
