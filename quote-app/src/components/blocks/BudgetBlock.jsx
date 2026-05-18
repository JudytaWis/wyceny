import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';

export const BudgetBlock = ({ block, set, onDelete, onMove }) => (
  <div className="group relative mb-5 pl-5">
    <BlockTools onDelete={onDelete} onMove={onMove} />
    <div className="flex items-center gap-2 mb-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#2A3978]"></span>
      <EditableText as="span" value={block.label} onChange={(v) => set({ label: v })} className="text-[16px] font-bold text-[#2A3978]" />
    </div>
    <div className="ml-5 space-y-1 text-[14px]">
      <EditableText as="div" value={block.workType} onChange={(v) => set({ workType: v })} placeholder="Arbetskostnad" className="font-medium" />
      <div>Beräknat ca <EditableText as="span" value={block.hours} onChange={(v) => set({ hours: v })} placeholder="1 000" /> timmar</div>
      <div>à <EditableText as="span" value={block.rate} onChange={(v) => set({ rate: v })} placeholder="650" /> kr/timme inkl moms</div>
      <div>≈ <EditableText as="span" value={block.total} onChange={(v) => set({ total: v })} placeholder="650 000" /> kr inkl moms</div>
      {(block.min || block.max) && (
        <div className="font-bold mt-2">
          (Arbetsram: <EditableText as="span" value={block.min} onChange={(v) => set({ min: v })} placeholder="605 000" /> – <EditableText as="span" value={block.max} onChange={(v) => set({ max: v })} placeholder="695 000" /> kr)
        </div>
      )}
    </div>
  </div>
);
