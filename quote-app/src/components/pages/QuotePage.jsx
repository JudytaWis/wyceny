// src/components/pages/QuotePage.jsx
import { PageFooter } from '../shared/PageFooter.jsx';
import { Icon } from '../shared/Icon.jsx';
import { QuoteHeader } from '../QuoteHeader.jsx';
import { SummarySection } from '../SummarySection.jsx';
import { OptionalSection } from '../OptionalSection.jsx';
import { Point } from '../Point.jsx';
import { parseNum, formatNum } from '../../lib/formula.js';
import { blankPoint } from '../../lib/quoteModel.js';

export const QuotePage = ({ quote, setQuote, pageNum, totalPages }) => {
  const setHeader = (header) => setQuote({ ...quote, header });
  const setSummary = (summary) => setQuote({ ...quote, summary });
  const setOptional = (optional) => setQuote({ ...quote, optional });

  const updatePoint = (id, p) => setQuote({ ...quote, points: quote.points.map(pt => pt.id === id ? p : pt) });
  const deletePoint = (id) => setQuote({ ...quote, points: quote.points.filter(pt => pt.id !== id) });
  const movePoint = (id, dir) => {
    const i = quote.points.findIndex(pt => pt.id === id);
    const j = i + dir;
    if (j < 0 || j >= quote.points.length) return;
    const arr = [...quote.points];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setQuote({ ...quote, points: arr });
  };
  const addPoint = () => setQuote({ ...quote, points: [...quote.points, blankPoint(quote.points.length + 1)] });

  // Auto-sum from points' mainPrice
  const computedTotal = quote.points.reduce((s, p) => s + (parseNum(p.mainPrice) || 0), 0);
  const autoTotal = computedTotal > 0 ? formatNum(computedTotal) : '';

  // Determine timeline sequence to know hasNext for each row
  const summaryEnabled = quote.summary.enabled;
  const optionalEnabled = quote.optional.enabled;
  const pointHasNext = (idx) => idx < quote.points.length - 1 || summaryEnabled || optionalEnabled;
  const summaryHasNext = optionalEnabled;

  return (
    <div className="doc-page doc-page-pink">
      <PageFooter num={pageNum} total={totalPages} />
      <QuoteHeader header={quote.header} setHeader={setHeader} />
      <div className="mt-4">
        {quote.points.map((pt, idx) => (
          <Point
            key={pt.id}
            point={pt}
            idx={idx}
            hasNext={pointHasNext(idx)}
            onChange={(p) => updatePoint(pt.id, p)}
            onDelete={() => deletePoint(pt.id)}
            onMove={(dir) => movePoint(pt.id, dir)}
          />
        ))}
        <div className="flex gap-4 mb-4">
          <div className="timeline-col">
            {(summaryEnabled || optionalEnabled) && <div className="timeline-line-fill" style={{ marginTop: 0 }}></div>}
          </div>
          <button onClick={addPoint} className="no-print px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm rounded-lg flex items-center gap-2 self-start">
            <Icon.Plus width="16" height="16"/> Dodaj punkt (ETAPP)
          </button>
        </div>
        <SummarySection summary={quote.summary} setSummary={setSummary} hasNext={summaryHasNext} autoTotal={autoTotal} />
        <OptionalSection optional={quote.optional} setOptional={setOptional} hasNext={false} />
      </div>
    </div>
  );
};
