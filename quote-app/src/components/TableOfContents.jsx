// src/components/TableOfContents.jsx
// Long-view (continuous) table of contents. Renders only when there are >2 points.
// Each entry is an anchor link that scrolls to the matching Etapp (and SubsectionBlock).
// Visually mirrors the in-document timeline: numbered blue circles for Etapps,
// colored sub-dots that match each SubsectionBlock's accent color.
const SUB_COLORS = {
  blue:   '#5498D9',
  green:  '#22C55E',
  gold:   '#C2A878',
  purple: '#6366F1',
};

export const TableOfContents = ({ points, summary, otherCosts, hideHeading }) => {
  if (!points || points.length <= 2) return null;

  return (
    <nav className="toc mb-10">
      {!hideHeading && (
        <div className="text-[13px] uppercase tracking-[0.15em] text-[#2A3978] font-bold mb-4">
          Innehallsforteckning
        </div>
      )}
      <ol className="space-y-4 list-none">
        {points.map((p, idx) => {
          const subs = (p.blocks || []).filter(b => b.type === 'subsection' && b.label);
          return (
            <li key={p.id} className="flex items-start gap-3">
              {/* Numbered Etapp circle — matches in-document marker */}
              <div className="w-7 h-7 mt-0.5 rounded-full bg-[#5468E5] text-white flex items-center justify-center font-medium text-[12px] flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={`#etapp-${idx + 1}`}
                  className="block group/etapp"
                >
                  <div className="text-[14px] font-semibold text-[#2A3978] group-hover/etapp:text-[#5468E5]">
                    {p.title || '(bez tytulu)'}
                  </div>
                </a>
                {subs.length > 0 && (
                  <ul className="mt-2 space-y-1.5 list-none">
                    {subs.map((s) => {
                      const dotColor = SUB_COLORS[s.color] || SUB_COLORS.blue;
                      return (
                        <li key={s.id} className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: dotColor }}
                          />
                          <a
                            href={`#sub-${s.id}`}
                            className="text-[12.5px] hover:underline"
                            style={{ color: dotColor }}
                          >
                            {s.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </li>
          );
        })}

        {/* GRAND TOTAL — gold-themed entry to match the in-doc summary circle */}
        {summary?.enabled && (
          <li className="flex items-start gap-3 pt-2 border-t border-gray-100">
            <div className="w-7 h-7 mt-0.5 rounded-full bg-[#C2A878] flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <a href="#grand-total" className="block group/total">
                <div className="text-[11px] uppercase tracking-[0.12em] text-gray-500 group-hover/total:text-[#C2A878]">
                  Summa
                </div>
                <div className="text-[14px] font-semibold text-[#2A3978] group-hover/total:text-[#C2A878] mt-0.5">
                  {summary.label || 'GRAND TOTAL'}
                </div>
              </a>
            </div>
          </li>
        )}

        {/* Timpriser / Other Costs page */}
        {otherCosts?.enabled && (
          <li className="flex items-start gap-3">
            <div className="w-7 h-7 mt-0.5 rounded-full bg-[#2A3978] flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <a href="#other-costs" className="block group/oc">
                <div className="text-[11px] uppercase tracking-[0.12em] text-gray-500 group-hover/oc:text-[#5468E5]">
                  Bilaga
                </div>
                <div className="text-[14px] font-semibold text-[#2A3978] group-hover/oc:text-[#5468E5] mt-0.5">
                  {otherCosts.title || 'Timpriser och kostnadsgrunder'}
                </div>
              </a>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};
