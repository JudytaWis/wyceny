// src/components/pages/TermsPage.jsx
import { BodoLogo } from '../shared/BodoLogo.jsx';
import { PageFooter } from '../shared/PageFooter.jsx';

export const TermsPage = ({ header, terms, pageNum, totalPages }) => (
  <div className="doc-page doc-page-pink">
    <PageFooter num={pageNum} total={totalPages} />
    <div className="flex justify-between items-start mb-12">
      <div className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 text-[15px]">
        <div className="font-bold">Offert:</div><div>{header.offerNumber}</div>
        <div className="font-bold">Datum:</div><div>{header.date}</div>
      </div>
      <BodoLogo size="md" />
    </div>
    <h2 className="text-center font-bold text-[18px] mb-6">Regler och giltighetstid för offert</h2>
    <p className="text-[14px] mb-4">Offert gäller i {terms.validity} dagar från ovanstående datum.</p>
    <div className="mb-6 text-[14px]">
      <div className="font-bold">Betalningspolicy</div>
      <div>{terms.paymentPolicy}</div>
      <div>BODO Build and Track AB</div>
      <div>Lillkalmarvägen 30A · 182 65 Djursholm</div>
      <div>office@buildandtrack.com</div>
    </div>
    <div className="text-[13px] space-y-4 mb-12 leading-relaxed">
      <p>&nbsp;&nbsp;&nbsp;Vid oförutsedda förhållanden som inte kunnat bedömas utifrån nuvarande handlingar sker ekonomisk genomgång och skriftligt godkännande innan vidare arbete.</p>
      <p>&nbsp;&nbsp;&nbsp;Allt byggnadsarbete kommer att utföras i enlighet med de krav och föreskrifter i lag och byggnormer som gäller i Sverige. I värderingen ingår inte kostnader för inredning och utrustning såsom möbler, vitvaror, belysning etc. om de inte ingår i avtalet som en separat post.</p>
      <p>&nbsp;&nbsp;&nbsp;Betalningsvillkor kommer att anges i avtalet och kommer att bero på byggskeden och den tid som krävs för att slutföra varje etapp.</p>
    </div>
    <h3 className="text-center text-[24px] font-light mb-8 font-display">Godkännande</h3>
    <div className="grid grid-cols-2 gap-12 mb-10">
      <div>
        <div className="text-[18px] mb-3">Kund:</div>
        <div className="text-gray-600 text-[15px] leading-relaxed">
          <div>{header.customerName || '—'}</div>
          <div>{header.customerAddress || '—'}</div>
          <div>{header.projectName || ''}</div>
        </div>
      </div>
      <div>
        <div className="text-[18px] mb-3">Entreprenör:</div>
        <div className="text-gray-600 text-[15px] leading-relaxed">
          <div>BODO Build and Track AB</div>
          <div>Lillkalmarvägen 30A</div>
          <div>182 65 Djursholm</div>
          <div>office@buildandtrack.com</div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-12 mt-12">
      <div>
        <div className="text-[16px] mb-2">Datum:</div>
        <div className="border-b border-black h-5"></div>
      </div>
      <div>
        <div className="text-[16px] mb-2">Kundsignatur:</div>
        <div className="border-b border-black h-5"></div>
      </div>
    </div>
  </div>
);
