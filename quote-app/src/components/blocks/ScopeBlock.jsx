import { Icon } from '../shared/Icon.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';

export const ScopeBlock = ({ block, set, onDelete, onMove }) => {
  const updItem = (i, patch) => set({ items: block.items.map((it, idx) => idx === i ? { ...it, ...patch } : it) });
  const addItem = () => set({ items: [...block.items, { text: 'Nytt arbete', strike: false }] });
  const delItem = (i) => set({ items: block.items.filter((_, idx) => idx !== i) });
  return (
    <div className="group relative mb-5 pl-5">
      <BlockTools onDelete={onDelete} onMove={onMove} />
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#2A3978]"></span>
        <EditableText as="span" value={block.label} onChange={(v) => set({ label: v })} className="text-[18px] text-[#2A3978]" />
        <span className="text-[#2A3978]">:</span>
      </div>
      <div className="scope-table-line ml-3 pl-4">
        {block.items.map((it, i) => (
          <div key={i} className="scope-row flex items-start gap-2 py-2 pr-2 group/item">
            <EditableText
              as="div"
              value={it.text}
              onChange={(v) => updItem(i, { text: v })}
              className={`flex-1 text-[15px] ${it.strike ? 'strike' : ''}`}
              multiline
            />
            <div className="no-print opacity-0 group-hover/item:opacity-100 flex gap-1">
              <button onClick={() => updItem(i, { strike: !it.strike })} className="text-gray-400 hover:text-gray-700" title="Przekreśl"><Icon.Strike width="14" height="14"/></button>
              <button onClick={() => delItem(i)} className="text-red-400 hover:text-red-600" title="Usuń"><Icon.Trash width="14" height="14"/></button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="no-print ml-7 mt-2 text-xs text-[#6366F1] hover:underline flex items-center gap-1">
        <Icon.Plus width="12" height="12"/> dodaj wiersz
      </button>
    </div>
  );
};
