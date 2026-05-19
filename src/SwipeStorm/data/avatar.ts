import type { AvatarParts } from '../types';

// ─── Color palettes (avatar building blocks) ─────────────────────────────

export const SKIN = [
  '#f7d9bf', '#eec095', '#d39971', '#a67049', '#7a4f30',
];
export const BG = [
  '#ffd5d3', '#d4e7ff', '#ffe9bd', '#d6f4d6', '#e7d6ff', '#ffd9ec', '#d6f4ef', '#ffe1c5',
];
export const HAIR_COLOR = [
  '#1a0f0a', '#3a2418', '#6a4a2a', '#aa7846', '#c4a87a',
  '#dd3333', '#ee22aa', '#33aa33', '#44ddff', '#ffffff',
];

export function randomAvatar(): AvatarParts {
  const ri = (n: number) => Math.floor(Math.random() * n);
  return {
    skin: ri(SKIN.length),
    bg: ri(BG.length),
    faceShape: ri(3),    // 0=round, 1=oval, 2=square
    hair: ri(10),        // 10 hairstyles
    hairColor: ri(HAIR_COLOR.length),
    eyes: ri(4),         // 0=dots, 1=oval, 2=closed-relaxed, 3=stars
    brow: ri(3),         // 0=neutral, 1=raised, 2=angry
    mouth: ri(5),        // 0=smile, 1=smirk, 2=duckface, 3=open, 4=frown
    accessory: ri(7),    // 0=none, 1-3=glasses variants, 4-5=hats, 6=facemask
    blush: Math.random() < 0.35,
    freckles: Math.random() < 0.20,
    earring: Math.random() < 0.40,
  };
}
