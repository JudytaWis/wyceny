import { EditableText } from '../shared/EditableText.jsx';
import { BlockTools } from './BlockTools.jsx';

export const ParagraphBlock = ({ block, set, onDelete, onMove }) => (
  <div className="group relative mb-5 pl-5">
    <BlockTools onDelete={onDelete} onMove={onMove} />
    <EditableText
      as="div"
      value={block.text}
      onChange={(v) => set({ text: v })}
      className="text-[14px] leading-relaxed text-gray-800 whitespace-pre-wrap"
      multiline
    />
  </div>
);
