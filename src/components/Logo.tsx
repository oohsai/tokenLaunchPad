export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="26" stroke="var(--silver)" strokeWidth="3" />
      <path d="M32 15l11 19H21z" fill="var(--brand)" />
      <path
        d="M25 44h14"
        stroke="var(--brand)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
