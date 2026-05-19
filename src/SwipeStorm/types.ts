export type Screen = 'playing' | 'end';

/** A profile's true classification — determines the correct swipe direction. */
export type ProfileKind =
  | 'green'      // genuine match — swipe RIGHT for +10
  | 'red'        // red flag — swipe LEFT for +5; right = -10 (regret)
  | 'soulmate'   // golden — swipe RIGHT for +100
  | 'catfish';   // scam — RIGHT = instant game over; LEFT = +5

export interface AvatarParts {
  skin: number;          // index into SKIN palette
  bg: number;            // bg color
  faceShape: number;     // 0..3
  hair: number;          // hairstyle index
  hairColor: number;     // hair color index
  eyes: number;          // 0..3
  brow: number;          // 0..2
  mouth: number;         // 0..4
  accessory: number;     // 0 = none, 1+ = glasses / beard / hat / etc
  blush: boolean;
  freckles: boolean;
  earring: boolean;
}

export interface Profile {
  uid: number;
  kind: ProfileKind;
  name: string;
  age: number;
  bio: string;
  tags: string[];
  avatar: AvatarParts;
}

export interface Stats {
  finalScore: number;
  totalSwiped: number;
  matchedReal: number;
  dodgedReds: number;
  catfishCaught: number;
  greenMissed: number;     // left-swiped a green flag (no penalty but stat)
  maxCombo: number;
  isNewBest: boolean;
  endReason: 'catfish' | 'lives' | null;
}

/** Outcome of resolving a swipe — produced by useSwipeStorm. */
export interface SwipeOutcome {
  delta: number;      // score change
  comboInc: boolean;  // true if this swipe should continue/start combo
  comboBreak: boolean;
  banner?: string;    // optional banner text (for catfish, soulmate, etc.)
  bannerColor?: string;
  gameOver: boolean;  // true if catfish-right was committed
  loseLife: boolean;  // true if a life should be deducted
}
