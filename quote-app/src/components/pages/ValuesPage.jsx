// src/components/pages/ValuesPage.jsx
import { PageFooter } from '../shared/PageFooter.jsx';

export const ValuesPage = ({ pageNum, totalPages }) => (
  <div className="doc-page doc-page-pink" style={{ background: 'rgb(158, 171, 186)' }}>
    <PageFooter num={pageNum} total={totalPages} />
    <div className="bg-white/30 -mx-[18mm] py-5 px-[18mm] text-center mb-8">
      <h2 className="text-[22px] text-[#1A2A4A] font-bold font-display">Varför välja oss?</h2>
    </div>
    <div className="grid grid-cols-3 gap-x-8 gap-y-9 mb-10">
      {[
        ['Offert inom 5 dagar.', null, 'Offert inom '],
        ['Vi förhandlar inte om priserna vi döljer inga kostnader.', null, 'Vi förhandlar inte om priserna '],
        ['Vi anpassar arbetsomfattningen efter din budget och behov.', null, ''],
        ['Snabb och solid', 'Vi har en avancerad rekryteringsprocess där vi noggrant granskar våra medarbetare för erfarenhet och kvalitet.', ''],
        ['De billigaste materialen av hög kvalitet', 'vi kan importera dem från Polen åt dig.', ''],
        ['Vi erbjuder alla typer av byggtjänster komplett service.', null, ''],
        ['Säkerhet', 'vi använder toppmoderna byggutrustningar och säkerhetsåtgärder.', ''],
        ['Vi hjälper dig med fastighetsköp och värdering av bostäder före och efter renovering.', null, ''],
        ['Vi ger belöningar för att rekommendera oss till dina vänner.', null, ''],
      ].map(([bold, body], i) => (
        <div key={i} className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#5468E5] text-white flex items-center justify-center mx-auto mb-3 text-[18px] font-medium">{i + 1}</div>
          <div className="text-[13.5px] leading-relaxed"><span className="font-bold">{bold}</span>{body && <><br />{body}</>}</div>
        </div>
      ))}
    </div>
    <div className="bg-white/30 -mx-[18mm] py-5 px-[18mm] text-center mb-8">
      <h2 className="text-[20px] text-[#1A2A4A] font-bold font-display">Varför är det fördelaktigt att samarbeta med oss på lång sikt?</h2>
    </div>
    <div className="grid grid-cols-2 gap-x-12 gap-y-10">
      {[
        ['Vi erbjuder upp till 20 års garanti', 'Om det uppstår problem kommer vi och utför reparationen kostnadsfritt.'],
        ['Lojalitetskort för återkommande kunder', 'Du får rabatter på framtida projekt.'],
        ['Prioriterad service', 'Om du behöver hjälp snabbt är vi hos dig inom 3 dagar.'],
        ['Dubbel belöning', 'Rekommendera oss till vänner och skriv en recension, och vi belönar dig dubbel gång för din rekommendation.'],
      ].map(([bold, body], i) => (
        <div key={i} className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#A49251] text-white flex items-center justify-center mx-auto mb-3 text-[18px] font-medium">{i + 1}</div>
          <div className="text-[13.5px] leading-relaxed"><span className="font-bold">{bold}</span><br />{body}</div>
        </div>
      ))}
    </div>
  </div>
);
