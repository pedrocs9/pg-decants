export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="12" x2="19" y2="12"/>
      <path d="M13 6l7 6-7 6"/>
    </svg>
  );
}