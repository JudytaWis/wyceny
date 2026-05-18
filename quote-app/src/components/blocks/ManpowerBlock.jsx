import { Icon } from '../shared/Icon.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';
import { formatNum, computeRowTotal, manpowerRows } from '../../lib/formula.js';
import { uid } from '../../lib/slug.js';

export const ManpowerBlock = ({ block, set, onDelete, onMove }) => {
  const rows = manpowerRows(block);
  const updateRow = (id, patch) => set({ rows: rows.map(r => r.id === id ? { ...r, ...patch } : r) });
  const deleteRow = (id) => set({ rows: rows.filter(r => r.id !== id) });
  const addRow = () => set({ rows: [...rows, { id: uid(), label: '', hours: '', discount: '', rate: '', total: '', auto: true }] });

  return (
    <div className="group relative mb-5">
      <BlockTools onDelete={onDelete} onMove={onMove} />
      <div className="border-t-2 border-b-2 border-[#5498D9]">
        {rows.map((r, i) => {
          const auto = r.auto !== false;
          const computed = computeRowTotal(r);
          const displayTotal = auto && computed != null ? formatNum(computed) : r.total;
          return (
            <div
              key={r.id}
              className={`grid items-center py-3 px-2 text-[13px] group/row relative ${i > 0 ? 'border-t border-[#5498D9]/40' : ''}`}
              style={{ gridTemplateColumns: 'minmax(140px, 1.2fr) minmax(180px, 2fr) minmax(210px, 1.4fr)', columnGap: '20px' }}
            >
              {/* COL 1 — label */}
              <EditableText
                as="div"
                value={r.label}
                onChange={(v) => updateRow(r.id, { label: v })}
                className="uppercase font-semibold tracking-wide text-[12px]"
                placeholder={i === 0 ? (block.label || 'MANPOWER') : 'NAZWA WIERSZA'}
              />
              {/* COL 2 — free text formula / wyliczenie */}
              <EditableText
                as="div"
                value={r.formula}
                onChange={(v) => updateRow(r.id, { formula: v, auto: true })}
                className="text-left text-[#2A3978]"
                placeholder="np. (850 - 0) × 650   lub dowolny tekst"
              />
              {/* COL 3 — total amount + auto/manual toggle + delete */}
              <div className="flex items-baseline justify-start gap-1.5 relative whitespace-nowrap">
                <EditableText
                  as="span"
                  value={displayTotal}
                  onChange={(v) => updateRow(r.id, { total: v, auto: false })}
                  placeholder="0,00"
                  className="font-bold"
                />
                <span>kr ink moms</span>
                <div className="no-print absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full flex items-center gap-1 opacity-0 group-hover/row:opacity-100">
                  <button
                    onClick={() => updateRow(r.id, { auto: !auto, total: auto ? displayTotal : '' })}
                    className="text-[10px] text-gray-400 hover:text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 bg-white"
                  >
                    {auto ? 'auto' : 'ręczne'}
                  </button>
                  <button
                    onClick={() => deleteRow(r.id)}
                    className="text-red-400 hover:text-red-600 bg-white border border-red-200 rounded p-1"
                    disabled={rows.length <= 1}
                    title={rows.length <= 1 ? 'Nie można usunąć ostatniego wiersza' : 'Usuń wiersz'}
                  >
                    <Icon.Trash width="12" height="12"/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={addRow} className="no-print mt-1 text-xs text-[#6366F1] hover:underline flex items-center gap-1">
        <Icon.Plus width="12" height="12"/> dodaj wiersz w tabeli MANPOWER
      </button>
    </div>
  );
};
