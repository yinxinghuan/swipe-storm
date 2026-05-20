/**
 * iOS phone chrome + Tinder-style app header. Pure parody UI: the
 * status bar is fake (it shows 9:41 like every Apple marketing shot)
 * and the app logo is a fat italic script that's clearly The Dating App.
 */

export function StatusBar() {
  return (
    <div className="ss-statusbar" aria-hidden>
      <div className="ss-statusbar__time">9:41</div>
      <div className="ss-statusbar__icons">
        {/* Signal bars */}
        <svg viewBox="0 0 18 12">
          <rect x="0"  y="8" width="2" height="4" rx="0.5" />
          <rect x="4"  y="6" width="2" height="6" rx="0.5" />
          <rect x="8"  y="3" width="2" height="9" rx="0.5" />
          <rect x="12" y="0" width="2" height="12" rx="0.5" />
        </svg>
        {/* WiFi */}
        <svg viewBox="0 0 16 12">
          <path d="M8 11.5 L9.5 10 L8 8.5 L6.5 10 Z" />
          <path d="M3 7 Q8 2 13 7 L11 9 Q8 6 5 9 Z" />
        </svg>
        {/* Battery */}
        <svg viewBox="0 0 24 12">
          <rect x="0" y="1" width="20" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <rect x="20" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
          <rect x="1.5" y="2.5" width="14" height="7" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function AppBar() {
  return (
    <div className="ss-appbar" aria-hidden>
      <div className="ss-appbar__icon">
        {/* Gear / settings */}
        <svg viewBox="0 0 24 24"><path d="M19.4 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2-1.6-2-3.4-2.4 1c-.5-.4-1-.7-1.6-.9L15 3h-4l-.4 2.2c-.6.2-1.1.5-1.6.9l-2.4-1-2 3.4 2 1.6c-.1.3-.1.6-.1.9s0 .6.1.9l-2 1.6 2 3.4 2.4-1c.5.4 1 .7 1.6.9L11 21h4l.4-2.2c.6-.2 1.1-.5 1.6-.9l2.4 1 2-3.4-2-1.6zM13 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>
      </div>
      <div className="ss-appbar__logo">tinder*</div>
      <div className="ss-appbar__icons">
        <div className="ss-appbar__icon">
          {/* Filter sliders */}
          <svg viewBox="0 0 24 24"><path d="M3 6h13v2H3zM3 11h8v2H3zM3 16h13v2H3zM18 4v6h2V4zM18 13v7h2v-7z"/></svg>
        </div>
        <div className="ss-appbar__icon">
          {/* Chat */}
          <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V6c0-1.1-.9-2-2-2zM7 9h10v2H7zm0 4h7v2H7z"/></svg>
        </div>
      </div>
    </div>
  );
}
