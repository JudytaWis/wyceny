// src/components/shared/PageFooter.jsx
export const PageFooter = ({ num, total }) => (
  <div className="page-number">
    {String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}
  </div>
);
