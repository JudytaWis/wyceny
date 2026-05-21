// src/components/pages/QuotePageA4.jsx
// Renders one quote point as one OR MORE A4 cards.
// If the point's content overflows a single A4, splits at block boundaries
// and renders continuation cards below — blue timeline line continues through.
import { useState, useLayoutEffect, useRef } from 'react';
import { PageFooter } from '../shared/PageFooter.jsx';
import { Icon } from '../shared/Icon.jsx';
import { EditableText } from '../shared/EditableText.jsx';
import { QuoteHeader } from '../QuoteHeader.jsx';
import { TimelineRow } from '../TimelineRow.jsx';
import { Block } from '../blocks/Block.jsx';
import { BlockAdder } from '../blocks/BlockAdder.jsx';
import { newBlock, blankPoint } from '../../lib/quoteModel.js';

// A4 height in CSS pixels. 297mm * (96 / 25.4) = ~1122.5px.
// The doc-page has 18mm padding top + bottom, content area bottom is at ~1054px.
const A4_HEIGHT_PX = 1122;
const A4_CONTENT_BOTTOM_PX = 1054;   // y-coordinate below which a block would overflow

export const QuotePageA4 = ({ quote, setQuote, pointIndex, pageNum, totalPages, isLastPoint }) => {
  const point = quote.points[pointIndex];
  const isFirstPoint = pointIndex === 0;

  const setHeader = (header) => setQuote({ ...quote, header });

  const updatePoint = (p) => setQuote({ ...quote, points: quote.points.map((pt, i) => i === pointIndex ? p : pt) });
  const setPoint = (patch) => updatePoint({ ...point, ...patch });
  const updateBlock = (id, nb) => setPoint({ blocks: point.blocks.map(b => b.id === id ? nb : b) });
  const deleteBlock = (id) => setPoint({ blocks: point.blocks.filter(b => b.id !== id) });
  const moveBlock = (id, dir) => {
    const i = point.blocks.findIndex(b => b.id === id);
    const j = i + dir;
    if (j < 0 || j >= point.blocks.length) return;
    const arr = [...point.blocks];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setPoint({ blocks: arr });
  };
  const addBlock = (type) => setPoint({ blocks: [...point.blocks, newBlock(type)] });

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

  // Pagination state: array of [startBlockIdx, endBlockIdx] tuples — one per card.
  const [slices, setSlices] = useState(() => [[0, point.blocks.length]]);
  const wrapRef = useRef(null);
  const iterCountRef = useRef(0);

  // After every render, measure each rendered card. If any card overflows,
  // split it at the first block that crosses the A4 boundary. Re-render and
  // re-measure until all cards fit (or we hit the iteration cap).
  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    if (iterCountRef.current > 20) return;  // safety stop

    // First: ensure last slice end matches current blocks count (handles add/delete)
    const lastSlice = slices[slices.length - 1];
    if (!lastSlice || lastSlice[1] !== point.blocks.length) {
      iterCountRef.current++;
      const fixed = [[0, point.blocks.length]];
      setSlices(fixed);
      return;
    }

    const cards = wrapRef.current.querySelectorAll('[data-a4-card]');
    let mutated = false;
    let nextSlices = slices.map(s => [...s]);

    for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
      const cardEl = cards[cardIdx];
      if (cardEl.scrollHeight <= A4_HEIGHT_PX + 4) continue;  // fits — tolerance 4px

      // Card overflows. Find first block whose bottom crosses the boundary.
      const blockEls = cardEl.querySelectorAll('[data-block-mark]');
      if (blockEls.length === 0) continue;
      const cardTop = cardEl.getBoundingClientRect().top;
      let crossingLocalIdx = -1;
      for (let i = 0; i < blockEls.length; i++) {
        const rect = blockEls[i].getBoundingClientRect();
        if (rect.bottom - cardTop > A4_CONTENT_BOTTOM_PX) {
          crossingLocalIdx = i;
          break;
        }
      }
      // Need at least 1 block to stay on this card. If crossingLocalIdx is 0
      // and this card has just the first block + heavy title, leave it (no split)
      if (crossingLocalIdx <= 0) continue;

      const [sliceStart, sliceEnd] = nextSlices[cardIdx];
      const splitAt = sliceStart + crossingLocalIdx;
      nextSlices[cardIdx] = [sliceStart, splitAt];
      nextSlices.splice(cardIdx + 1, 0, [splitAt, sliceEnd]);
      mutated = true;
      break;  // re-render with new layout
    }

    if (mutated) {
      iterCountRef.current++;
      setSlices(nextSlices);
    } else {
      iterCountRef.current = 0;
    }
  });

  const circle = (
    <div className="w-10 h-10 rounded-full bg-[#5468E5] text-white flex items-center justify-center font-medium text-[15px] flex-shrink-0">
      {pointIndex + 1}
    </div>
  );
  // Continuation cards: no top dot — the blue line starts straight from the
  // top of the content area and runs down (visual continuity from previous page).
  const continuationDot = null;

  return (
    <div ref={wrapRef}>
      {slices.map(([startIdx, endIdx], sliceIdx) => {
        const isFirstSlice = sliceIdx === 0;
        const isLastSlice = sliceIdx === slices.length - 1;
        const blocksOnThisCard = point.blocks.slice(startIdx, endIdx);
        const showHeader = isFirstSlice && isFirstPoint;
        const cardPageNum = pageNum + sliceIdx;
        return (
          <div key={sliceIdx} data-a4-card className="doc-page doc-page-pink view-a4 flex flex-col">
            <PageFooter num={cardPageNum} total={totalPages} />
            {showHeader && <QuoteHeader header={quote.header} setHeader={setHeader} />}
            <div className={`${showHeader ? 'mt-4' : ''} flex-1 flex flex-col min-h-0`}>
              <TimelineRow
                hasNext={blocksOnThisCard.length > 0 || !isLastSlice}
                fillHeight={!isLastSlice}
                endDot={isLastSlice}
                circle={isFirstSlice ? circle : continuationDot}
                hoverTools={isFirstSlice ? (
                  <>
                    <button onClick={() => movePoint(-1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowUp width="14" height="14"/></button>
                    <button onClick={() => movePoint(1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowDown width="14" height="14"/></button>
                    <button onClick={deletePoint} className="w-7 h-7 rounded bg-white border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500"><Icon.Trash width="14" height="14"/></button>
                  </>
                ) : null}
              >
                {isFirstSlice ? (
                  <>
                    <EditableText
                      as="div"
                      value={point.title}
                      onChange={(v) => setPoint({ title: v })}
                      className="text-[18px] font-bold text-black leading-tight"
                      placeholder="Kitchen Renovation"
                      multiline
                    />
                    <div className="text-[15px] mt-0.5 mb-3">
                      <EditableText as="span" value={point.mainPrice} onChange={(v) => setPoint({ mainPrice: v })} placeholder="0,00" className="font-medium" />
                      <span className="text-gray-600"> kr inkl moms</span>
                    </div>
                    {point.subtitle && (
                      <EditableText as="div" value={point.subtitle} onChange={(v) => setPoint({ subtitle: v })} className="text-[13px] text-gray-600 mt-1 mb-2" multiline placeholder="(opcjonalny podtytuł)" />
                    )}
                  </>
                ) : (
                  <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-3 no-print">
                    Kontynuacja punktu {pointIndex + 1}: {point.title}
                  </div>
                )}
                <div className="pl-4">
                  {blocksOnThisCard.map((b) => (
                    <div key={b.id} data-block-mark>
                      <Block
                        block={b}
                        onChange={(nb) => updateBlock(b.id, nb)}
                        onDelete={() => deleteBlock(b.id)}
                        onMove={(dir) => moveBlock(b.id, dir)}
                      />
                    </div>
                  ))}
                  {isLastSlice && <BlockAdder onAdd={addBlock} />}
                </div>
              </TimelineRow>
              {isLastSlice && isLastPoint && (
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
      })}
    </div>
  );
};
