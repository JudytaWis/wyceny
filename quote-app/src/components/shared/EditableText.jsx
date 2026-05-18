// src/components/shared/EditableText.jsx
import { useEffect, useRef } from 'react';

export const EditableText = ({ value, onChange, placeholder = '', className = '', as: As = 'span', multiline = false, style }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  return (
    <As
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      style={style}
      onBlur={(e) => onChange(e.target.innerText)}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      }}
    />
  );
};
