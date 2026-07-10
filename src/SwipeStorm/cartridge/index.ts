import type { ProfileKind } from '../types';
import { generatedCartridge } from './generated';

export type CardRenderer = 'profile' | 'document' | 'object-card';

export interface CartridgeItem {
  kind: ProfileKind;
  title: string;
  subtitle?: string;
  body: string;
  tags: string[];
  icon?: string;
  accent?: string;
  seal?: string;
}

export interface SwipeStormCartridge {
  id: string;
  bestKey: string;
  copy: {
    appLogo: string;
    title: string;
    tagline: string;
    leftLabel: string;
    rightLabel: string;
    tutorialLeft: string;
    tutorialRight: string;
    livesAria: string;
    lifeToken?: string;
    leaderboardName: string;
  };
  visual: {
    renderer: CardRenderer;
    backgroundTop: string;
    backgroundBottom: string;
    left: string;
    right: string;
    danger: string;
    rare: string;
  };
  feedback: {
    rightSuccess: string;
    leftSuccess: string;
    mistake: string;
    trap: string;
    rare: string;
    timeout: string;
  };
  end: {
    trapHeadlines: string[];
    trapSubs: string[];
    livesHeadlines: string[];
    livesSubs: string[];
  };
  statsLabels: {
    rightGood: string;
    leftGood: string;
    trapDodged: string;
    swiped: string;
  };
  items?: CartridgeItem[];
}

const dating: SwipeStormCartridge = {
  id: 'dating',
  bestKey: 'swipe-storm:best',
  copy: {
    appLogo: 'tinder*',
    title: 'SWIPE STORM',
    tagline: 'Left for red flags. Right for love.',
    leftLabel: 'NOPE',
    rightLabel: 'LIKE',
    tutorialLeft: 'SWIPE LEFT  NOPE',
    tutorialRight: 'SWIPE RIGHT  LIKE',
    livesAria: 'Lives',
    leaderboardName: 'Swipe Storm',
  },
  visual: {
    renderer: 'profile',
    backgroundTop: '#ffece8',
    backgroundBottom: '#fff2f2',
    left: '#fe3c72',
    right: '#00b674',
    danger: '#b81818',
    rare: '#ffd24a',
  },
  feedback: {
    rightSuccess: 'MATCH!',
    leftSuccess: 'SMART!',
    mistake: 'REGRET',
    trap: 'SCAMMED!',
    rare: 'SOULMATE',
    timeout: 'TIME OUT - 1 LIFE',
  },
  end: {
    trapHeadlines: ['Account suspended.', "You've been catfished.", 'Fraud alert.', 'Yikes.'],
    trapSubs: [
      'Your card was just charged $4,200.',
      'The "model in Moscow" stole your data.',
      'They were a bot the whole time.',
      'You sent crypto. They sent nothing.',
    ],
    livesHeadlines: ['Out of likes.', 'Swipe fatigue.', 'Maybe try IRL.', 'You picked nothing.'],
    livesSubs: [
      'You missed every match. Premium subscribers swipe faster.',
      'The algorithm has lost faith.',
      'Three real ones got away.',
      'Get back in there, champ.',
    ],
  },
  statsLabels: {
    rightGood: 'Matched',
    leftGood: 'Red flags dodged',
    trapDodged: 'Catfish dodged',
    swiped: 'Swiped',
  },
};

const wizardAcademy: SwipeStormCartridge = {
  id: 'wizard-academy',
  bestKey: 'wizard-academy-swipe:best',
  copy: {
    appLogo: 'Arcana Admissions',
    title: 'ARCANA ADMISSIONS',
    tagline: 'Reject risky files. Admit real talent.',
    leftLabel: 'REJECT',
    rightLabel: 'ADMIT',
    tutorialLeft: 'LEFT  REJECT',
    tutorialRight: 'RIGHT  ADMIT',
    livesAria: 'Seals',
    lifeToken: 'S',
    leaderboardName: 'Arcana Admissions',
  },
  visual: {
    renderer: 'document',
    backgroundTop: '#f4ead4',
    backgroundBottom: '#d9e4f2',
    left: '#9b3a2f',
    right: '#256b5f',
    danger: '#8d2430',
    rare: '#c99525',
  },
  feedback: {
    rightSuccess: 'ADMITTED',
    leftSuccess: 'BLOCKED',
    mistake: 'MISREAD',
    trap: 'CURSED FILE',
    rare: 'FULL SCHOLARSHIP',
    timeout: 'DEADLINE MISSED - 1 SEAL',
  },
  end: {
    trapHeadlines: ['The ward broke.', 'Cursed file approved.', 'Admissions closed.', 'Bad omen.'],
    trapSubs: [
      'A forged recommendation opened the east gate.',
      'The applicant was three owls in a robe.',
      'A hex slipped through your stamp queue.',
      'The dean would like a word.',
    ],
    livesHeadlines: ['Out of seals.', 'The queue wins.', 'Too many maybes.', 'Committee adjourned.'],
    livesSubs: [
      'Strong candidates waited too long and chose another academy.',
      'Your stamp hand hesitated at the worst possible time.',
      'The parchment pile has achieved sentience.',
      'Tomorrow, the applications will be stranger.',
    ],
  },
  statsLabels: {
    rightGood: 'Admitted',
    leftGood: 'Rejected risks',
    trapDodged: 'Curses blocked',
    swiped: 'Files reviewed',
  },
  items: [
    {
      kind: 'green',
      title: 'Mira Ashbell',
      subtitle: 'Scholarship applicant',
      body: 'Summoned a raincloud to save the herb garden. References arrive on time.',
      tags: ['herb lore', 'steady focus', 'clean record'],
      icon: '*',
      seal: 'merit',
      accent: '#256b5f',
    },
    {
      kind: 'green',
      title: 'Tobin Reed',
      subtitle: 'Transfer file',
      body: 'Can repair broom bristles mid-flight. Minor fear of staircases.',
      tags: ['craft magic', 'flight ready', 'kind'],
      icon: 'DIAMOND',
      seal: 'admit',
      accent: '#2d6f8e',
    },
    {
      kind: 'red',
      title: 'Orla Nightjar',
      subtitle: 'Conduct review',
      body: 'Turned three classmates into decorative candles and called it peer mentoring.',
      tags: ['risk', 'discipline note', 'unchecked ego'],
      icon: '!',
      seal: 'review',
      accent: '#9b3a2f',
    },
    {
      kind: 'red',
      title: 'Bram Vex',
      subtitle: 'Late application',
      body: 'Essay is twelve pages about why rules are optional for "visionaries".',
      tags: ['rule bending', 'volatile', 'reject'],
      icon: 'X',
      seal: 'reject',
      accent: '#8d2430',
    },
    {
      kind: 'soulmate',
      title: 'Ione Starling',
      subtitle: 'Rare prodigy',
      body: 'Translated moonlight into music notation. Every teacher wrote yes in advance.',
      tags: ['rare talent', 'humble', 'full scholarship'],
      icon: 'STAR',
      seal: 'honors',
      accent: '#c99525',
    },
    {
      kind: 'catfish',
      title: 'Lord Velvet',
      subtitle: 'Suspicious patronage',
      body: 'Recommendation letter smells like sulfur and signs itself after midnight.',
      tags: ['forgery', 'curse risk', 'do not admit'],
      icon: 'HEX',
      seal: 'cursed',
      accent: '#5e2036',
    },
  ],
};

const recycleSort: SwipeStormCartridge = {
  id: 'recycle-sort',
  bestKey: 'recycle-sort-swipe:best',
  copy: {
    appLogo: 'SORT LINE',
    title: 'SORT LINE',
    tagline: 'Divert dirty waste. Recycle clean materials.',
    leftLabel: 'DIVERT',
    rightLabel: 'RECYCLE',
    tutorialLeft: 'LEFT  DIVERT',
    tutorialRight: 'RIGHT  RECYCLE',
    livesAria: 'Checks',
    lifeToken: 'C',
    leaderboardName: 'Sort Line',
  },
  visual: {
    renderer: 'object-card',
    backgroundTop: '#e8f4ef',
    backgroundBottom: '#dce7ee',
    left: '#8b5a2b',
    right: '#25765a',
    danger: '#9a332f',
    rare: '#b8871e',
  },
  feedback: {
    rightSuccess: 'RECYCLED',
    leftSuccess: 'DIVERTED',
    mistake: 'WRONG BIN',
    trap: 'HAZARD MIXED',
    rare: 'MATERIAL SAVED',
    timeout: 'BELT MISSED - 1 CHECK',
  },
  end: {
    trapHeadlines: ['Line shut down.', 'Hazard mixed.', 'Contamination alert.', 'Sorter jammed.'],
    trapSubs: [
      'A hidden battery entered the paper stream.',
      'One bad item spoiled the batch.',
      'The baler refused the mystery object.',
      'A clean load became a cleanup job.',
    ],
    livesHeadlines: ['Checks exhausted.', 'The belt wins.', 'Too many misses.', 'Shift over.'],
    livesSubs: [
      'Clean material rolled past while you hesitated.',
      'The sorting line needs faster calls.',
      'Tomorrow the labels will be stranger.',
      'The supervisor saved the clipboard for you.',
    ],
  },
  statsLabels: {
    rightGood: 'Recycled',
    leftGood: 'Diverted',
    trapDodged: 'Hazards blocked',
    swiped: 'Items sorted',
  },
  items: [
    {
      kind: 'green',
      title: 'Clear Glass Jar',
      subtitle: 'Clean container',
      body: 'Empty, rinsed, and label-free enough for the glass stream.',
      tags: ['glass', 'clean', 'container'],
      icon: 'JAR',
      seal: 'glass',
      accent: '#25765a',
    },
    {
      kind: 'green',
      title: 'Aluminum Can',
      subtitle: 'Dry metal',
      body: 'Crushed but clean. It belongs on the recycling side of the belt.',
      tags: ['metal', 'dry', 'high value'],
      icon: 'CAN',
      seal: 'metal',
      accent: '#2f756b',
    },
    {
      kind: 'red',
      title: 'Greasy Pizza Box',
      subtitle: 'Food-soaked paper',
      body: 'The cardboard looks useful, but the oil will contaminate the paper batch.',
      tags: ['grease', 'food residue', 'divert'],
      icon: 'BOX',
      seal: 'dirty',
      accent: '#8b5a2b',
    },
    {
      kind: 'red',
      title: 'Broken Mug',
      subtitle: 'Ceramic shard',
      body: 'It looks like glass, but ceramic melts differently and should be diverted.',
      tags: ['ceramic', 'sharp', 'not glass'],
      icon: 'MUG',
      seal: 'divert',
      accent: '#7b6045',
    },
    {
      kind: 'soulmate',
      title: 'Copper Coil',
      subtitle: 'Rare recoverable metal',
      body: 'Clean copper is valuable. Route it before it disappears into mixed waste.',
      tags: ['copper', 'rare', 'recover'],
      icon: 'CU',
      seal: 'rare',
      accent: '#b8871e',
    },
    {
      kind: 'catfish',
      title: 'Battery in Paper',
      subtitle: 'Hidden hazard',
      body: 'A lithium cell is wrapped in paper. Recycling it with paper can start a fire.',
      tags: ['battery', 'hidden', 'hazard'],
      icon: 'BAT',
      seal: 'hazard',
      accent: '#9a332f',
    },
  ],
};

export const CARTRIDGES: Record<string, SwipeStormCartridge> = {
  dating,
  'wizard-academy': wizardAcademy,
  'recycle-sort': recycleSort,
  ...(generatedCartridge ? { [generatedCartridge.id]: generatedCartridge } : {}),
};

function getThemeId(): string {
  if (typeof window === 'undefined') return generatedCartridge ? 'generated' : 'dating';
  const params = new URLSearchParams(window.location.search);
  return params.get('theme') || (generatedCartridge ? 'generated' : 'dating');
}

export const activeCartridge = CARTRIDGES[getThemeId()] ?? dating;
