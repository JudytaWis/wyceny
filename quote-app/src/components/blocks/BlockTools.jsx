import { Icon } from '../shared/Icon.jsx';

export const BlockTools = ({ onDelete, onMove }) => (
  <div className="no-print absolute -left-9 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
    <button onClick={() => onMove(-1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowUp width="14" height="14"/></button>
    <button onClick={() => onMove(1)} className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500"><Icon.ArrowDown width="14" height="14"/></button>
    <button onClick={onDelete} className="w-7 h-7 rounded bg-white border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500"><Icon.Trash width="14" height="14"/></button>
  </div>
);
