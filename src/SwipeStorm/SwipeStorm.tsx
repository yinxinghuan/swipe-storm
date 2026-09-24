import { useEffect, useState, type CSSProperties } from 'react';
import { useSwipeStorm } from './hooks/useSwipeStorm';
import { ProfileCard } from './components/ProfileCard';
import { CircusHeart } from './components/CircusHeart';
import { EndScreen } from './components/EndScreen';
import { TutorialOverlay } from './components/TutorialOverlay';
import { useGameScore, Leaderboard } from '@shared/leaderboard';
import { isCrazyGamesBuild } from '@shared/runtime/deployTarget';
import { activeCartridge } from './cartridge';
import { GuestActions, GuestTop } from './brand/guest';
import { HostActions, HostFooter, HostTop } from './brand/host';
import '@swipe-host-styles';
import './SwipeStorm.less';

export default function SwipeStorm() {
  const {
    screen, score, lives, banner, best, stats, hasInteracted,
    stack, start, swipeLeft, swipeRight,
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  } = useSwipeStorm();

  const { isInAigram, submitScore, fetchLeaderboard } =
    useGameScore();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (screen === 'end' && stats.finalScore > 0) {
      submitScore(stats.finalScore);
    }
  }, [screen, stats.finalScore, submitScore]);

  const showTutorial = !hasInteracted && screen === 'playing';

  return (
    <div
      className={`ss-root ss-root--${activeCartridge.id}${isCrazyGamesBuild ? ' ss-root--guest' : ''}`}
      style={{
        '--ss-bg-top': activeCartridge.visual.backgroundTop,
        '--ss-bg-bot': activeCartridge.visual.backgroundBottom,
        '--ss-left': activeCartridge.visual.left,
        '--ss-right': activeCartridge.visual.right,
        '--ss-danger': activeCartridge.visual.danger,
        '--ss-rare': activeCartridge.visual.rare,
      } as CSSProperties & Record<string, string>}
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
      {isCrazyGamesBuild ? (
        <GuestTop tagline={activeCartridge.copy.tagline} />
      ) : (
        <HostTop logo={activeCartridge.copy.appLogo} />
      )}

      {/* HUD strip — score + lives (kept compact, dating-app-pill style) */}
      {screen === 'playing' && (
        <div className="ss-hud">
          <div className="ss-hud__score">{score}</div>
          <div className="ss-hud__lives" aria-label={`${activeCartridge.copy.livesAria} ${lives} of 3`}>
            {[0, 1, 2].map(i => activeCartridge.id === 'dating' ? (
              <CircusHeart key={i} on={i < lives} index={i} />
            ) : (
              <span key={i} className={`ss-life-seal ${i < lives ? 'ss-life-seal--on' : ''}`}>{activeCartridge.copy.lifeToken ?? 'S'}</span>
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

      {screen === 'playing' && (
        isCrazyGamesBuild ? (
          <GuestActions
            leftLabel={activeCartridge.copy.leftLabel}
            rightLabel={activeCartridge.copy.rightLabel}
            onLeft={swipeLeft}
            onRight={swipeRight}
          />
        ) : (
          <HostActions
            datingChrome={activeCartridge.id === 'dating'}
            leftLabel={activeCartridge.copy.leftLabel}
            rightLabel={activeCartridge.copy.rightLabel}
            onLeft={swipeLeft}
            onRight={swipeRight}
          />
        )
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
          gameName={activeCartridge.copy.leaderboardName}
          onClose={() => setShowLeaderboard(false)}
          fetch={fetchLeaderboard}
          isInAigram={isInAigram}
        />
      )}

      {isCrazyGamesBuild ? null : <HostFooter />}
    </div>
  );
}

// Map banner color to a darker BG for the toast — keeps text white-on-color
function bannerBg(color: string): string {
  // Toast colors per banner type — we tint the dark bg slightly with the cue
  // but keep it readable. Default = dark.
  if (color === activeCartridge.visual.right || color === activeCartridge.visual.rare) {
    return isCrazyGamesBuild ? 'rgba(12, 74, 96, 0.94)' : 'rgba(0, 110, 84, 0.92)';
  }
  if (color === activeCartridge.visual.danger) return 'rgba(150, 42, 48, 0.92)';
  return 'rgba(0, 0, 0, 0.78)';
}
