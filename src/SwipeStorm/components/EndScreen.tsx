import { useMemo } from 'react';
import { t } from '../i18n';
import type { Stats } from '../types';

interface Props {
  stats: Stats;
  best: number;
  onAgain: () => void;
  onOpenLeaderboard: () => void;
}

const CATFISH_LEAD = ['SCAMMED', 'CAUGHT!', 'OH NO', 'OOF', 'GULLIBLE'];
const CATFISH_TAIL = ['DATA STOLEN', 'TELEGRAM DM', 'CRYPTO TIPS', 'CATFISH WINS', 'NOT THEM'];
const LIVES_LEAD   = ['TIMED OUT', 'INDECISIVE', 'PARALYZED', 'OVERTHINKER', 'FROZEN'];
const LIVES_TAIL   = ['NO MATCHES', 'STILL ALONE', 'SWIPE FATIGUE', 'TRY AGAIN', 'BURNED OUT'];
const STAMPS_BAD   = ['VOID', 'BLOCKED', 'CRINGE', 'NOPE', 'YIKES', 'CURSED'];

function pickOne<T>(xs: T[]): T { return xs[Math.floor(Math.random() * xs.length)]; }
function strongTilt(min: number, max: number): number {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return sign * (min + Math.random() * (max - min));
}

export function EndScreen({ stats, best, onAgain, onOpenLeaderboard }: Props) {
  const catfish = stats.endReason === 'catfish';
  const flavor = useMemo(() => ({
    lead: pickOne(catfish ? CATFISH_LEAD : LIVES_LEAD),
    tail: pickOne(catfish ? CATFISH_TAIL : LIVES_TAIL),
    stampWord: pickOne(STAMPS_BAD),
    tilt: strongTilt(4, 7).toFixed(2),
    stampX: 64 + Math.random() * 22,
    stampY: 56 + Math.random() * 22,
    stampAngle: strongTilt(12, 24).toFixed(1),
    serial: String(1000 + Math.floor(Math.random() * 8999)).padStart(4, '0'),
  }), [catfish]);

  return (
    <div className="ss-overlay ss-overlay--end">
      <div className="ss-overlay__inner" style={{ transform: `rotate(${flavor.tilt}deg)` }}>
        <span className="ss-overlay__notch ss-overlay__notch--tl" aria-hidden />
        <span className="ss-overlay__notch ss-overlay__notch--tr" aria-hidden />
        <span className="ss-overlay__notch ss-overlay__notch--bl" aria-hidden />
        <span className="ss-overlay__notch ss-overlay__notch--br" aria-hidden />
        <div className="ss-stamp-bar">
          <span>{flavor.lead}</span>
          <span>NO. {flavor.serial}</span>
          <span>{flavor.tail}</span>
        </div>

        <div
          className="ss-ink-stamp"
          style={{
            left: `${flavor.stampX}%`,
            top: `${flavor.stampY}%`,
            transform: `translate(-50%, -50%) rotate(${flavor.stampAngle}deg)`,
          }}
          aria-hidden
        >
          {flavor.stampWord}
        </div>

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
            <div className="ss-stats__label">{t('matched')}</div>
            <div className="ss-stats__value">{stats.matchedReal}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{t('dodged')}</div>
            <div className="ss-stats__value">{stats.dodgedReds}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{t('catfish_dodged')}</div>
            <div className="ss-stats__value">{stats.catfishCaught}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">{t('max_combo')}</div>
            <div className="ss-stats__value">×{stats.maxCombo}</div>
          </div>
          <div className="ss-stats__cell">
            <div className="ss-stats__label">Swiped</div>
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
