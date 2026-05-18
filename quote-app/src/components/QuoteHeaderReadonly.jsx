// src/components/QuoteHeaderReadonly.jsx
import { BodoLogo } from './shared/BodoLogo.jsx';

export const QuoteHeaderReadonly = ({ header }) => (
  <div className="flex justify-between items-start mb-2">
    <div className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 text-[15px]">
      <div className="font-bold">Offert:</div><div>{header.offerNumber}</div>
      <div className="font-bold">Datum:</div><div>{header.date}</div>
    </div>
    <BodoLogo size="md" />
  </div>
);
