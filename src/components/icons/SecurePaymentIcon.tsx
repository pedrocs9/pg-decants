export function SecurePaymentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className}>
      <rect x="6" y="11" width="12" height="9" rx="1"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
      <line x1="12" y1="14.5" x2="12" y2="17"/>
    </svg>
  );
}