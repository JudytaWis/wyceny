# BODO Office

Workspace dla BODO Build and Track AB.

## Struktura

- `quote-app/` — aplikacja React (single-HTML) do generowania wycen
  - `quote-app/index.html` — sama apka (dwuklik = otwiera w przeglądarce)
  - `quote-app/assets/` — logo + zdjęcia
  - `quote-app/public/` — **publiczne wyceny dla klientów (Vercel deploy)**
  - `quote-app/seeds/` — backup JSON-ów wycen
- `BODO_QUOTE_TEMPLATE.md` — szablon wycen (referencja)
- `SETUP_GOOGLE.md` — konfiguracja Gmail / Drive MCP
- `wycena-A.pdf` — gotowy PDF Alexander 5C/2026
- `alexander-quote-data.json` — JSON wyceny Alexander

## Jak odpalić apkę lokalnie (dev)

Apka `quote-app/` to projekt Vite + React + Tailwind.

```bash
cd quote-app
pnpm install        # tylko za pierwszym razem (lub po zmianie package.json)
pnpm dev            # uruchamia dev server na http://localhost:5173
```

Inne komendy:

- `pnpm build` — produkcyjny build do `quote-app/dist/`
- `pnpm preview` — podgląd builda lokalnie

Wymagania: Node.js 18+ i `pnpm` (`npm i -g pnpm`).

## Workflow publikacji wyceny dla klienta

1. W aplikacji (`quote-app/index.html`) klikasz **🚀 Opublikuj**
2. Plik HTML pobierany do Downloads → przenieś do `quote-app/public/<slug>.html`
3. `git add . && git commit -m "publish ..." && git push`
4. Vercel auto-deploy → klient dostaje URL `https://wyceny.vercel.app/<slug>.html`
5. Hasło dla klienta: **bodo2026**

## Git

Repo: https://github.com/JudytaWis/wyceny
Branch: main
