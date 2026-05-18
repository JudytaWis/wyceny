// src/components/shared/BodoLogo.jsx
export const BodoLogo = ({ size = 'md', className = '', variant = 'onWhite' }) => {
  const heights = { sm: 28, md: 42, lg: 72, xl: 110 };
  const h = heights[size] || 42;
  const src = variant === 'onDark' ? '/assets/bodo-logo-on-dark.svg' : '/assets/bodo-logo-on-white.svg';
  return <img src={src} alt="BODO Build & Track AB" style={{ height: h }} className={className} />;
};
