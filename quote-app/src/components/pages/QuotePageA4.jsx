// src/components/pages/QuotePageA4.jsx
import { PageFooter } from '../shared/PageFooter.jsx';
import { Icon } from '../shared/Icon.jsx';
import { QuoteHeader } from '../QuoteHeader.jsx';
import { Point } from '../Point.jsx';
import { blankPoint } from '../../lib/quoteModel.js';

export const QuotePageA4 = ({ quote, setQuote, pointIndex, pageNum, totalPages, isLastPoint }) => {
  const point = quote.points[pointIndex];
  const setHeader = (header) => setQuote({ ...quote, header });

  const updatePoint = (p) => setQuote({ ...quote, points: quote.points.map((pt, i) => i === pointIndex ? p : pt) });
  const deletePoint = () => setQuote({ ...quote, points: quote.points.filter((_, i) => i !== pointIndex) });
  const movePoint = (dir) => {
    const i = pointIndex;
    const j = i + dir;
    if (j < 0 || j >= quote.points.length) return;
    const arr = [...quote.points];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setQuote({ ...quote, points: arr });
  };
  const addPoint = () => setQuote({ ...quote, points: [...quote.points, blankPoint(quote.points.length + 1)] });

  return (
    <div className="doc-page doc-page-pink">
      <PageFooter num={pageNum} total={totalPages} />
      <QuoteHeader header={quote.header} setHeader={setHeader} />
      <div className="mt-4">
        <Point
          point={point}
          idx={pointIndex}
          hasNext={false}
          onChange={updatePoint}
          onDelete={deletePoint}
          onMove={movePoint}
        />
        {isLastPoint && (
          <div className="flex gap-4 mb-4">
            <div className="timeline-col"></div>
            <button
              onClick={addPoint}
              className="no-print px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm rounded-lg flex items-center gap-2 self-start"
            >
              <Icon.Plus width="16" height="16"/> Dodaj punkt (ETAPP) — nowa strona A4
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
