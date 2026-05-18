import { useState } from 'react';
import { Icon } from '../shared/Icon.jsx';
import { subBlockTypes } from '../../lib/quoteModel.js';

export const NestedBlockAdder = ({ onAdd, color }) => {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={() => setOpen(true)} className="text-[11px] hover:underline flex items-center gap-1" style={{ color }}>
      <Icon.Plus width="11" height="11"/> dodaj w subpunkcie
    </button>
  );
  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded border border-gray-200">
      {subBlockTypes.map(bt => (
        <button
          key={bt.type}
          onClick={() => { onAdd(bt.type); setOpen(false); }}
          className="text-[11px] px-2 py-1 bg-white border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 rounded"
        >
          {bt.label}
        </button>
      ))}
      <button onClick={() => setOpen(false)} className="text-[11px] px-2 py-1 text-gray-400 hover:text-gray-700">anuluj</button>
    </div>
  );
};
