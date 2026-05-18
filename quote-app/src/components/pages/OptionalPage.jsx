// src/components/pages/OptionalPage.jsx
import { PageFooter } from '../shared/PageFooter.jsx';
import { QuoteHeaderReadonly } from '../QuoteHeaderReadonly.jsx';
import { OptionalSection } from '../OptionalSection.jsx';

export const OptionalPage = ({ quote, setQuote, pageNum, totalPages }) => {
  const setOptional = (optional) => setQuote({ ...quote, optional });
  return (
    <div className="doc-page doc-page-pink">
      <PageFooter num={pageNum} total={totalPages} />
      <QuoteHeaderReadonly header={quote.header} />
      <div className="mt-4">
        <OptionalSection optional={quote.optional} setOptional={setOptional} hasNext={false} />
      </div>
    </div>
  );
};
