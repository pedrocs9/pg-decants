export function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="12" cy="8" r="3.5"/>
      <path d="M5 20a7 6 0 0 1 14 0"/>
    </svg>
  );
}