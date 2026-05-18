// src/components/TopBar.jsx
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
