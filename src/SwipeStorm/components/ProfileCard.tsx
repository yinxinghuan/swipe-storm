import type { CSSProperties } from 'react';
import type { CardState } from '../hooks/useSwipeStorm';
import { Avatar } from './Avatar';
import { activeCartridge } from '../cartridge';

interface Props {
  card: CardState;
  /** 0 = active (top), 1 = behind, 2 = behind-behind, etc. */
  depth: number;
  isActive: boolean;
}

const SWIPE_COMMIT_PX = 90;

export function ProfileCard({ card, depth, isActive }: Props) {
  const { profile, dragX, dragY, phase } = card;
  const renderer = profile.visual?.renderer ?? 'profile';

  // Active card responds to drag; cards behind it stay slightly scaled and lower
  const rotateDeg = isActive ? dragX * 0.06 : 0;       // 90px ⇒ ~5.4°
  const stackOffsetY = depth * 14;                      // each behind card sits 14px lower
  const stackScale = 1 - depth * 0.04;                  // and slightly smaller
  const baseTilt = depth === 1 ? -2 : depth === 2 ? 2 : 0;

  const tx = dragX;
  const ty = dragY + stackOffsetY;
  const tr = rotateDeg + baseTilt;

  // Smooth spring-back when not dragging and not leaving
  const transitionStyle =
    phase === 'leaving' || (isActive && (dragX !== 0 || dragY !== 0))
      ? 'none'
      : 'transform 280ms cubic-bezier(.34,1.56,.64,1)';

  const likeOpacity = isActive ? Math.max(0, Math.min(1, dragX / SWIPE_COMMIT_PX)) : 0;
  const nopeOpacity = isActive ? Math.max(0, Math.min(1, -dragX / SWIPE_COMMIT_PX)) : 0;

  return (
    <div
      className={`ss-card ss-card--depth-${depth} ${isActive ? 'ss-card--active' : ''}`}
      style={{
        zIndex: 100 - depth,
        transform: `translate(${tx}px, ${ty}px) rotate(${tr}deg) scale(${stackScale})`,
        transition: transitionStyle,
      }}
    >
      {renderer === 'object-card' ? (
        <div className="ss-card__object" style={{ '--card-accent': profile.visual?.accent } as CSSProperties & Record<string, string | undefined>}>
          <div className="ss-card__object-badge">{profile.visual?.seal ?? 'item'}</div>
          <div className="ss-card__object-symbol">{profile.visual?.icon ?? 'ITEM'}</div>
          <div className="ss-card__object-title">{profile.name}</div>
          {profile.subtitle && <div className="ss-card__object-subtitle">{profile.subtitle}</div>}
          <div className="ss-card__object-bin" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : renderer === 'document' ? (
        <div className="ss-card__document" style={{ '--card-accent': profile.visual?.accent } as CSSProperties & Record<string, string | undefined>}>
          <div className="ss-card__doc-top">
            <div className="ss-card__doc-icon">{profile.visual?.icon ?? 'FILE'}</div>
            <div className="ss-card__doc-seal">{profile.visual?.seal ?? 'review'}</div>
          </div>
          <div className="ss-card__doc-rule" />
          <div className="ss-card__doc-title">{profile.name}</div>
          {profile.subtitle && <div className="ss-card__doc-subtitle">{profile.subtitle}</div>}
          <div className="ss-card__doc-lines" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        <div className="ss-card__photo">
          {profile.avatar && <Avatar parts={profile.avatar} />}
          <div className="ss-card__photo-overlay" />
          <div className="ss-card__nameplate">
            <span className="ss-card__name">{profile.name}</span>
            {profile.age != null && <span className="ss-card__age">{profile.age}</span>}
          </div>
        </div>
      )}

      {/* Bio + tags */}
      <div className="ss-card__body">
        <div className="ss-card__bio">{profile.bio}</div>
        {profile.tags.length > 0 && (
          <div className="ss-card__tags">
            {profile.tags.map((tag, i) => (
              <span key={i} className="ss-card__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* LIKE / NOPE stamps that fade in with drag */}
      {isActive && (
        <>
          <div className="ss-stamp ss-stamp--like" style={{ opacity: likeOpacity }}>{activeCartridge.copy.rightLabel}</div>
          <div className="ss-stamp ss-stamp--nope" style={{ opacity: nopeOpacity }}>{activeCartridge.copy.leftLabel}</div>
        </>
      )}
    </div>
  );
}
