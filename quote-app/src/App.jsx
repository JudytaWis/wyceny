// src/App.jsx — root component.
import { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from './lib/storage.js';
import { migrateLocalStorageIfNeeded } from './lib/migration.js';
import { blankQuote, blankPoint } from './lib/quoteModel.js';
import { slugify, getQuoteFromURL, setQuoteInURL } from './lib/slug.js';
import { Sidebar } from './components/Sidebar.jsx';
import { TopBar } from './components/TopBar.jsx';
import { CoverPage } from './components/pages/CoverPage.jsx';
import { TocPage } from './components/pages/TocPage.jsx';
import { QuotePage } from './components/pages/QuotePage.jsx';
import { QuotePageA4 } from './components/pages/QuotePageA4.jsx';
import { SummaryPage } from './components/pages/SummaryPage.jsx';
import { OptionalPage } from './components/pages/OptionalPage.jsx';
import { OtherCostsPage } from './components/pages/OtherCostsPage.jsx';
import { ValuesPage } from './components/pages/ValuesPage.jsx';
import { TermsPage } from './components/pages/TermsPage.jsx';
import { BodoLogo } from './components/shared/BodoLogo.jsx';
import { Icon } from './components/shared/Icon.jsx';
import { PageFooter } from './components/shared/PageFooter.jsx';
import { PublishModal } from './components/PublishModal.jsx';
import { publishHTML, unpublishHTML, publishedUrlFor } from './lib/publish.js';

const AUTOSAVE_DEBOUNCE_MS = 1000;

export default function App() {
  const [quotes, setQuotes] = useState({});
  const [currentSlug, setCurrentSlug] = useState(() => getQuoteFromURL());
  const [savedAt, setSavedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [migrationNote, setMigrationNote] = useState(null);

  const [publishing, setPublishing] = useState(false);
  const [publishModal, setPublishModal] = useState({ open: false, mode: 'publish', slug: '', url: '' });

  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem('bodo_view_mode_v1') || 'long'; } catch { return 'long'; }
  });
  const onViewModeChange = (m) => {
    setViewMode(m);
    try { localStorage.setItem('bodo_view_mode_v1', m); } catch {}
  };

  const historyRef = useRef({});
  const [, forceUpdate] = useState(0);
  const saveQueueRef = useRef({});

  // Initial load: migrate then fetch all from disk
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await migrateLocalStorageIfNeeded();
        if (m.migrated > 0) {
          setMigrationNote(`Zaimportowano ${m.migrated} wycen z poprzedniej wersji (localStorage). Backup pozostaje w przeglądarce.`);
        }
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

  // URL sync
  useEffect(() => { setQuoteInURL(currentSlug); }, [currentSlug]);
  useEffect(() => {
    if (!loading && currentSlug && !quotes[currentSlug]) setCurrentSlug(null);
  }, [currentSlug, quotes, loading]);

  const pushHistory = (slug, oldQuote) => {
    if (!historyRef.current[slug]) historyRef.current[slug] = { past: [], future: [] };
    historyRef.current[slug].past.push(JSON.stringify(oldQuote));
    if (historyRef.current[slug].past.length > 30) historyRef.current[slug].past.shift();
    historyRef.current[slug].future = [];
  };

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

  const undo = useCallback(() => {
    if (!currentSlug) return;
    const h = historyRef.current[currentSlug];
    if (!h || h.past.length === 0) return;
    const prev = JSON.parse(h.past.pop());
    h.future.push(JSON.stringify(quotes[currentSlug]));
    setQuotes(qs => ({ ...qs, [currentSlug]: prev }));
    scheduleSave(currentSlug, prev);
    forceUpdate(x => x + 1);
  }, [currentSlug, quotes, scheduleSave]);

  const redo = useCallback(() => {
    if (!currentSlug) return;
    const h = historyRef.current[currentSlug];
    if (!h || h.future.length === 0) return;
    const next = JSON.parse(h.future.pop());
    h.past.push(JSON.stringify(quotes[currentSlug]));
    setQuotes(qs => ({ ...qs, [currentSlug]: next }));
    scheduleSave(currentSlug, next);
    forceUpdate(x => x + 1);
  }, [currentSlug, quotes, scheduleSave]);

  // Keyboard shortcuts: Cmd+Z / Cmd+Shift+Z / Cmd+Y
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (meta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

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
    try {
      await storage.put(slug, q);
      setQuotes(qs => ({ ...qs, [slug]: q }));
      setCurrentSlug(slug);
    } catch (err) {
      alert('Nie udało się utworzyć wyceny: ' + err.message);
    }
  };

  const duplicateQuote = async (slug) => {
    const src = quotes[slug];
    if (!src) return;
    const newTitle = src.meta.title + ' (kopia)';
    let newSlug = slugify(newTitle);
    if (quotes[newSlug]) newSlug = newSlug + '-' + Date.now().toString(36).slice(-4);
    const copy = JSON.parse(JSON.stringify(src));
    copy.meta = { ...copy.meta, slug: newSlug, title: newTitle, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    try {
      await storage.put(newSlug, copy);
      setQuotes(qs => ({ ...qs, [newSlug]: copy }));
      setCurrentSlug(newSlug);
    } catch (err) {
      alert('Nie udało się zduplikować wyceny: ' + err.message);
    }
  };

  const deleteQuote = async (slug) => {
    if (!confirm(`Usunąć wycenę „${quotes[slug]?.meta.title}"?`)) return;
    try {
      await storage.delete(slug);
      setQuotes(qs => {
        const next = { ...qs };
        delete next[slug];
        return next;
      });
      if (currentSlug === slug) setCurrentSlug(null);
    } catch (err) {
      alert('Nie udało się usunąć wyceny: ' + err.message);
    }
  };

  const publishQuote = async (slug) => {
    const src = quotes[slug];
    if (!src) return;
    if (currentSlug !== slug) {
      alert('Otwórz wycenę, którą chcesz opublikować — publikacja używa aktualnego widoku.');
      return;
    }
    setPublishing(true);
    try {
      const { imageFailures } = await publishHTML(src);
      const updated = {
        ...src,
        meta: {
          ...src.meta,
          published: true,
          publishedAt: new Date().toISOString(),
          publishedUrl: publishedUrlFor(slug),
          updatedAt: new Date().toISOString(),
        },
      };
      await storage.put(slug, updated);
      setQuotes(qs => ({ ...qs, [slug]: updated }));
      if (imageFailures > 0) {
        console.warn(`[publish] ${imageFailures} obrazów nie udało się osadzić`);
      }
      setPublishModal({ open: true, mode: 'publish', slug, url: publishedUrlFor(slug) });
    } catch (err) {
      console.error('[publish] failed', err);
      alert('Publikacja nie powiodła się: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  const unpublishQuote = async (slug) => {
    const src = quotes[slug];
    if (!src) return;
    if (!confirm(`Cofnąć publikację „${src.meta.title}"? Plik HTML zostanie usunięty z folderu publicznego. Aby zniknął ze świata, musisz wypchnąć projekt na Vercela.`)) return;
    setPublishing(true);
    try {
      await unpublishHTML(slug);
      const updated = {
        ...src,
        meta: {
          ...src.meta,
          published: false,
          unpublishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      await storage.put(slug, updated);
      setQuotes(qs => ({ ...qs, [slug]: updated }));
      setPublishModal({ open: true, mode: 'unpublish', slug, url: '' });
    } catch (err) {
      console.error('[unpublish] failed', err);
      alert('Nie udało się cofnąć publikacji: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  const renameQuote = async (slug, newTitle) => {
    const src = quotes[slug];
    if (!src) return;
    const updated = { ...src, meta: { ...src.meta, title: newTitle, updatedAt: new Date().toISOString() } };
    setQuotes(qs => ({ ...qs, [slug]: updated }));
    scheduleSave(slug, updated);
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

  const quote = currentSlug ? quotes[currentSlug] : null;
  const setQuoteTitle = (t) => quote && updateQuote({ ...quote, meta: { ...quote.meta, title: t } });
  const togglePage = (key, val) => quote && updateQuote({ ...quote, [key]: { ...quote[key], enabled: val } });

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
        onRename={renameQuote}
        onDelete={deleteQuote}
        onDuplicate={duplicateQuote}
        onTogglePage={togglePage}
        onExportAll={exportAll}
        onImportAll={importAll}
        onUnpublish={unpublishQuote}
        quote={quote}
      />
      <PublishModal
        open={publishModal.open}
        mode={publishModal.mode}
        slug={publishModal.slug}
        url={publishModal.url}
        onClose={() => setPublishModal((m) => ({ ...m, open: false }))}
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
          const summaryOn = !!quote.summary?.enabled;
          const optionalOn = !!quote.optional?.enabled;
          const otherCostsOn = !!quote.otherCosts?.enabled;
          const valuesOn = !!quote.values?.enabled;
          const termsOn = !!quote.terms?.enabled;
          // TOC: only in long view, only when there are more than 2 points
          const tocOn = viewMode === 'long' && quote.points.length > 2;

          const total =
            1 /* cover */
            + (tocOn ? 1 : 0)
            + (viewMode === 'a4'
                ? (quote.points.length === 0 ? 1 : quote.points.length) /* one A4 per point, min 1 for empty state */
                  + (summaryOn ? 1 : 0)
                  + (optionalOn ? 1 : 0)
                : 1 /* single long Quote page (includes points + summary + optional) */
              )
            + (otherCostsOn ? 1 : 0)
            + (valuesOn ? 1 : 0)
            + (termsOn ? 1 : 0);
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
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onPublish={() => publishQuote(currentSlug)}
                onUnpublish={() => unpublishQuote(currentSlug)}
                publishing={publishing}
              />
              <div className="py-8 px-4 bg-gray-100 min-h-screen">
                <CoverPage pageNum={next()} totalPages={total} />
                {tocOn && <TocPage quote={quote} setQuote={updateQuote} pageNum={next()} totalPages={total} />}
                {viewMode === 'long' ? (
                  <QuotePage quote={quote} setQuote={updateQuote} pageNum={next()} totalPages={total} showHeader={!tocOn} />
                ) : (
                  <>
                    {quote.points.length === 0 ? (
                      <div className="doc-page doc-page-pink flex flex-col items-center justify-center">
                        <PageFooter num={next()} total={total} />
                        <button
                          onClick={() => updateQuote({ ...quote, points: [blankPoint(1)] })}
                          className="no-print px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg flex items-center gap-2"
                        >
                          <Icon.Plus width="16" height="16"/> Dodaj pierwszy punkt (ETAPP)
                        </button>
                      </div>
                    ) : quote.points.map((p, i) => (
                      <QuotePageA4
                        key={p.id}
                        quote={quote}
                        setQuote={updateQuote}
                        pointIndex={i}
                        pageNum={next()}
                        totalPages={total}
                        isLastPoint={i === quote.points.length - 1}
                      />
                    ))}
                    {summaryOn && <SummaryPage quote={quote} setQuote={updateQuote} pageNum={next()} totalPages={total} />}
                    {optionalOn && <OptionalPage quote={quote} setQuote={updateQuote} pageNum={next()} totalPages={total} />}
                  </>
                )}
                {otherCostsOn && (
                  <OtherCostsPage
                    otherCosts={quote.otherCosts}
                    setOtherCosts={(oc) => updateQuote({ ...quote, otherCosts: oc })}
                    header={quote.header}
                    pageNum={next()}
                    totalPages={total}
                  />
                )}
                {valuesOn && <ValuesPage pageNum={next()} totalPages={total} />}
                {termsOn && <TermsPage header={quote.header} terms={quote.terms} pageNum={next()} totalPages={total} />}
              </div>
            </>
          );
        })()}
      </main>
    </div>
  );
}
