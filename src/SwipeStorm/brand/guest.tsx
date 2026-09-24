interface ActionProps {
  leftLabel: string;
  rightLabel: string;
  onLeft: () => void;
  onRight: () => void;
}

export function GuestTop({ tagline }: { tagline: string }) {
  return (
    <header className="ss-guestbar">
      <div className="ss-guestbar__mark" aria-hidden>
        <svg viewBox="0 0 48 48">
          <rect width="48" height="48" rx="14" fill="#1d1840" />
          <path
            d="M13 29.5c.4-5.2 4.6-9 9.4-9 1.2-3.6 4.6-6 8.4-5.4 2.8.4 5 2.6 5.6 5.4 3.2.5 5.6 3.2 5.6 6.4 0 3.6-2.9 6.6-6.6 6.6H16.2c-3.4 0-6.2-2.6-6.2-6 0-.7.1-1.4.3-2z"
            fill="#f4f7ff"
          />
          <path d="M27.2 20.5 20 31h6.2l-1.3 8.2 9.3-13.2h-6.2l-0.8-5.5z" fill="#3ad6e0" />
        </svg>
      </div>
      <div className="ss-guestbar__titles">
        <div className="ss-guestbar__logo">
          <span>Swipe</span> Storm
        </div>
        <div className="ss-guestbar__tag">{tagline}</div>
      </div>
    </header>
  );
}

export function GuestActions({ leftLabel, rightLabel, onLeft, onRight }: ActionProps) {
  return (
    <div className="ss-guest-dock">
      <button
        type="button"
        className="ss-guest-act ss-guest-act--flag"
        onPointerDown={(e) => { e.stopPropagation(); onLeft(); }}
        aria-label={leftLabel}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path fill="currentColor" d="M6 2.4h1.7V21H6z" />
          <path fill="currentColor" d="M7.7 3.4h11.4L15.2 8.2l3.9 4.8H7.7z" />
        </svg>
        <span>{leftLabel}</span>
      </button>
      <button
        type="button"
        className="ss-guest-act ss-guest-act--keep"
        onPointerDown={(e) => { e.stopPropagation(); onRight(); }}
        aria-label={rightLabel}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12.5 10 17.5 19 7.5"
          />
        </svg>
        <span>{rightLabel}</span>
      </button>
    </div>
  );
}
