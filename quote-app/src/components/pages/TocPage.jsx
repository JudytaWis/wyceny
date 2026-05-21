// src/components/pages/TocPage.jsx
// Standalone Table-of-Contents page — only used in long/continuous view.
// Placed as page 2 right after the cover. Anchor links jump to the matching
// Etapp on the QuotePage (works in editor and in standalone HTML export).
import { PageFooter } from '../shared/PageFooter.jsx';
import { QuoteHeader } from '../QuoteHeader.jsx';
import { TableOfContents } from '../TableOfContents.jsx';

export const TocPage = ({ quote, setQuote, pageNum, totalPages }) => {
  const setHeader = (header) => setQuote({ ...quote, header });
  return (
    <div className="doc-page doc-page-pink">
      <PageFooter num={pageNum} total={totalPages} />
      <QuoteHeader header={quote.header} setHeader={setHeader} />
      <h2 className="text-[22px] font-medium text-black mb-6 mt-16">Innehallsforteckning</h2>
      <TableOfContents
        points={quote.points}
        summary={quote.summary}
        otherCosts={quote.otherCosts}
        hideHeading
      />
    </div>
  );
};
