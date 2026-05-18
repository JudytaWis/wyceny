// src/components/OptionalSection.jsx
import { Icon } from './shared/Icon.jsx';
import { EditableText } from './shared/EditableText.jsx';
import { TimelineRow } from './TimelineRow.jsx';

export const OptionalSection = ({ optional, setOptional, hasNext }) => {
  if (!optional.enabled) {
    return (
      <div className="flex gap-4 mb-2">
        <div className="timeline-col">
          {hasNext && <div className="timeline-line-fill" style={{ marginTop: 0 }}></div>}
        </div>
        <button onClick={() => setOptional({ ...optional, enabled: true, items: [{ text: 'Optional work' }] })} className="no-print text-xs text-[#6366F1] hover:underline flex items-center gap-1 self-start">
          <Icon.Plus width="12" height="12"/> dodaj sekcję Optional works
        </button>
      </div>
    );
  }
  const updItem = (i, patch) => setOptional({ ...optional, items: optional.items.map((it, idx) => idx === i ? { ...it, ...patch } : it) });
  const addItem = () => setOptional({ ...optional, items: [...optional.items, { text: 'Nowa opcja' }] });
  const delItem = (i) => setOptional({ ...optional, items: optional.items.filter((_, idx) => idx !== i) });
  const circle = (
    <div className="w-10 h-10 rounded-full bg-[#A49251] flex items-center justify-center flex-shrink-0 text-white">
      <Icon.Star width="20" height="20" />
    </div>
  );
  const hoverTools = (
    <button onClick={() => setOptional({ ...optional, enabled: false })} className="w-7 h-7 rounded bg-white border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500"><Icon.Trash width="14" height="14"/></button>
  );
  return (
    <TimelineRow hasNext={hasNext} circle={circle} hoverTools={hoverTools}>
      <div className="font-bold text-[16px]">Optional works</div>
      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
        {optional.oldPrice ? (
          <span className="strike text-[14px]"><EditableText as="span" value={optional.oldPrice} onChange={(v) => setOptional({ ...optional, oldPrice: v })} /></span>
        ) : (
          <EditableText as="span" value={optional.oldPrice} onChange={(v) => setOptional({ ...optional, oldPrice: v })} className="no-print text-[11px] text-gray-300 italic" placeholder="(stara cena)" />
        )}
        <EditableText as="span" value={optional.newPrice} onChange={(v) => setOptional({ ...optional, newPrice: v })} placeholder="0,00" className="text-[14px] text-[#22C55E] font-semibold" />
        <span className="text-[14px]">kr inkl moms</span>
      </div>
      <div className="mt-3 ml-4 space-y-1">
        {optional.items.map((it, i) => (
          <div key={i} className="flex items-start gap-2 group/item">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5498D9] mt-2 flex-shrink-0"></span>
            <EditableText as="div" value={it.text} onChange={(v) => updItem(i, { text: v })} className="text-[14px] text-[#5498D9] flex-1" multiline />
            <button onClick={() => delItem(i)} className="no-print opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-600"><Icon.Trash width="14" height="14"/></button>
          </div>
        ))}
        <button onClick={addItem} className="no-print text-xs text-[#6366F1] hover:underline flex items-center gap-1 mt-1">
          <Icon.Plus width="12" height="12"/> dodaj opcję
        </button>
      </div>
    </TimelineRow>
  );
};
