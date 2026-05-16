# BODO — Quote App

Lokalna aplikacja React (single-HTML) do generowania wycen BODO Build and Track AB.

## Struktura

- `index.html` — sama aplikacja (uruchamiasz dwuklikiem)
- `assets/` — logo + zdjęcia (cover, logos)
- `seeds/` — backup JSON-ów wycen
- `quote-public/` — **publiczne wyceny dla klientów (Vercel deploy)**
- `wycena-A-print.html` — print-ready statyczna wersja Alexander 5C/2026
- `import-alexander*.html` — boostrap importer wycen do localStorage

## Workflow publikacji wyceny dla klienta

1. W aplikacji klikasz "Opublikuj"
2. Plik HTML ląduje w `quote-public/<slug>.html`
3. `git add . && git commit -m "..." && git push`
4. Vercel auto-deploy → klient dostaje URL `https://<projekt>.vercel.app/quote-public/<slug>.html`
