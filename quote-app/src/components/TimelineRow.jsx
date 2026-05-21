// src/components/TimelineRow.jsx
export const TimelineRow = ({ hasNext, circle, children, hoverTools, fillHeight, endDot }) => (
  <div className={`group flex gap-4 relative ${fillHeight ? 'flex-1' : ''}`}>
    <div className="timeline-col">
      {circle}
      {hasNext && <div className="timeline-line-fill"></div>}
      {endDot && <div className="timeline-end-dot"></div>}
    </div>
    <div className="flex-1 min-w-0 pb-6">{children}</div>
    {hoverTools && (
      <div className="no-print flex flex-col gap-1 opacity-0 group-hover:opacity-100 ml-2">
        {hoverTools}
      </div>
    )}
  </div>
);
