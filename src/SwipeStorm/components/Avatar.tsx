import type { AvatarParts } from '../types';
import { BG, HAIR_COLOR, SKIN } from '../data/avatar';

/**
 * Procedurally-composed dating-profile portrait — Avataaars-inspired.
 * v2: organic hair shapes (no more blocks), bigger eyes with sclera+iris,
 * subtle skin gradient + cheek glow, soft chin curves, integrated hairlines.
 *
 * Canvas: 200×260 — viewBox is fixed so all face features land in the same
 * coordinate space regardless of parts combinations.
 */
export function Avatar({ parts }: { parts: AvatarParts }) {
  const skin = SKIN[parts.skin % SKIN.length];
  const skinShade = shade(skin, -16);
  const cheekColor = blendCheek(skin);
  const bg = BG[parts.bg % BG.length];
  const hairColor = HAIR_COLOR[parts.hairColor % HAIR_COLOR.length];
  const hairShade = shade(hairColor, -25);
  // Per-instance ID prefix avoids gradient collisions across many Avatar elements.
  const idP = `ss-av-${parts.skin}-${parts.hair}-${parts.bg}-${parts.eyes}-${parts.mouth}`;

  return (
    <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice" className="ss-avatar">
      <defs>
        <linearGradient id={`${idP}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint(bg, 14)} />
          <stop offset="100%" stopColor={shade(bg, -10)} />
        </linearGradient>
        <linearGradient id={`${idP}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint(skin, 8)} />
          <stop offset="100%" stopColor={shade(skin, -8)} />
        </linearGradient>
        <radialGradient id={`${idP}-cheek`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={cheekColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor={cheekColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="200" height="260" fill={`url(#${idP}-bg)`} />

      {/* Hair back layer */}
      <HairBack parts={parts} color={hairColor} shade={hairShade} />

      {/* Neck + collar (drawn before head so the chin sits over them naturally) */}
      <Neck skinShade={skinShade} />
      <Collar parts={parts} />

      {/* Head */}
      <Head parts={parts} idP={idP} skinStroke={skinShade} />

      {/* Cheeks */}
      <ellipse cx="68" cy="155" rx="13" ry="8" fill={`url(#${idP}-cheek)`} />
      <ellipse cx="132" cy="155" rx="13" ry="8" fill={`url(#${idP}-cheek)`} />

      {/* Freckles */}
      {parts.freckles && (
        <g fill={shade(skin, -22)} opacity="0.55">
          {Array.from({ length: 6 }, (_, i) => (
            <circle
              key={i}
              cx={84 + (i % 3) * 12 + (i > 2 ? 6 : 0)}
              cy={i < 3 ? 152 : 158}
              r="1.3"
            />
          ))}
        </g>
      )}

      {/* Brows */}
      <Brows parts={parts} color={hairShade} />

      {/* Eyes */}
      <Eyes parts={parts} />

      {/* Nose */}
      <Nose skinShade={skinShade} />

      {/* Mouth */}
      <Mouth parts={parts} />

      {/* Hair front layer */}
      <HairFront parts={parts} color={hairColor} shade={hairShade} />

      {/* Accessory (glasses / hat / facemask) */}
      <Accessory parts={parts} hairShade={hairShade} />

      {/* Earring */}
      {parts.earring && (
        <g>
          <circle cx="50" cy="160" r="3.2" fill="#ffd24a" stroke="#a87a18" strokeWidth="0.7" />
          <circle cx="150" cy="160" r="3.2" fill="#ffd24a" stroke="#a87a18" strokeWidth="0.7" />
        </g>
      )}
    </svg>
  );
}

// ─── Head (3 shapes — all soft, no hard rectangles) ──────────────────────

function Head({ parts, idP, skinStroke }: { parts: AvatarParts; idP: string; skinStroke: string }) {
  const fill = `url(#${idP}-skin)`;
  switch (parts.faceShape) {
    case 0: // round (everyone's default)
      return (
        <ellipse cx="100" cy="125" rx="58" ry="62" fill={fill} stroke={skinStroke} strokeWidth="1.6" />
      );
    case 1: // tall egg
      return (
        <ellipse cx="100" cy="125" rx="52" ry="64" fill={fill} stroke={skinStroke} strokeWidth="1.6" />
      );
    default: // soft-square (rounded jaw, no sharp corners)
      return (
        <path
          d="M48 96 Q48 68 76 64 L124 64 Q152 68 152 96 L152 152 Q152 175 132 184 Q116 192 100 192 Q84 192 68 184 Q48 175 48 152 Z"
          fill={fill}
          stroke={skinStroke}
          strokeWidth="1.6"
        />
      );
  }
}

// ─── Neck + Collar ──────────────────────────────────────────────────────

function Neck({ skinShade }: { skinShade: string }) {
  return <path d="M70 240 Q70 210 80 200 L120 200 Q130 210 130 240 Z" fill={skinShade} />;
}

function Collar({ parts }: { parts: AvatarParts }) {
  const collarColor = ['#3a3a3a', '#7a1818', '#1a3a6a', '#3a6a1a', '#aa7a4a', '#5a2868'][parts.bg % 6];
  return (
    <g>
      <path
        d="M30 250 Q30 200 80 195 Q100 215 120 195 Q170 200 170 250 L170 260 L30 260 Z"
        fill={collarColor}
      />
    </g>
  );
}

// ─── Brows ───────────────────────────────────────────────────────────────

function Brows({ parts, color }: { parts: AvatarParts; color: string }) {
  const y = 122;
  switch (parts.brow) {
    case 1: // raised on right (curious)
      return (
        <g stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={`M68 ${y} Q78 ${y - 4} 90 ${y + 1}`} />
          <path d={`M110 ${y - 5} Q120 ${y - 9} 132 ${y - 4}`} />
        </g>
      );
    case 2: // furrowed / angry
      return (
        <g stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={`M68 ${y + 2} Q78 ${y - 3} 90 ${y + 1}`} />
          <path d={`M110 ${y + 1} Q122 ${y - 3} 132 ${y + 2}`} />
        </g>
      );
    default: // neutral
      return (
        <g stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={`M68 ${y} Q78 ${y - 5} 90 ${y}`} />
          <path d={`M110 ${y} Q122 ${y - 5} 132 ${y}`} />
        </g>
      );
  }
}

// ─── Eyes (sclera + iris + highlight — proper eyes, not dots) ────────────

function Eyes({ parts }: { parts: AvatarParts }) {
  const irisColor = ['#3a2010', '#5a8a4a', '#3a6a9a', '#7a4a18'][parts.eyes % 4];
  switch (parts.eyes) {
    case 1: // big anime eyes (round + bigger iris)
      return (
        <g>
          <ellipse cx="80" cy="140" rx="8" ry="10" fill="#fff" stroke="#3a2418" strokeWidth="1" />
          <ellipse cx="120" cy="140" rx="8" ry="10" fill="#fff" stroke="#3a2418" strokeWidth="1" />
          <ellipse cx="80" cy="141" rx="4.5" ry="5.5" fill={irisColor} />
          <ellipse cx="120" cy="141" rx="4.5" ry="5.5" fill={irisColor} />
          <circle cx="80" cy="142" r="2.6" fill="#1a0f0a" />
          <circle cx="120" cy="142" r="2.6" fill="#1a0f0a" />
          <circle cx="82" cy="139" r="1.4" fill="#fff" />
          <circle cx="122" cy="139" r="1.4" fill="#fff" />
        </g>
      );
    case 2: // closed / smug (single arc each)
      return (
        <g fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round">
          <path d="M70 142 Q80 137 90 142" />
          <path d="M110 142 Q120 137 130 142" />
        </g>
      );
    case 3: // heart eyes (pink stars)
      return (
        <g fill="#ff3a7a">
          <Star cx={80} cy={140} r={6} />
          <Star cx={120} cy={140} r={6} />
        </g>
      );
    default: // normal — small sclera + iris + highlight
      return (
        <g>
          <ellipse cx="80" cy="140" rx="6" ry="7.5" fill="#fff" stroke="#3a2418" strokeWidth="1" />
          <ellipse cx="120" cy="140" rx="6" ry="7.5" fill="#fff" stroke="#3a2418" strokeWidth="1" />
          <circle cx="80" cy="141" r="3.2" fill={irisColor} />
          <circle cx="120" cy="141" r="3.2" fill={irisColor} />
          <circle cx="82" cy="139" r="1.1" fill="#fff" />
          <circle cx="122" cy="139" r="1.1" fill="#fff" />
        </g>
      );
  }
}

function Nose({ skinShade }: { skinShade: string }) {
  return (
    <path
      d="M100 150 Q102 157 100 162 Q98 164 96 163"
      stroke={skinShade}
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
    />
  );
}

// ─── Mouth (5 expressions) ───────────────────────────────────────────────

function Mouth({ parts }: { parts: AvatarParts }) {
  const y = 174;
  switch (parts.mouth) {
    case 1: // smirk (one corner lifted)
      return (
        <path
          d={`M86 ${y + 2} Q102 ${y + 5} 116 ${y - 6}`}
          stroke="#7a3018"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      );
    case 2: // duckface / lipstick pout
      return (
        <g>
          <ellipse cx="100" cy={y + 4} rx="14" ry="6" fill="#d83555" />
          <ellipse cx="100" cy={y + 1} rx="14" ry="3" fill="#ff85a8" />
        </g>
      );
    case 3: // surprised open mouth
      return <ellipse cx="100" cy={y + 6} rx="8" ry="9" fill="#3a1a1a" />;
    case 4: // frown
      return (
        <path
          d={`M86 ${y + 8} Q100 ${y - 2} 114 ${y + 8}`}
          stroke="#7a3018"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      );
    default: // smile
      return (
        <path
          d={`M86 ${y - 2} Q100 ${y + 10} 114 ${y - 2}`}
          stroke="#7a3018"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      );
  }
}

// ─── Hair back (long flow, pigtails, afro back) ──────────────────────────

function HairBack({ parts, color, shade }: { parts: AvatarParts; color: string; shade: string }) {
  void shade;
  switch (parts.hair) {
    case 0:
    case 1:
    case 6:
    case 7:
      return null; // these styles have no behind-head hair
    case 2: // long curtain — two strands behind shoulders, narrower so body shows
      return (
        <g fill={color}>
          <path d="M44 105 Q30 200 50 245 L40 255 L60 250 Q56 200 60 130 Z" />
          <path d="M156 105 Q170 200 150 245 L160 255 L140 250 Q144 200 140 130 Z" />
        </g>
      );
    case 3: // ponytail behind
      return (
        <path d="M150 130 Q190 170 175 220 Q160 230 150 200 Z" fill={color} />
      );
    case 4: // afro back fluff
      return (
        <path
          d="M40 110 C 30 60, 80 30, 100 38
             C 120 30, 170 60, 160 110
             C 175 130, 168 165, 145 170
             C 130 195, 70 195, 55 170
             C 32 165, 25 130, 40 110 Z"
          fill={color}
        />
      );
    case 5: // wavy mid-length behind shoulders
      return <path d="M50 100 Q42 180 60 215 L140 215 Q158 180 150 100 Z" fill={color} />;
    case 8: // braid behind
      return (
        <g fill={color}>
          <rect x="92" y="200" width="16" height="60" rx="8" />
          <ellipse cx="100" cy="218" rx="10" ry="6" fill={shade} />
          <ellipse cx="100" cy="238" rx="10" ry="6" fill={shade} />
        </g>
      );
    case 9: // pigtails — hanging DOWN at the sides
      return (
        <g fill={color}>
          <path d="M45 130 Q22 175 28 220 Q40 232 52 218 Q60 178 60 145 Q56 130 45 130 Z" />
          <path d="M155 130 Q178 175 172 220 Q160 232 148 218 Q140 178 140 145 Q144 130 155 130 Z" />
          {/* Hair ties */}
          <ellipse cx="51" cy="135" rx="9" ry="4" fill="#ff5588" />
          <ellipse cx="149" cy="135" rx="9" ry="4" fill="#ff5588" />
        </g>
      );
  }
  return null;
}

// ─── Hair front (the visible "haircut" on top of the head) ──────────────

function HairFront({ parts, color, shade }: { parts: AvatarParts; color: string; shade: string }) {
  switch (parts.hair) {
    case 0: // buzz cut: just a tight cap of hair
      return (
        <path
          d="M44 100 Q44 64 100 56 Q156 64 156 100 Q156 110 152 118 Q140 95 100 92 Q60 95 48 118 Q44 110 44 100 Z"
          fill={color}
        />
      );
    case 1: // side-part — hair cap + swept fringe + strand details
      return (
        <g>
          <path
            d="M44 100 Q44 64 100 56 Q156 64 156 100 Q156 115 152 122 Q140 95 100 92 Q60 95 48 122 Q44 115 44 100 Z"
            fill={color}
          />
          <path
            d="M58 90 Q90 70 142 88 Q148 95 145 105 Q132 92 116 100 Q98 110 80 108 Q66 105 58 90 Z"
            fill={shade}
          />
          <path d="M70 80 Q80 76 90 80" stroke={shade} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M100 75 Q115 72 130 78" stroke={shade} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 2: // long curtain — soft center-part bangs
      return (
        <path
          d="M48 95 Q50 60 100 55 Q150 60 152 100 Q140 78 110 76 Q106 84 100 86 Q94 84 90 76 Q60 78 48 100 Z"
          fill={color}
        />
      );
    case 3: // slick-back / ponytail
      return (
        <path
          d="M55 100 Q55 80 100 78 Q145 80 145 100 L145 110 Q145 95 100 95 Q55 95 55 110 Z"
          fill={color}
        />
      );
    case 4: // afro fluff front (paired w/ back fluff)
      return (
        <g fill={color}>
          <ellipse cx="80" cy="80" rx="10" ry="14" transform="rotate(-12 80 80)" />
          <ellipse cx="125" cy="75" rx="10" ry="14" transform="rotate(12 125 75)" />
          <ellipse cx="50" cy="120" rx="8" ry="12" />
          <ellipse cx="155" cy="120" rx="8" ry="12" />
        </g>
      );
    case 5: // wavy bangs
      return (
        <path
          d="M50 95 Q60 65 100 60 Q140 65 152 95 Q140 80 120 88 Q100 78 80 88 Q60 80 50 95 Z"
          fill={color}
        />
      );
    case 6: // top knot / bun
      return (
        <g>
          {/* Bun on top */}
          <ellipse cx="100" cy="70" rx="18" ry="16" fill={color} />
          {/* Hair cap connecting bun to face */}
          <path
            d="M48 96 Q48 84 60 82 Q80 80 100 88 Q120 80 140 82 Q152 84 152 96 Q140 88 100 88 Q60 88 48 96 Z"
            fill={color}
          />
          {/* Pulled-back strand sheen */}
          <path d="M65 90 Q88 80 100 82" stroke={shade} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M135 90 Q112 80 100 82" stroke={shade} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      );
    case 7: // beanie hair — small hair tuft poking out (the beanie itself is in Accessory)
      return null;
    case 8: // pulled-back hairline (for braid behind)
      return (
        <path
          d="M58 92 Q58 76 100 72 Q142 76 142 92 Q120 86 100 88 Q80 86 58 92 Z"
          fill={color}
        />
      );
    case 9: // pigtails — front bangs sweep across forehead
      return (
        <path
          d="M48 95 Q60 65 100 60 Q140 65 152 95 Q140 80 120 88 Q100 78 80 88 Q60 80 48 95 Z"
          fill={color}
        />
      );
  }
  return null;
}

// ─── Accessory ──────────────────────────────────────────────────────────

function Accessory({ parts, hairShade }: { parts: AvatarParts; hairShade: string }) {
  switch (parts.accessory) {
    case 1: // round glasses
      return (
        <g fill="none" stroke="#1a1a1a" strokeWidth="2.2">
          <circle cx="80" cy="142" r="14" />
          <circle cx="120" cy="142" r="14" />
          <line x1="94" y1="142" x2="106" y2="142" />
        </g>
      );
    case 2: // square / rectangular glasses
      return (
        <g fill="none" stroke="#1a1a1a" strokeWidth="2.2">
          <rect x="66" y="130" width="28" height="22" rx="3" />
          <rect x="106" y="130" width="28" height="22" rx="3" />
          <line x1="94" y1="142" x2="106" y2="142" />
        </g>
      );
    case 3: // sunglasses
      return (
        <g>
          <rect x="62" y="128" width="32" height="20" rx="3" fill="#1a1a1a" />
          <rect x="106" y="128" width="32" height="20" rx="3" fill="#1a1a1a" />
          <rect x="94" y="135" width="12" height="3" fill="#1a1a1a" />
          <rect x="68" y="132" width="10" height="3" fill="rgba(255,255,255,0.4)" />
          <rect x="112" y="132" width="10" height="3" fill="rgba(255,255,255,0.4)" />
        </g>
      );
    case 4: // beanie — visible hair tuft below + knit dome + cuff
      return (
        <g>
          {/* Thin tuft strip — peeking under the cuff */}
          <path
            d="M58 102 Q72 96 100 95 Q128 96 142 102 L140 108 Q120 102 100 104 Q80 102 60 108 Z"
            fill={hairShade}
          />
          {/* Beanie dome */}
          <path d="M44 96 Q44 50 100 45 Q156 50 156 96 Q120 92 100 92 Q80 92 44 96 Z" fill="#a87a32" />
          {/* Slim cuff */}
          <rect x="44" y="94" width="112" height="8" fill="#7a5a18" />
          {/* Pom */}
          <circle cx="100" cy="45" r="9" fill="#7a5a18" />
          {/* Knit texture */}
          <g stroke="#7a5a18" strokeWidth="1" opacity="0.4">
            <line x1="56" y1="62" x2="60" y2="74" />
            <line x1="76" y1="55" x2="80" y2="68" />
            <line x1="100" y1="52" x2="100" y2="65" />
            <line x1="124" y1="55" x2="120" y2="68" />
            <line x1="144" y1="62" x2="140" y2="74" />
          </g>
        </g>
      );
    case 5: // beret
      return (
        <g>
          <ellipse cx="100" cy="78" rx="40" ry="14" fill="#b81818" />
          <circle cx="135" cy="72" r="5" fill="#b81818" />
        </g>
      );
    case 6: // mustache (drawn over the mouth area)
      return (
        <g>
          <path
            d="M70 170 Q80 160 88 170 Q92 168 100 172 Q108 168 112 170 Q120 160 130 170 Q120 176 100 174 Q80 176 70 170 Z"
            fill="#3a2418"
          />
        </g>
      );
    default:
      return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    points.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
  }
  return <polygon points={points.join(' ')} />;
}

function blendCheek(skin: string): string {
  // For light skin we use a warm pink; for darker skin we shift toward warm tan.
  const [r] = rgbOf(skin);
  return r > 200 ? '#ffa48a' : '#c97a55';
}

function rgbOf(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [255, 255, 255];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function shade(hex: string, percent: number): string {
  const [r, g, b] = rgbOf(hex);
  const adjust = (v: number) => {
    if (percent > 0) return Math.min(255, v + Math.round((255 - v) * (percent / 100)));
    return Math.max(0, Math.round(v * (1 + percent / 100)));
  };
  return `#${((adjust(r) << 16) | (adjust(g) << 8) | adjust(b)).toString(16).padStart(6, '0')}`;
}
function tint(hex: string, percent: number) { return shade(hex, percent); }
