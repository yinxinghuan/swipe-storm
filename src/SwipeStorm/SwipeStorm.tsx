import { useEffect, useState } from 'react';
import { useSwipeStorm } from './hooks/useSwipeStorm';
import { ProfileCard } from './components/ProfileCard';
import { CircusHeart } from './components/CircusHeart';
import { EndScreen } from './components/EndScreen';
import { TutorialOverlay } from './components/TutorialOverlay';
import { StatusBar, AppBar } from './components/Chrome';
import { useGameScore, Leaderboard } from '@shared/leaderboard';
import alteruUrl from './img/alteru.svg';
import './SwipeStorm.less';

export default function SwipeStorm() {
  const {
    screen, score, lives, banner, best, stats, hasInteracted,
    stack, start, swipeLeft, swipeRight,
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  } = useSwipeStorm();

  const { isInAigram, submitScore, fetchGlobalLeaderboard, fetchFriendsLeaderboard } =
    useGameScore('swipe-storm');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (screen === 'end' && stats.finalScore > 0) {
      submitScore(stats.finalScore);
    }
  }, [screen, stats.finalScore, submitScore]);

  const showTutorial = !hasInteracted && screen === 'playing';

  return (
    <div
      className="ss-root"
      onPointerDown={(e) => {
        if (screen !== 'playing') return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        onPointerDown(e.clientX);
        e.preventDefault();
      }}
      onPointerMove={(e) => onPointerMove(e.clientX)}
      onPointerUp={() => onPointerUp()}
      onPointerCancel={() => onPointerCancel()}
    >
      {/* Phone chrome — fake iOS status bar + Tinder-style app header */}
      <StatusBar />
      <AppBar />

      {/* HUD strip — score + lives (kept compact, dating-app-pill style) */}
      {screen === 'playing' && (
        <div className="ss-hud">
          <div className="ss-hud__score">{score}</div>
          <div className="ss-hud__lives" aria-label={`Lives ${lives} of 3`}>
            {[0, 1, 2].map(i => (
              <CircusHeart key={i} on={i < lives} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Card deck */}
      <div className="ss-deck">
        {stack.map((card, i) => {
          const fromTop = stack.length - 1 - i;
          return (
            <ProfileCard
              key={card.profile.uid}
              card={card}
              depth={fromTop}
              isActive={fromTop === 0}
            />
          );
        })}
      </div>

      {/* Bottom action row — Tinder layout */}
      {screen === 'playing' && (
        <div className="ss-buttons-row">
          <button
            className="ss-action ss-action--small ss-action--rewind"
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Rewind (disabled)"
          >
            <svg viewBox="0 0 24 24"><path d="M12 5V2L7 7l5 5V8c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/></svg>
          </button>
          <button
            className="ss-action ss-action--big ss-action--nope"
            onPointerDown={(e) => { e.stopPropagation(); swipeLeft(); }}
            aria-label="Nope"
          >
            <svg viewBox="0 0 24 24"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>
          </button>
          <button
            className="ss-action ss-action--small ss-action--super"
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Super Like (disabled)"
          >
            <svg viewBox="0 0 24 24"><path d="M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>
          </button>
          <button
            className="ss-action ss-action--big ss-action--like"
            onPointerDown={(e) => { e.stopPropagation(); swipeRight(); }}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.8-9.6-9.2C.7 7.4 4 3 8.2 3c2 0 3.4 1 3.8 2.2C12.4 4 13.8 3 15.8 3 20 3 23.3 7.4 21.6 11.8 19.5 16.2 12 21 12 21z"/></svg>
          </button>
          <button
            className="ss-action ss-action--small ss-action--boost"
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Boost (disabled)"
          >
            <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>
          </button>
        </div>
      )}

      {/* Top-anchored Tinder-style banner toast (MATCH / REGRET / SOULMATE / etc.) */}
      {banner && (
        <div key={banner.key} className="ss-banner" style={{ background: bannerBg(banner.color) }}>
          {banner.text}
        </div>
      )}

      {showTutorial && <TutorialOverlay />}

      {screen === 'end' && (
        <EndScreen
          stats={stats}
          best={best}
          onAgain={start}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          gameName="Swipe Storm"
          onClose={() => setShowLeaderboard(false)}
          fetchGlobal={fetchGlobalLeaderboard}
          fetchFriends={fetchFriendsLeaderboard}
          isInAigram={isInAigram}
        />
      )}

      <img className="ss-watermark" src={alteruUrl} alt="" />
    </div>
  );
}

// Map banner color to a darker BG for the toast — keeps text white-on-color
function bannerBg(color: string): string {
  // Toast colors per banner type — we tint the dark bg slightly with the cue
  // but keep it readable. Default = dark.
  if (color === '#3aa84a' || color === '#ffd24a') return 'rgba(0, 130, 80, 0.92)';
  if (color === '#b81818') return 'rgba(170, 30, 40, 0.92)';
  return 'rgba(0, 0, 0, 0.78)';
}
