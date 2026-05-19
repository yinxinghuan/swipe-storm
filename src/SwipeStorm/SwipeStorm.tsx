import { useEffect, useState } from 'react';
import { useSwipeStorm } from './hooks/useSwipeStorm';
import { ProfileCard } from './components/ProfileCard';
import { CircusHeart } from './components/CircusHeart';
import { EndScreen } from './components/EndScreen';
import { TutorialOverlay } from './components/TutorialOverlay';
import { useGameScore, Leaderboard } from '@shared/leaderboard';
import { t } from './i18n';
import alteruUrl from './img/alteru.svg';
import './SwipeStorm.less';

export default function SwipeStorm() {
  const {
    screen, score, lives, combo, banner, best, stats, hasInteracted,
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
      {/* Soft phone-app backdrop */}
      <div className="ss-bg" aria-hidden />

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

      {/* Reject / Like buttons (also tap-friendly) */}
      {screen === 'playing' && (
        <div className="ss-buttons-row">
          <button
            className="ss-action ss-action--nope"
            onPointerDown={(e) => { e.stopPropagation(); swipeLeft(); }}
            aria-label="Nope"
          >
            <svg viewBox="0 0 24 24"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z"/></svg>
          </button>
          <button
            className="ss-action ss-action--like"
            onPointerDown={(e) => { e.stopPropagation(); swipeRight(); }}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.8-9.6-9.2C.7 7.4 4 3 8.2 3c2 0 3.4 1 3.8 2.2C12.4 4 13.8 3 15.8 3 20 3 23.3 7.4 21.6 11.8 19.5 16.2 12 21 12 21z"/></svg>
          </button>
        </div>
      )}

      {/* HUD */}
      {screen === 'playing' && (
        <>
          <div className="ss-hud ss-hud--top">
            <div className="ss-hud__cell">
              <div className="ss-hud__label">{t('score')}</div>
              <div className="ss-hud__value">{score}</div>
            </div>
            <div className="ss-hud__cell ss-hud__cell--right">
              <div className="ss-lives-placard" aria-label={`Lives ${lives} of 3`}>
                <span className="ss-lives-placard__notch ss-lives-placard__notch--l" aria-hidden />
                <span className="ss-lives-placard__notch ss-lives-placard__notch--r" aria-hidden />
                <div className="ss-lives-placard__label">HEARTS</div>
                <div className="ss-lives-placard__row">
                  {[0, 1, 2].map(i => (
                    <CircusHeart key={i} on={i < lives} index={i} />
                  ))}
                </div>
              </div>
              <div className="ss-hud__label ss-hud__label--right">{t('best')} · {best}</div>
            </div>
          </div>

          {combo >= 2 && (
            <div className={`ss-combo ss-combo--${Math.min(combo, 15)}`}>
              <span className="ss-combo__x">×</span>
              <span className="ss-combo__n">{combo}</span>
            </div>
          )}
          {banner && (
            <div
              key={banner.key}
              className="ss-banner"
              style={{
                color: banner.color,
                ['--banner-rot' as any]: `${(() => {
                  const sign = Math.random() < 0.5 ? -1 : 1;
                  return (sign * (4 + Math.random() * 6)).toFixed(1);
                })()}deg`,
              }}
            >
              {banner.text}
            </div>
          )}
          {showTutorial && <TutorialOverlay />}
        </>
      )}

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
