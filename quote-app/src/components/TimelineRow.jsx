// src/components/TimelineRow.jsx
export const TimelineRow = ({ hasNext, circle, children, hoverTools }) => (
  <div className="group flex gap-4 relative">
    <div className="timeline-col">
      {circle}
      {hasNext && <div className="timeline-line-fill"></div>}
    </div>
    <div className="flex-1 min-w-0 pb-6">{children}</div>
    {hoverTools && (
      <div className="no-print flex flex-col gap-1 opacity-0 group-hover:opacity-100 ml-2">
        {hoverTools}
      </div>
    )}
  </div>
);
