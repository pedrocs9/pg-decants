export function PerfumeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className}>
      <rect x="10" y="2.4" width="4" height="4" transform="rotate(45 12 4.4)"/>
      <rect x="10.5" y="6" width="3" height="4"/>
      <rect x="8.5" y="10" width="7" height="11" rx="1"/>
      <line x1="8.5" y1="14.5" x2="15.5" y2="14.5"/>
    </svg>
  );
}