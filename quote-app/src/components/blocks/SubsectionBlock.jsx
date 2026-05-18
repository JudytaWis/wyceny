import { Icon } from '../shared/Icon.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';
import { NestedBlockAdder } from './NestedBlockAdder.jsx';
import { Block } from './Block.jsx';
import { formatNum, computeManpowerTotal } from '../../lib/formula.js';
import { newBlock } from '../../lib/quoteModel.js';

export const SubsectionBlock = ({ block, set, onDelete, onMove }) => {
  const colors = { blue: '#5498D9', green: '#22C55E', gold: '#A49251', purple: '#6366F1' };
  const dot = colors[block.color] || '#5498D9';
  const children = block.children || [];

  const updateChild = (id, nb) => set({ children: children.map(b => b.id === id ? nb : b) });
  const deleteChild = (id) => set({ children: children.filter(b => b.id !== id) });
  const moveChild = (id, dir) => {
    const i = children.findIndex(b => b.id === id);
    const j = i + dir;
    if (j < 0 || j >= children.length) return;
    const arr = [...children];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set({ children: arr });
  };
  const addChild = (type) => set({ children: [...children, newBlock(type)] });

  // Auto-sum from nested manpower blocks if useAuto enabled
  const autoSum = children
    .filter(c => c.type === 'manpower')
    .reduce((s, c) => {
      const t = computeManpowerTotal(c);
      return s + (t || 0);
    }, 0);
  const displayedPrice = (!block.price && autoSum > 0) ? formatNum(autoSum) : block.price;

  return (
    <div className="group relative mb-5">
      <BlockTools onDelete={onDelete} onMove={onMove} />
      {/* Header row: dot + label + colors picker */}
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }}></span>
        <EditableText as="span" value={block.label} onChange={(v) => set({ label: v })} className="text-[16px]" style={{ color: dot }} placeholder="Nazwa subpunktu" />
        <div className="no-print ml-2 flex gap-1 opacity-0 group-hover:opacity-100">
          {Object.entries(colors).map(([k, v]) => (
            <button
              key={k}
              onClick={() => set({ color: k })}
              className="w-4 h-4 rounded-full border-2"
              style={{ background: v, borderColor: block.color === k ? '#000' : 'transparent' }}
              title={k}
            />
          ))}
        </div>
      </div>
      {/* Price row */}
      <div className="ml-5 flex items-baseline gap-2 mb-2 flex-wrap">
        {block.oldPrice && <span className="strike text-[15px]">{block.oldPrice}</span>}
        <EditableText as="span" value={displayedPrice} onChange={(v) => set({ price: v })} className="text-[15px] font-medium" placeholder={autoSum > 0 ? formatNum(autoSum) : '0,00'} />
        <span className="text-[15px] text-gray-600">kr inkl moms</span>
        <button
          onClick={() => {
            if (block.oldPrice) { set({ oldPrice: '' }); }
            else { set({ oldPrice: block.price || '', price: '' }); }
          }}
          className="no-print text-[10px] text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 ml-1 border border-gray-200 rounded px-1.5 py-0.5"
          title={block.oldPrice ? 'Usuń przekreśloną cenę' : 'Przekreśl obecną cenę i wpisz nową'}
        >
          {block.oldPrice ? 'cofnij ✕' : 'skreśl cenę'}
        </button>
        {autoSum > 0 && !block.price && (
          <span className="no-print text-[10px] text-gray-400 italic">↑ auto-policzone z MANPOWER</span>
        )}
      </div>
      {/* Nested children blocks */}
      {children.length > 0 && (
        <div className="ml-5 mt-3">
          {children.map(child => (
            <Block
              key={child.id}
              block={child}
              onChange={(nb) => updateChild(child.id, nb)}
              onDelete={() => deleteChild(child.id)}
              onMove={(dir) => moveChild(child.id, dir)}
            />
          ))}
        </div>
      )}
      {/* Add nested block */}
      <div className="no-print ml-5 mt-2">
        <NestedBlockAdder onAdd={addChild} color={dot} />
      </div>
    </div>
  );
};
