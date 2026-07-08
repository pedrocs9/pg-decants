export function ShippingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M4 9l8-4 8 4"/>
      <rect x="4" y="9" width="16" height="11" rx="1"/>
      <line x1="12" y1="9" x2="12" y2="20"/>
    </svg>
  );
}