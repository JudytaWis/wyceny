// src/components/SummarySection.jsx
import { Icon } from './shared/Icon.jsx';
import { EditableText } from './shared/EditableText.jsx';
import { TimelineRow } from './TimelineRow.jsx';

export const SummarySection = ({ summary, setSummary, hasNext, autoTotal }) => {
  if (!summary.enabled) {
    return (
      <div className="flex gap-4 mb-2">
        <div className="timeline-col">
          {hasNext && <div className="timeline-line-fill" style={{ marginTop: 0 }}></div>}
        </div>
        <button onClick={() => setSummary({ ...summary, enabled: true })} className="no-print text-xs text-[#6366F1] hover:underline flex items-center gap-1 self-start">
          <Icon.Plus width="12" height="12"/> dodaj sekcję SUMMARY ALL POINTS
        </button>
      </div>
    );
  }
  const set = (k) => (v) => setSummary({ ...summary, [k]: v });
  const taxMode = summary.taxMode || 'rot';   // 'rot' | 'rut' | 'none'
  const setTaxMode = (m) => setSummary({ ...summary, taxMode: m });
  const beforeLabel = taxMode === 'rot' ? 'before ROT' : taxMode === 'rut' ? 'before RUT' : '';
  const afterLabel = taxMode === 'rot' ? 'after ROT' : taxMode === 'rut' ? 'after RUT' : '';
  const beforeDisplay = (!summary.beforeROT && autoTotal) ? autoTotal : summary.beforeROT;
  const circle = <div className="w-10 h-10 rounded-full bg-[#5468E5] flex-shrink-0"></div>;
  const hoverTools = (
    <button onClick={() => setSummary({ ...summary, enabled: false })} className="w-7 h-7 rounded bg-white border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500"><Icon.Trash width="14" height="14"/></button>
  );
  return (
    <TimelineRow hasNext={hasNext} circle={circle} hoverTools={hoverTools}>
      <div className="pt-1.5">
        <div className="flex items-baseline gap-3 flex-wrap">
          <EditableText as="span" value={summary.label} onChange={set('label')} className="text-[14px] tracking-wide uppercase font-medium" />
          {summary.original ? (
            <span className="strike text-[15px] font-bold">
              <EditableText as="span" value={summary.original} onChange={set('original')} />
            </span>
          ) : (
            <EditableText as="span" value={summary.original} onChange={set('original')} className="no-print text-[11px] text-gray-300 italic" placeholder="(stara suma — opcjonalne)" />
          )}
          <span className="text-[14px]">kr inkl moms</span>
          {/* Tax-mode picker (editor-only) */}
          <div className="no-print flex items-center bg-gray-100 rounded-md p-0.5 text-[11px] ml-2">
            {['rot', 'rut', 'none'].map(m => (
              <button
                key={m}
                onClick={() => setTaxMode(m)}
                className={`px-2 py-0.5 rounded transition ${taxMode === m ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                title={m === 'none' ? 'Bez ROT/RUT — pokaż tylko sumę' : `Pokaż before/after ${m.toUpperCase()}`}
              >
                {m === 'none' ? 'brak' : m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-12 mt-2 space-y-1">
          {taxMode === 'none' ? (
            <div className="text-[15px] font-bold flex items-baseline gap-1 flex-wrap">
              <EditableText as="span" value={summary.afterROT || beforeDisplay || ''} onChange={set('afterROT')} placeholder={autoTotal || '0,00'} />
              <span className="font-normal">kr inkl moms</span>
              {summary.afterROT && (
                <button
                  onClick={() => set('afterROT')('')}
                  className="no-print text-[10px] text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 ml-1 font-normal"
                  title="Wyczysc"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="text-[14px] group/before flex items-baseline gap-1 flex-wrap">
                <EditableText as="span" value={beforeDisplay} onChange={set('beforeROT')} placeholder={autoTotal || '0,00'} className={!summary.beforeROT && autoTotal ? 'text-gray-500' : 'font-medium'} />
                <span>kr inkl moms</span>
                <span className="text-[#5498D9]">{beforeLabel}</span>
                {!summary.beforeROT && autoTotal && (
                  <span className="no-print text-[10px] text-gray-400 italic ml-1">(auto-suma {autoTotal})</span>
                )}
                {summary.beforeROT && autoTotal && summary.beforeROT !== autoTotal && (
                  <button
                    onClick={() => set('beforeROT')('')}
                    className="no-print text-[10px] text-[#6366F1] hover:underline border border-[#6366F1]/40 rounded px-1.5 py-0.5 ml-1"
                    title={`Wyczysc reczna wartosc i wroc do auto-sumy (${autoTotal})`}
                  >
                    ↻ auto ({autoTotal})
                  </button>
                )}
              </div>
              <div className="text-[14px] font-bold flex items-baseline gap-1 flex-wrap">
                <EditableText as="span" value={summary.afterROT} onChange={set('afterROT')} placeholder="0,00" />
                <span className="font-normal">kr inkl moms</span>
                <span className="text-[#22C55E] font-normal">{afterLabel}</span>
                {summary.afterROT && (
                  <button
                    onClick={() => set('afterROT')('')}
                    className="no-print text-[10px] text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 ml-1 font-normal"
                    title="Wyczysc"
                  >
                    ✕
                  </button>
                )}
              </div>
            </>
          )}
          {/* Extra info — yellow callout */}
          <div className="mt-3 flex items-start gap-2">
            <span className="w-2.5 h-2.5 mt-2 rounded-full flex-shrink-0 bg-[#F59E0B]"></span>
            <EditableText
              as="div"
              value={summary.extraInfo || ''}
              onChange={set('extraInfo')}
              placeholder="Dodatkowe informacje / gratis"
              className="text-[13px] text-[#92400E] font-medium flex-1"
              multiline
            />
          </div>
        </div>
      </div>
    </TimelineRow>
  );
};
