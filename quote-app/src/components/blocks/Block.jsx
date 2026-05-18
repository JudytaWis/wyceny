import { ScopeBlock } from './ScopeBlock.jsx';
import { SubsectionBlock } from './SubsectionBlock.jsx';
import { ManpowerBlock } from './ManpowerBlock.jsx';
import { BulletBlock } from './BulletBlock.jsx';
import { ParagraphBlock } from './ParagraphBlock.jsx';
import { TotalFixedPriceBlock } from './TotalFixedPriceBlock.jsx';
import { BudgetBlock } from './BudgetBlock.jsx';

export const Block = ({ block, onChange, onDelete, onMove }) => {
  const set = (patch) => onChange({ ...block, ...patch });
  switch (block.type) {
    case 'scope': return <ScopeBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'subsection': return <SubsectionBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'manpower': return <ManpowerBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'bullet': return <BulletBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'paragraph': return <ParagraphBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'totalFixedPrice': return <TotalFixedPriceBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    case 'budget':
    case 'budgetEstimate':
      return <BudgetBlock block={block} set={set} onDelete={onDelete} onMove={onMove} />;
    default: return null;
  }
};
