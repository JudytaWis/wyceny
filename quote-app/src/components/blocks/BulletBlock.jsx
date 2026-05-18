import { Icon } from '../shared/Icon.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';

export const BulletBlock = ({ block, set, onDelete, onMove }) => {
  const updItem = (i, patch) => set({ items: block.items.map((it, idx) => idx === i ? { ...it, ...patch } : it) });
  const addItem = () => set({ items: [...block.items, { text: 'Punkt', strike: false, bold: false }] });
  const delItem = (i) => set({ items: block.items.filter((_, idx) => idx !== i) });
  return (
    <div className="group relative mb-5 pl-5">
      <BlockTools onDelete={onDelete} onMove={onMove} />
      <div className="space-y-1.5">
        {block.items.map((it, i) => (
          <div key={i} className="flex items-start gap-2 group/item">
            <span className="text-gray-700 mt-0.5">•</span>
            <EditableText
              as="div"
              value={it.text}
              onChange={(v) => updItem(i, { text: v })}
              className={`flex-1 text-[14px] ${it.strike ? 'strike' : ''} ${it.bold ? 'font-bold' : ''}`}
              multiline
            />
            <div className="no-print opacity-0 group-hover/item:opacity-100 flex gap-1">
              <button onClick={() => updItem(i, { bold: !it.bold })} className="text-gray-400 hover:text-gray-700 text-[11px] font-bold">B</button>
              <button onClick={() => updItem(i, { strike: !it.strike })} className="text-gray-400 hover:text-gray-700"><Icon.Strike width="14" height="14"/></button>
              <button onClick={() => delItem(i)} className="text-red-400 hover:text-red-600"><Icon.Trash width="14" height="14"/></button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="no-print mt-1 text-xs text-[#6366F1] hover:underline flex items-center gap-1">
        <Icon.Plus width="12" height="12"/> dodaj punkt
      </button>
    </div>
  );
};
