import type { AvatarParts } from '../types';
import { BG, HAIR_COLOR, SKIN } from '../data/avatar';

/** Procedurally-composed dating-profile portrait. ~200×260 viewBox. */
export function Avatar({ parts }: { parts: AvatarParts }) {
  const skin = SKIN[parts.skin % SKIN.length];
  const bg = BG[parts.bg % BG.length];
  const hairColor = HAIR_COLOR[parts.hairColor % HAIR_COLOR.length];

  // Pre-compute shading colors
  const skinShade = shade(skin, -18);
  const hairShade = shade(hairColor, -25);

  return (
    <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid slice" className="ss-avatar">
      {/* Background */}
      <rect width="200" height="260" fill={bg} />
      {/* Subtle gradient over bg */}
      <defs>
        <linearGradient id={`g-${parts.skin}-${parts.bg}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={tint(bg, 18)} />
          <stop offset="100%" stopColor={shade(bg, -10)} />
        </linearGradient>
        <radialGradient id={`light-${parts.skin}`} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <rect width="200" height="260" fill={`url(#g-${parts.skin}-${parts.bg})`} />

      {/* Neck + collar */}
      <rect x="80" y="215" width="40" height="45" fill={skinShade} />
      <Collar parts={parts} />

      {/* Hair back layer */}
      <HairBack parts={parts} color={hairColor} shade={hairShade} />

      {/* Head */}
      <Head parts={parts} skin={skin} shade={skinShade} />

      {/* Freckles */}
      {parts.freckles && (
        <g fill={shade(skin, -22)} opacity="0.6">
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={80 + (i % 3) * 14 + (i > 2 ? 7 : 0)} cy={i < 3 ? 132 : 142} r="1.4" />
          ))}
        </g>
      )}

      {/* Blush */}
      {parts.blush && (
        <g fill="#ff6b8a" opacity="0.32">
          <ellipse cx="72" cy="148" rx="11" ry="6" />
          <ellipse cx="128" cy="148" rx="11" ry="6" />
        </g>
      )}

      {/* Brows */}
      <Brows parts={parts} color={hairShade} />

      {/* Eyes */}
      <Eyes parts={parts} />

      {/* Mouth */}
      <Mouth parts={parts} skin={skin} shade={skinShade} />

      {/* Hair front layer (sits over forehead) */}
      <HairFront parts={parts} color={hairColor} shade={hairShade} />

      {/* Accessory (glasses / hat / facemask) */}
      <Accessory parts={parts} hairColor={hairColor} />

      {/* Earring */}
      {parts.earring && (
        <g>
          <circle cx="48" cy="155" r="3.5" fill="#ffd24a" stroke="#a87a18" strokeWidth="0.7" />
          <circle cx="152" cy="155" r="3.5" fill="#ffd24a" stroke="#a87a18" strokeWidth="0.7" />
        </g>
      )}

      {/* Soft overall highlight */}
      <rect width="200" height="260" fill={`url(#light-${parts.skin})`} pointerEvents="none" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────

function Head({ parts, skin, shade }: { parts: AvatarParts; skin: string; shade: string }) {
  switch (parts.faceShape) {
    case 0: // round
      return (
        <>
          <ellipse cx="100" cy="140" rx="52" ry="56" fill={skin} stroke={shade} strokeWidth="1.5" />
          <path d="M50 152 Q100 215 150 152" fill="none" />
        </>
      );
    case 1: // oval
      return <ellipse cx="100" cy="140" rx="48" ry="62" fill={skin} stroke={shade} strokeWidth="1.5" />;
    default: // square / boxy
      return (
        <path
          d="M55 100 Q55 80 75 78 L125 78 Q145 80 145 100 L145 178 Q145 198 125 200 L75 200 Q55 198 55 178 Z"
          fill={skin}
          stroke={shade}
          strokeWidth="1.5"
        />
      );
  }
}

function Brows({ parts, color }: { parts: AvatarParts; color: string }) {
  const y = 122;
  switch (parts.brow) {
    case 1: // raised right
      return (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d={`M70 ${y} Q80 ${y - 4} 90 ${y - 1}`} />
          <path d={`M110 ${y - 6} Q120 ${y - 10} 130 ${y - 5}`} />
        </g>
      );
    case 2: // angry / furrowed
      return (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d={`M70 ${y + 3} Q80 ${y - 2} 90 ${y + 1}`} />
          <path d={`M110 ${y + 1} Q120 ${y - 2} 130 ${y + 3}`} />
        </g>
      );
    default: // neutral
      return (
        <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d={`M70 ${y} Q80 ${y - 5} 90 ${y - 1}`} />
          <path d={`M110 ${y - 1} Q120 ${y - 5} 130 ${y}`} />
        </g>
      );
  }
}

function Eyes({ parts }: { parts: AvatarParts }) {
  switch (parts.eyes) {
    case 1: // big oval anime
      return (
        <g>
          <ellipse cx="80" cy="140" rx="7" ry="9" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
          <ellipse cx="120" cy="140" rx="7" ry="9" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
          <circle cx="80" cy="142" r="4" fill="#1a1a1a" />
          <circle cx="120" cy="142" r="4" fill="#1a1a1a" />
          <circle cx="82" cy="140" r="1.5" fill="#fff" />
          <circle cx="122" cy="140" r="1.5" fill="#fff" />
        </g>
      );
    case 2: // closed / smug
      return (
        <g fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round">
          <path d="M70 142 Q80 137 90 142" />
          <path d="M110 142 Q120 137 130 142" />
        </g>
      );
    case 3: // stars (heart eyes)
      return (
        <g fill="#ff3a7a">
          <Star cx={80} cy={140} r={6} />
          <Star cx={120} cy={140} r={6} />
        </g>
      );
    default: // dots
      return (
        <g fill="#1a1a1a">
          <circle cx="80" cy="142" r="3.5" />
          <circle cx="120" cy="142" r="3.5" />
        </g>
      );
  }
}

function Mouth({ parts, skin, shade }: { parts: AvatarParts; skin: string; shade: string }) {
  const y = 170;
  void skin; void shade;
  switch (parts.mouth) {
    case 1: // smirk
      return (
        <path d={`M86 ${y + 4} Q100 ${y + 6} 116 ${y - 2}`} stroke="#3a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
    case 2: // duckface / pout
      return (
        <g>
          <ellipse cx="100" cy={y + 4} rx="14" ry="6" fill="#d83555" />
          <ellipse cx="100" cy={y + 1} rx="14" ry="3" fill="#ff85a8" />
        </g>
      );
    case 3: // open / surprised
      return (
        <ellipse cx="100" cy={y + 6} rx="9" ry="10" fill="#3a1a1a" />
      );
    case 4: // frown
      return (
        <path d={`M86 ${y + 8} Q100 ${y - 2} 114 ${y + 8}`} stroke="#3a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
    default: // smile
      return (
        <path d={`M82 ${y} Q100 ${y + 14} 118 ${y}`} stroke="#3a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      );
  }
}

function HairBack({ parts, color, shade }: { parts: AvatarParts; color: string; shade: string }) {
  void shade;
  switch (parts.hair) {
    case 0: // short, no back hair
      return null;
    case 1: // medium-long
      return <path d="M48 100 Q40 200 70 230 L130 230 Q160 200 152 100 Z" fill={color} />;
    case 2: // long flowing
      return <path d="M40 100 Q30 250 80 270 L120 270 Q170 250 160 100 Z" fill={color} />;
    case 3: // ponytail behind
      return <path d="M150 130 Q190 170 175 220 Q160 230 150 200 Z" fill={color} />;
    case 4: // big curly
      return (
        <g fill={color}>
          <circle cx="55" cy="120" r="20" />
          <circle cx="55" cy="155" r="22" />
          <circle cx="60" cy="190" r="20" />
          <circle cx="145" cy="120" r="20" />
          <circle cx="145" cy="155" r="22" />
          <circle cx="140" cy="190" r="20" />
        </g>
      );
    case 5: // wavy mid
      return <path d="M50 100 Q42 180 60 215 L140 215 Q158 180 150 100 Z" fill={color} />;
    case 6: // bun on top — no back
      return null;
    case 7: // beanie hair — minimal
      return <path d="M55 130 Q55 170 70 195 L130 195 Q145 170 145 130 Z" fill={color} />;
    case 8: // braid behind
      return (
        <g fill={color}>
          <rect x="92" y="200" width="16" height="65" rx="8" />
          <ellipse cx="100" cy="215" rx="10" ry="6" fill={shade} />
          <ellipse cx="100" cy="235" rx="10" ry="6" fill={shade} />
        </g>
      );
    case 9: // pigtails
      return (
        <g fill={color}>
          <ellipse cx="44" cy="180" rx="15" ry="28" />
          <ellipse cx="156" cy="180" rx="15" ry="28" />
        </g>
      );
  }
  return null;
}

function HairFront({ parts, color, shade }: { parts: AvatarParts; color: string; shade: string }) {
  switch (parts.hair) {
    case 0: // buzz cut
      return <path d="M52 95 Q52 80 75 76 L125 76 Q148 80 148 95 L148 115 Q100 105 52 115 Z" fill={color} />;
    case 1: // side part
      return (
        <g>
          <path d="M50 110 Q60 80 100 75 Q140 80 150 110 Q140 90 100 88 Q60 90 50 110 Z" fill={color} />
          <path d="M85 90 Q105 95 145 105 L140 92 Q110 80 85 90 Z" fill={shade} />
        </g>
      );
    case 2: // fringe down
      return (
        <path d="M55 110 Q55 85 100 80 Q145 85 145 110 L140 130 Q120 122 100 130 Q80 122 60 130 Z" fill={color} />
      );
    case 3: // slicked back / ponytail
      return (
        <path d="M55 100 Q55 80 100 78 Q145 80 145 100 L145 110 Q145 95 100 95 Q55 95 55 110 Z" fill={color} />
      );
    case 4: // afro fluff front
      return (
        <g fill={color}>
          <circle cx="100" cy="90" r="25" />
          <circle cx="78" cy="100" r="20" />
          <circle cx="122" cy="100" r="20" />
        </g>
      );
    case 5: // wavy bangs
      return (
        <path d="M55 110 Q70 90 85 100 Q100 88 115 100 Q130 90 145 110 L145 95 Q100 70 55 95 Z" fill={color} />
      );
    case 6: // top knot / bun
      return (
        <g>
          <circle cx="100" cy="72" r="22" fill={color} />
          <ellipse cx="100" cy="95" rx="30" ry="8" fill={shade} />
          <path d="M70 100 Q100 100 130 100 L130 110 Q100 108 70 110 Z" fill={color} />
        </g>
      );
    case 7: // beanie
      return (
        <g>
          <path d="M50 110 Q50 70 100 65 Q150 70 150 110 Z" fill={shade} />
          <rect x="50" y="103" width="100" height="14" fill={color} />
          <circle cx="100" cy="60" r="8" fill={color} />
        </g>
      );
    case 8: // hairline (with braid behind)
      return (
        <path d="M58 110 Q58 88 100 82 Q142 88 142 110 Q120 100 100 102 Q80 100 58 110 Z" fill={color} />
      );
    case 9: // pigtails front
      return (
        <path d="M55 110 Q60 82 100 78 Q140 82 145 110 L140 120 Q100 112 60 120 Z" fill={color} />
      );
  }
  return null;
}

function Accessory({ parts, hairColor }: { parts: AvatarParts; hairColor: string }) {
  switch (parts.accessory) {
    case 1: // round glasses
      return (
        <g fill="none" stroke="#1a1a1a" strokeWidth="2.2">
          <circle cx="80" cy="142" r="14" />
          <circle cx="120" cy="142" r="14" />
          <line x1="94" y1="142" x2="106" y2="142" />
        </g>
      );
    case 2: // square glasses
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
    case 4: // backwards cap
      return (
        <g>
          <path d="M52 95 Q52 78 100 73 Q148 78 148 95 L148 100 L52 100 Z" fill={shade(hairColor, -10)} />
          <ellipse cx="100" cy="100" rx="49" ry="6" fill={shade(hairColor, -25)} />
          <text x="100" y="92" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Inter, sans-serif">CEO</text>
        </g>
      );
    case 5: // beret
      return (
        <g>
          <ellipse cx="100" cy="80" rx="42" ry="14" fill="#b81818" />
          <circle cx="138" cy="74" r="5" fill="#b81818" />
        </g>
      );
    case 6: // mustache (instead of mouth accessory)
      return (
        <g>
          <path d="M70 168 Q80 158 88 168 Q92 166 100 170 Q108 166 112 168 Q120 158 130 168 Q120 175 100 172 Q80 175 70 168 Z" fill="#3a2418" />
        </g>
      );
    default:
      return null;
  }
}

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    points.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
  }
  return <polygon points={points.join(' ')} />;
}

function Collar({ parts }: { parts: AvatarParts }) {
  // Simple shirt collar shape — color tied to bg for variety
  const collarColor = ['#3a3a3a', '#7a1818', '#1a3a6a', '#3a6a1a', '#aa7a4a'][parts.bg % 5];
  return (
    <g>
      <path d="M50 260 L50 230 Q100 220 100 240 Q100 220 150 230 L150 260 Z" fill={collarColor} />
      <path d="M80 240 L100 250 L120 240 L120 260 L80 260 Z" fill="#fff" opacity="0.9" />
    </g>
  );
}

// ─── Color helpers ───────────────────────────────────────────────────────

function shade(hex: string, percent: number): string {
  const m = /^#?([0-9a-f]{3,6})$/i.exec(hex.trim().replace(',', ''));
  if (!m) return hex;
  let raw = m[1];
  if (raw.length === 3) raw = raw.split('').map(c => c + c).join('');
  const n = parseInt(raw, 16);
  const adjust = (v: number) => {
    if (percent > 0) return Math.min(255, v + Math.round((255 - v) * (percent / 100)));
    return Math.max(0, Math.round(v * (1 + percent / 100)));
  };
  const r = adjust((n >> 16) & 0xff);
  const g = adjust((n >> 8) & 0xff);
  const b = adjust(n & 0xff);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
function tint(hex: string, percent: number) { return shade(hex, percent); }
