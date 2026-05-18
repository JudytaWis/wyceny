import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';

export const TotalFixedPriceBlock = ({ block, set, onDelete, onMove }) => (
  <div className="group relative mb-5 pl-5">
    <BlockTools onDelete={onDelete} onMove={onMove} />
    <div className="flex items-center gap-2 mb-1">
      <span className="w-2.5 h-2.5 rounded-full bg-[#2A3978]"></span>
      <EditableText as="span" value={block.label} onChange={(v) => set({ label: v })} className="text-[16px] font-bold text-[#2A3978] uppercase tracking-wide" />
    </div>
    <div className="ml-5 flex items-baseline gap-2">
      <EditableText as="span" value={block.price} onChange={(v) => set({ price: v })} placeholder="0 000" className="text-[18px] font-bold" />
      <span className="text-[15px]">kr inkl moms</span>
    </div>
  </div>
);
