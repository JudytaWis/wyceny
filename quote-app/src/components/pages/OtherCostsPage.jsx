// src/components/pages/OtherCostsPage.jsx
import { PageFooter } from '../shared/PageFooter.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { Icon } from '../shared/Icon.jsx';
import { QuoteHeaderReadonly } from '../QuoteHeaderReadonly.jsx';

export const OtherCostsPage = ({ otherCosts, setOtherCosts, header, pageNum, totalPages }) => {
  if (!otherCosts.enabled) return null;
  const updRow = (i, patch) => setOtherCosts({ ...otherCosts, rows: otherCosts.rows.map((r, idx) => idx === i ? { ...r, ...patch } : r) });
  const addRow = () => setOtherCosts({ ...otherCosts, rows: [...otherCosts.rows, { item: 'Ny rad', unit: 'tur', price: '0' }] });
  const delRow = (i) => setOtherCosts({ ...otherCosts, rows: otherCosts.rows.filter((_, idx) => idx !== i) });
  return (
    <div id="other-costs" className="doc-page doc-page-pink group/page relative" style={{ scrollMarginTop: '24px' }}>
      <PageFooter num={pageNum} total={totalPages} />
      <button
        onClick={() => {
          if (confirm('Usunąć całą stronę „Timpriser och kostnadsgrunder"? Można ją włączyć z powrotem w sidebarze.')) {
            setOtherCosts({ ...otherCosts, enabled: false });
          }
        }}
        className="no-print absolute top-4 right-4 opacity-0 group-hover/page:opacity-100 transition px-2.5 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-500 text-xs rounded flex items-center gap-1.5 shadow-sm"
        title="Usun cala strone"
      >
        <Icon.Trash width="13" height="13"/> Usun strone
      </button>
      <QuoteHeaderReadonly header={header} />
      <EditableText as="h2" value={otherCosts.title} onChange={(v) => setOtherCosts({ ...otherCosts, title: v })} className="text-[22px] font-medium text-black mb-6 mt-16" />
      <div className="border-t-2 border-[#2A3978]">
        {otherCosts.rows.map((r, i) => (
          <div key={i} className="grid items-center gap-4 py-4 px-2 border-b-2 border-[#2A3978] group/row"
               style={{ gridTemplateColumns: '2fr 1.5fr 1fr 32px' }}>
            <EditableText as="span" value={r.item} onChange={(v) => updRow(i, { item: v })} className="text-[14px]" />
            <EditableText as="span" value={r.unit} onChange={(v) => updRow(i, { unit: v })} className="text-[14px] text-center text-gray-700" />
            <div className="text-right">
              <EditableText as="span" value={r.price} onChange={(v) => updRow(i, { price: v })} className="text-[15px] font-bold" />
            </div>
            <button onClick={() => delRow(i)} className="no-print opacity-0 group-hover/row:opacity-100 text-red-400 hover:text-red-600 justify-self-end"><Icon.Trash width="14" height="14"/></button>
          </div>
        ))}
      </div>
      <button onClick={addRow} className="no-print mt-2 text-xs text-[#6366F1] hover:underline flex items-center gap-1">
        <Icon.Plus width="12" height="12"/> dodaj wiersz
      </button>
    </div>
  );
};
