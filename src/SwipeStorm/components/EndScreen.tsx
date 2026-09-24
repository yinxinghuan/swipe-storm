import { useMemo } from 'react';
import { t } from '../i18n';
import type { Stats } from '../types';
import { activeCartridge } from '../cartridge';

interface Props {
  stats: Stats;
  best: number;
  onAgain: () => void;
  onOpenLeaderboard: () => void;
}

function pickOne<T>(xs: T[]): T { return xs[Math.floor(Math.random() * xs.length)]; }

export function EndScreen({ stats, best, onAgain, onOpenLeaderboard }: Props) {
  const catfish = stats.endReason === 'catfish';
  const flavor = useMemo(() => ({
    headline: pickOne(catfish ? activeCartridge.end.trapHeadlines : activeCartridge.end.livesHeadlines),
    sub:      pickOne(catfish ? activeCartridge.end.trapSubs      : activeCartridge.end.livesSubs),
  }), [catfish]);

  return (
    <div className={`ss-overlay ss-overlay--end ss-overlay--${catfish ? 'catfish' : 'lives'}`}>
      <div className="ss-overlay__inner">
        {/* Top icon: ban hammer for catfish, broken-heart for lives */}
        <div className="ss-scam-alert__icon" aria-hidden>
          {catfish ? (
            <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8 0-1.7.6-3.3 1.5-4.6L16.6 18.5C15.3 19.4 13.7 20 12 20zm6.5-3.4L7.4 5.5C8.7 4.6 10.3 4 12 4c4.4 0 8 3.6 8 8 0 1.7-.6 3.3-1.5 4.6z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.8-9.6-9.2C.7 7.4 4 3 8.2 3c2 0 3.4 1 3.8 2.2C12.4 4 13.8 3 15.8 3 20 3 23.3 7.4 21.6 11.8 19.5 16.2 12 21 12 21z" opacity="0.3"/><path d="M14 4 9 13l4 1-2 7 5-9-4-1 2-7z" fill="#fff" stroke="var(--ss-left, #fe3c72)" strokeWidth="0.5"/></svg>
          )}
        </div>

        <div className="ss-end-headline">{flavor.headline}</div>
        <div className="ss-end-subhead">{flavor.sub}</div>

        {stats.isNewBest && <div className="ss-new-best">{t('new_best')}</div>}
        <div className="ss-final">
          <div className="ss-final__label">{t('final_score')}</div>
          <div className="ss-final__value">{stats.finalScore}</div>
        </div>
        <div className="ss-stats">
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{t('best')}</div>
            <div className="ss-stats__value">{best}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{activeCartridge.statsLabels.rightGood}</div>
            <div className="ss-stats__value">{stats.matchedReal}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{activeCartridge.statsLabels.leftGood}</div>
            <div className="ss-stats__value">{stats.dodgedReds}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{activeCartridge.statsLabels.trapDodged}</div>
            <div className="ss-stats__value">{stats.catfishCaught}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{t('max_combo')}</div>
            <div className="ss-stats__value">×{stats.maxCombo}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{activeCartridge.statsLabels.swiped}</div>
            <div className="ss-stats__value">{stats.totalSwiped}</div>
          </div>
        </div>
        <div className="ss-buttons">
          <button className="ss-btn ss-btn--primary" onPointerDown={onAgain}>{t('again')}</button>
          <button className="ss-btn ss-btn--ghost" onPointerDown={onOpenLeaderboard}>{t('leaderboard')}</button>
        </div>
      </div>
    </div>
  );
}
