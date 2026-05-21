// src/components/pages/CoverPage.jsx
import { BodoLogo } from '../shared/BodoLogo.jsx';
import { PageFooter } from '../shared/PageFooter.jsx';

export const CoverPage = ({ pageNum, totalPages }) => (
  <div className="doc-page doc-page-pink view-a4" style={{ background: 'rgb(158, 171, 186)', display: 'flex', flexDirection: 'column', padding: '14mm' }}>
    <PageFooter num={pageNum} total={totalPages} />
    <div className="flex items-end gap-5 mb-6 shrink-0">
      <BodoLogo size="xl" variant="onWhite" />
    </div>
    <h2 className="text-[24px] font-bold text-[#2A3978] mb-6 leading-tight font-display shrink-0">
      Ett vackert hem. Ett lugnt sinne.<br />Bygg din oas.
    </h2>
    <div className="grid grid-cols-2 gap-6 items-stretch flex-1 min-h-0">
      <div className="flex flex-col gap-3 min-h-0">
        <div className="flex-1 min-h-0 rounded shadow-sm overflow-hidden bg-gray-100">
          <img src="/assets/cover/1-kitchen.webp" alt="Japandi köksrenovering Stockholm" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-h-0 rounded shadow-sm overflow-hidden bg-gray-100">
          <img src="/assets/cover/2-are.webp" alt="Två stugor i Åre" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-h-0 rounded shadow-sm overflow-hidden bg-gray-100">
          <img src="/assets/cover/3-tillbyggnad.webp" alt="Tillbyggnad Stockholm" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex flex-col gap-3 min-h-0">
        <p className="text-[14px] text-[#1A2A4A] leading-relaxed max-w-[300px] shrink-0">
          Våra kunder litar på oss eftersom vi alltid håller deadlines, håller budgeten och erbjuder 20 års garanti.
        </p>
        <div className="flex-[2] min-h-0 rounded shadow-sm overflow-hidden bg-gray-100">
          <img src="/assets/cover/4-djuro.webp" alt="Djurö simhall byggande" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-h-0 rounded shadow-sm overflow-hidden bg-gray-100">
          <img src="/assets/cover/5-platttak.webp" alt="Platt tak Stockholm" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    {/* Bottom contact bar — telefon · hemsida · instagram (BODO blue icons, white glyphs) */}
    <div className="mt-6 pt-4 border-t border-white/40 grid grid-cols-3 gap-4 items-center shrink-0">
      {/* Phone */}
      <a href="tel:+46702784918" className="flex items-center gap-3 justify-start no-underline">
        <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#5498D9' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </span>
        <div className="leading-tight">
          <div className="text-[10px] uppercase text-[#1A2A4A] tracking-wide font-semibold">Telefon</div>
          <div className="font-bold text-[#1A2A4A] text-[14px]">0 702 784 918</div>
        </div>
      </a>
      {/* Website */}
      <a href="https://bodobygg.se" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 justify-center no-underline">
        <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#5498D9' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
          </svg>
        </span>
        <div className="leading-tight">
          <div className="text-[10px] uppercase text-[#1A2A4A] tracking-wide font-semibold">Hemsida</div>
          <div className="font-bold text-[#1A2A4A] text-[14px]">bodobygg.se</div>
        </div>
      </a>
      {/* Instagram */}
      <a href="https://www.instagram.com/bodobygg" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 justify-end no-underline">
        <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#5498D9' }}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="white" stroke="none"/>
          </svg>
        </span>
        <div className="leading-tight">
          <div className="text-[10px] uppercase text-[#1A2A4A] tracking-wide font-semibold">Instagram</div>
          <div className="font-bold text-[#1A2A4A] text-[14px]">@bodobygg</div>
        </div>
      </a>
    </div>
  </div>
);
