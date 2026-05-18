# Quote-app refactor — design spec

**Data:** 2026-05-18
**Autor:** Judyta + Claude
**Status:** approved, ready for plan

## Cel

Zrefaktorować obecny `quote-app/index.html` (2028 linii, monolit React + Babel-standalone + Tailwind CDN) na czystą strukturę plików z buildem Vite. **Wycenami przestaje zarządzać `localStorage`** — każda wycena to osobny plik `quote-app/wyceny/<slug>.json` na dysku. Apka jest narzędziem deweloperskim na lokalnym Macu — nie chmura, nie baza, nie publikacja.

## Co zostaje, co znika

### Zostaje (1:1)
- Cały wygląd UI, kolory, fonty, układ A4
- Cała logika edytora blokowego (Scope / Subsection / Manpower / Bullet / Paragraph / Budget / TotalFixedPrice)
- Timeline + Point + cała struktura strony Quote
- Strony: Cover, Quote, OtherCosts, Values, Terms
- Sidebar z listą wycen + new/rename/delete/duplicate/togglePage
- Header / Summary / Optional sections
- Undo / Redo
- Sterowanie URL przez slug (`?quote=<slug>`)
- Eksport / import wszystkich wycen jako JSON bundle (do backupu)

### Znika
- **`localStorage`** jako źródło prawdy → zastąpiony plikami `wyceny/<slug>.json`
- **Przycisk Opublikuj** i cały flow zapisu do `public/<slug>.html`
- **Przycisk Cofnij publikację**
- **Przycisk HTML** (download standalone HTML)
- **Przycisk PDF ciągły** (osobne okno z długim PDF-em)
- **Przycisk Drukuj A4** (`window.print()`)
- Biblioteka `html2pdf.bundle.min.js`
- Babel-standalone, React UMD, Tailwind CDN (zastąpione przez build Vite)
- Folder `public/` przestaje być deploy targetem (zostanie w repo na razie, ale apka go nie dotyka)

### TopBar po refaktorze ma TRZY akcje
1. **Cofnij** (Cmd+Z)
2. **Ponów** (Cmd+Shift+Z)
3. **Pokaż HTML** — otwiera wycenę jako stronę HTML w nowej zakładce przeglądarki (obecne `openQuoteAsURL`)

## Architektura

### Drzewo plików

```
quote-app/
├─ wyceny/                          # NOWY storage (gitignored opcjonalnie)
│   ├─ alexander-mork-eidem-5c.json
│   └─ ...
├─ src/
│   ├─ main.jsx
│   ├─ App.jsx
│   ├─ components/
│   │   ├─ pages/
│   │   │   ├─ CoverPage.jsx
│   │   │   ├─ QuotePage.jsx
│   │   │   ├─ OtherCostsPage.jsx
│   │   │   ├─ ValuesPage.jsx
│   │   │   └─ TermsPage.jsx
│   │   ├─ blocks/
│   │   │   ├─ Block.jsx              # router blocków
│   │   │   ├─ BlockTools.jsx
│   │   │   ├─ BlockAdder.jsx
│   │   │   ├─ NestedBlockAdder.jsx
│   │   │   ├─ ScopeBlock.jsx
│   │   │   ├─ SubsectionBlock.jsx
│   │   │   ├─ ManpowerBlock.jsx
│   │   │   ├─ BulletBlock.jsx
│   │   │   ├─ ParagraphBlock.jsx
│   │   │   ├─ BudgetBlock.jsx
│   │   │   └─ TotalFixedPriceBlock.jsx
│   │   ├─ shared/
│   │   │   ├─ EditableText.jsx
│   │   │   ├─ BodoLogo.jsx
│   │   │   ├─ Icon.jsx
│   │   │   └─ PageFooter.jsx
│   │   ├─ Sidebar.jsx
│   │   ├─ TopBar.jsx
│   │   ├─ QuoteHeader.jsx
│   │   ├─ QuoteHeaderReadonly.jsx
│   │   ├─ SummarySection.jsx
│   │   ├─ OptionalSection.jsx
│   │   ├─ TimelineRow.jsx
│   │   └─ Point.jsx
│   ├─ lib/
│   │   ├─ quoteModel.js              # blankQuote, blankPoint, newBlock, blockTypes, subBlockTypes
│   │   ├─ formula.js                 # parseNum, formatNum, buildFormulaFromLegacy, computeFromFormula, computeRowTotal, manpowerRows, computeManpowerTotal
│   │   ├─ slug.js                    # slugify, getQuoteFromURL, setQuoteInURL, todayStr, uid
│   │   ├─ storage.js                 # fetch('/api/wyceny/...') — list/get/put/delete
│   │   ├─ migration.js               # jednorazowy import z localStorage do plików
│   │   └─ openAsURL.js               # standalone HTML preview w nowej zakładce
│   └─ styles.css                     # @tailwind base/components/utilities + custom CSS z obecnego <style>
├─ vite-plugin-wyceny.js              # ~50 linii — REST API dla plików JSON
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json
├─ index.html                         # tylko <div id="root"></div> + import main.jsx
├─ public/                            # ZOSTAJE (nie dotykamy)
├─ seeds/                             # ZOSTAJE
├─ assets/                            # ZOSTAJE (logo, cover images)
└─ .gitignore                         # + wyceny/*.json (decyzja: czy commitować?)
```

### vite-plugin-wyceny.js — API kontraktu

```
GET    /api/wyceny              → 200 ["alexander-mork-eidem-5c", "kowalski-2a"]
GET    /api/wyceny/:slug        → 200 { ...quote JSON... }  | 404
PUT    /api/wyceny/:slug        → body = JSON wyceny; zapisuje plik; 204
DELETE /api/wyceny/:slug        → kasuje plik; 204
```

Plugin używa Node `fs/promises` + `path.resolve(__dirname, 'wyceny')`. Walidacja slug (regex `^[a-z0-9-]+$`) zapobiega path traversal. Plik formatowany przez `JSON.stringify(quote, null, 2)` — czytelny diff w gitcie.

### Data flow

1. **Start apki**: `useEffect(() => storage.listAll().then(setQuotes), [])` — fetch listy slugów, potem każda wycena lazy (lub równolegle Promise.all).
2. **Edycja**: state lokalny w React + autosave debounced (1000 ms) → `storage.put(slug, quote)`.
3. **Nowa wycena**: `storage.put(slug, blankQuote(slug, title))` → odświeża listę.
4. **Usuń**: `storage.delete(slug)` → odświeża listę.
5. **Migration on first run**: jeśli `wyceny/` jest pusty A localStorage `bodo_quotes_v1` istnieje → wczytaj, zapisz każdą wycenę jako osobny plik, zostaw localStorage nietknięty (backup), pokaż toast „Zaimportowano N wycen z localStorage".

### Stack

- **Build**: Vite 5 + `@vitejs/plugin-react` (Babel/SWC w buildzie zamiast in-browser)
- **Style**: Tailwind 3 + PostCSS (zamiast CDN script)
- **Brak**: html2pdf, Babel-standalone, React UMD
- **Node**: 24 LTS (default Vercel — choć Vercela tu nie używamy)
- **Package manager**: pnpm (już używasz w workspace)

## Decyzje (zatwierdzone)

1. **`quote-app/wyceny/*.json` → `.gitignore`**. Dane klientów nie idą do repo. Backup robi sama apka przez Undo/Redo (in-memory) + opcjonalny export-all bundle jako JSON.
2. **`seeds/oferta-5C-2026.json` → przenosimy do `wyceny/`** jako pierwszy widoczny w sidebarze plik. Folder `seeds/` można skasować po migracji.

## Non-goals

- Multi-user / cloud / auth — nie ma.
- Mobilność / PWA — apka tylko na Twoim Macu.
- Testy — pomijamy (jeden plik HTML, używany przez jedną osobę). Jeśli kiedyś urośnie, dodamy Vitest.
- Backward compatibility z `bodo_quotes_v1` poza jednorazową migracją — po imporcie kluczem prawdy są pliki.
- TypeScript — zostajemy w JS (mniej szumu, łatwiej edytować).

## Ryzyka i jak się przed nimi bronić

- **Utrata danych przy refaktorze** → migracja jest read-only z localStorage, nie czyści go. User trzyma backup w przeglądarce dopóki nie sprawdzi że pliki są OK.
- **Autosave nadpisze właściwą wycenę zmianami w trakcie konfliktu** → autosave debounced + przy starcie sesji wycena jest świeżo wczytana z dysku. Jedna osoba używa apki — konfliktów brak.
- **`pnpm dev` musi działać żeby apka działała** → akceptowane, taka jest natura tego setupu.

## Verification (jak sprawdzimy że refaktor się udał)

1. `pnpm install && pnpm dev` startuje bez błędów
2. Sidebar pokazuje 1+ wycenę z `wyceny/`
3. Klik w wycenę otwiera ją w edytorze, wszystkie strony renderują się 1:1 jak teraz
4. Edycja tekstu w bloku → po 1s plik w `wyceny/<slug>.json` ma nową zawartość (sprawdzane `cat` lub IDE)
5. Cofnij/Ponów działa
6. "Pokaż HTML" otwiera nową zakładkę z renderem wyceny
7. Nowa wycena → tworzy plik
8. Usunięcie wyceny → kasuje plik
9. W kodzie nigdzie nie ma już: `localStorage.getItem('bodo_quotes_v1')`, `html2pdf`, `publishQuote`, `exportQuoteToHTML`, `printContinuousPDF`, `window.print`
10. `quote-app/index.html` ma ≤ 30 linii (tylko shell)
