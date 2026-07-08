export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="11" cy="11" r="6.5"/>
      <line x1="16" y1="16" x2="21" y2="21"/>
    </svg>
  );
}