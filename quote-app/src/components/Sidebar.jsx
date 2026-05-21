// src/components/Sidebar.jsx
import { useState } from 'react';
import { Icon } from './shared/Icon.jsx';
import { BodoLogo } from './shared/BodoLogo.jsx';

export const Sidebar = ({
  quotes,
  currentSlug,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onDuplicate,
  onTogglePage,
  onExportAll,
  onImportAll,
  onUnpublish,
  quote,
}) => {
  const list = Object.values(quotes).sort(
    (a, b) => (b.meta.updatedAt || '').localeCompare(a.meta.updatedAt || '')
  );

  return (
    <aside className="no-print w-72 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <BodoLogo size="sm" />
        </div>
        <p className="text-[11px] text-gray-500 mt-1">Offert Generator · lokalnie</p>
      </div>
      <div className="p-4 space-y-2">
        <button
          onClick={onNew}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <Icon.Plus width="16" height="16" /> Nowa wycena
        </button>
        <div className="flex gap-2">
          <button
            onClick={onExportAll}
            className="flex-1 text-[11px] text-gray-600 border border-gray-200 hover:bg-gray-50 py-1.5 rounded"
          >
            Eksportuj JSON
          </button>
          <label className="flex-1 text-[11px] text-gray-600 border border-gray-200 hover:bg-gray-50 py-1.5 rounded text-center cursor-pointer">
            Importuj JSON
            <input type="file" accept="application/json" onChange={onImportAll} className="hidden" />
          </label>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto sb px-2 pb-4">
        {(() => {
          const drafts = list.filter((q) => !q.meta.published);
          const published = list.filter((q) => q.meta.published);

          const renderItem = (q, isPub) => (
            <button
              key={q.meta.slug}
              onClick={() => onSelect(q.meta.slug)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1 group flex items-center justify-between ${
                currentSlug === q.meta.slug
                  ? isPub
                    ? 'bg-[#22C55E]/10 text-[#16A34A]'
                    : 'bg-[#6366F1]/10 text-[#4F46E5]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium flex items-center gap-1">
                  {isPub && <span title="Opublikowane">🌐</span>}
                  <span className="truncate">{q.meta.title || 'Bez tytułu'}</span>
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {q.header.customerName || '—'}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                {isPub && q.meta.publishedUrl && (
                  <a
                    href={q.meta.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-[#16A34A] hover:text-[#15803D] cursor-pointer"
                    title={`Otwórz: ${q.meta.publishedUrl}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
                {isPub && onUnpublish && (
                  <span
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnpublish(q.meta.slug);
                    }}
                    className="p-1 text-amber-500 hover:text-amber-700 cursor-pointer"
                    title="Cofnij publikację"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                  </span>
                )}
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(q.meta.slug);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Duplikuj"
                >
                  <Icon.Copy width="13" height="13" />
                </span>
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(q.meta.slug);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                  title="Usuń"
                >
                  <Icon.Trash width="13" height="13" />
                </span>
              </div>
            </button>
          );

          return (
            <>
              <div className="px-2 pb-2 pt-1 text-[11px] uppercase tracking-wide text-gray-400 font-medium">
                📝 Twoje wyceny ({drafts.length})
              </div>
              {drafts.length === 0 && (
                <div className="text-center text-gray-400 text-xs py-4 px-3">
                  Brak roboczych wycen.
                </div>
              )}
              {drafts.map((q) => renderItem(q, false))}
              <div className="px-2 pb-2 pt-4 text-[11px] uppercase tracking-wide text-[#16A34A] font-medium border-t border-gray-100 mt-3">
                🌐 Opublikowane ({published.length})
              </div>
              {published.length === 0 && (
                <div className="text-center text-gray-400 text-xs py-4 px-3">
                  Brak opublikowanych wycen.
                </div>
              )}
              {published.map((q) => renderItem(q, true))}
            </>
          );
        })()}
      </div>
      {quote && (
        <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50">
          <div className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
            Strony
          </div>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input
              type="checkbox"
              checked={quote.otherCosts.enabled}
              onChange={(e) => onTogglePage('otherCosts', e.target.checked)}
              className="rounded"
            />
            Other Running Costs
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input
              type="checkbox"
              checked={quote.values.enabled}
              onChange={(e) => onTogglePage('values', e.target.checked)}
              className="rounded"
            />
            Varför välja oss?
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input
              type="checkbox"
              checked={quote.terms.enabled}
              onChange={(e) => onTogglePage('terms', e.target.checked)}
              className="rounded"
            />
            Term &amp; Conditions
          </label>
        </div>
      )}
    </aside>
  );
};
