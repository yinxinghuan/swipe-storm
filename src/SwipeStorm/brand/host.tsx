import alteruUrl from '../img/alteru.svg';
import { AppBar, StatusBar } from '../components/Chrome';

interface ActionProps {
  datingChrome: boolean;
  leftLabel: string;
  rightLabel: string;
  onLeft: () => void;
  onRight: () => void;
}

export function HostTop({ logo }: { logo: string }) {
  return (
    <>
      <StatusBar />
      <AppBar logo={logo} />
    </>
  );
}

export function HostActions({ datingChrome, leftLabel, rightLabel, onLeft, onRight }: ActionProps) {
  return (
    <div className="ss-buttons-row">
      {datingChrome && (
        <button
          type="button"
          className="ss-action ss-action--small ss-action--rewind"
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Rewind (disabled)"
        >
          <svg viewBox="0 0 24 24"><path d="M12 5V2L7 7l5 5V8c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/></svg>
        </button>
      )}
      <button
        type="button"
        className="ss-action ss-action--big ss-action--nope"
        onPointerDown={(e) => { e.stopPropagation(); onLeft(); }}
        aria-label={leftLabel}
      >
        <svg viewBox="0 0 24 24"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>
      </button>
      {datingChrome && (
        <button
          type="button"
          className="ss-action ss-action--small ss-action--super"
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Super Like (disabled)"
        >
          <svg viewBox="0 0 24 24"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
        </button>
      )}
      <button
        type="button"
        className="ss-action ss-action--big ss-action--like"
        onPointerDown={(e) => { e.stopPropagation(); onRight(); }}
        aria-label={rightLabel}
      >
        {datingChrome ? (
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.8-9.6-9.2C.7 7.4 4 3 8.2 3c2 0 3.4 1 3.8 2.2C12.4 4 13.8 3 15.8 3 20 3 23.3 7.4 21.6 11.8 19.5 16.2 12 21 12 21z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24"><path d="M9.2 16.6 4.8 12.2 3.4 13.6 9.2 19.4 21 7.6 19.6 6.2z"/></svg>
        )}
      </button>
      {datingChrome && (
        <button
          type="button"
          className="ss-action ss-action--small ss-action--boost"
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Boost (disabled)"
        >
          <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>
        </button>
      )}
    </div>
  );
}

export function HostFooter() {
  return <img className="ss-watermark" src={alteruUrl} alt="" />;
}
