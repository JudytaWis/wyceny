// src/components/Point.jsx
import { Icon } from './shared/Icon.jsx';
import { EditableText } from './shared/EditableText.jsx';
import { TimelineRow } from './TimelineRow.jsx';
import { Block } from './blocks/Block.jsx';
import { BlockAdder } from './blocks/BlockAdder.jsx';
import { newBlock } from '../lib/quoteModel.js';

export const Point = ({ point, idx, hasNext, onChange, onDelete, onMove }) => {
  const set = (patch) => onChange({ ...point, ...patch });
  const updateBlock = (id, nb) => set({ blocks: point.blocks.map(b => b.id === id ? nb : b) });
  const deleteBlock = (id) => set({ blocks: point.blocks.filter(b => b.id !== id) });
  const moveBlock = (id, dir) => {
    const i = point.blocks.findIndex(b => b.id === id);
    const j = i + dir;
    if (j < 0 || j >= point.blocks.length) return;
    const arr = [...point.blocks];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set({ blocks: arr });
  };
  const addBlock = (type) => set({ blocks: [...point.blocks, newBlock(type)] });

  const circle = (
    <div className="w-10 h-10 rounded-full bg-[#5468E5] text-white flex items-center justify-center font-medium text-[15px] flex-shrink-0">
      {idx + 1}
    </div>
  );
  const hoverTools = (
    <>
      <button onClick={() => onMove(-1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowUp width="14" height="14"/></button>
      <button onClick={() => onMove(1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowDown width="14" height="14"/></button>
      <button onClick={onDelete} className="w-7 h-7 rounded bg-white border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500"><Icon.Trash width="14" height="14"/></button>
    </>
  );

  return (
    <TimelineRow hasNext={hasNext} circle={circle} hoverTools={hoverTools}>
      {/* Title + main price */}
      <EditableText
        as="div"
        value={point.title}
        onChange={(v) => set({ title: v })}
        className="text-[18px] font-bold text-black leading-tight"
        placeholder="Kitchen Renovation"
        multiline
      />
      <div className="text-[15px] mt-0.5 mb-3">
        <EditableText as="span" value={point.mainPrice} onChange={(v) => set({ mainPrice: v })} placeholder="0,00" className="font-medium" />
        <span className="text-gray-600"> kr inkl moms</span>
      </div>
      {point.subtitle && (
        <EditableText as="div" value={point.subtitle} onChange={(v) => set({ subtitle: v })} className="text-[13px] text-gray-600 mt-1 mb-2" multiline placeholder="(opcjonalny podtytuł)" />
      )}

      {/* Nested blocks */}
      <div className="pl-4">
        {point.blocks.map((b) => (
          <Block
            key={b.id}
            block={b}
            onChange={(nb) => updateBlock(b.id, nb)}
            onDelete={() => deleteBlock(b.id)}
            onMove={(dir) => moveBlock(b.id, dir)}
          />
        ))}
        <BlockAdder onAdd={addBlock} />
      </div>
    </TimelineRow>
  );
};
