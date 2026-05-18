// src/components/pages/SummaryPage.jsx
import { PageFooter } from '../shared/PageFooter.jsx';
import { QuoteHeaderReadonly } from '../QuoteHeaderReadonly.jsx';
import { SummarySection } from '../SummarySection.jsx';
import { parseNum, formatNum } from '../../lib/formula.js';

export const SummaryPage = ({ quote, setQuote, pageNum, totalPages }) => {
  const setSummary = (summary) => setQuote({ ...quote, summary });
  const computedTotal = quote.points.reduce((s, p) => s + (parseNum(p.mainPrice) || 0), 0);
  const autoTotal = computedTotal > 0 ? formatNum(computedTotal) : '';
  return (
    <div className="doc-page doc-page-pink view-a4">
      <PageFooter num={pageNum} total={totalPages} />
      <QuoteHeaderReadonly header={quote.header} />
      <div className="mt-16">
        <SummarySection summary={quote.summary} setSummary={setSummary} hasNext={false} autoTotal={autoTotal} />
      </div>
    </div>
  );
};
