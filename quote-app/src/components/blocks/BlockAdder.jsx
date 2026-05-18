import { useState } from 'react';
import { Icon } from '../shared/Icon.jsx';
import { blockTypes } from '../../lib/quoteModel.js';

export const BlockAdder = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="no-print ml-5 mt-2">
      {!open && (
        <button onClick={() => setOpen(true)} className="text-xs text-[#6366F1] hover:underline flex items-center gap-1">
          <Icon.Plus width="14" height="14"/> dodaj blok
        </button>
      )}
      {open && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded border border-gray-200">
          {blockTypes.map(bt => (
            <button
              key={bt.type}
              onClick={() => { onAdd(bt.type); setOpen(false); }}
              className="text-[11px] px-2 py-1 bg-white border border-gray-200 hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1] rounded"
            >
              {bt.label}
            </button>
          ))}
          <button onClick={() => setOpen(false)} className="text-[11px] px-2 py-1 text-gray-400 hover:text-gray-700">anuluj</button>
        </div>
      )}
    </div>
  );
};
