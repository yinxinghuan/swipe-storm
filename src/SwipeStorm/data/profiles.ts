import type { Profile, ProfileKind } from '../types';
import { randomAvatar } from './avatar';

// ─── Names ────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Chad', 'Tyler', 'Brett', 'Hunter', 'Greg', 'Logan', 'Brody', 'Connor', 'Brad',
  'Trevor', 'Brock', 'Dustin', 'Jared', 'Kyle', 'Trent', 'Tucker',
  'Brittany', 'Ashley', 'Kayla', 'Madison', 'Brooke', 'Jenna', 'Tiffany',
  'Becky', 'Caitlyn', 'Bree', 'Kennedy', 'Bailey',
  'Maximilian', 'Sebastian', 'Lorenzo', 'Dimitri', 'Xavier',
  'Aria', 'Luna', 'Athena', 'Saoirse', 'Mei-Lin',
  'Dave', 'Steve', 'Mike', 'John', 'Pete',
  'Gladys', 'Karen', 'Linda', 'Susan',
  'Skylar', 'River', 'Sage', 'Phoenix', 'Indigo',
];

// ─── Bio bank — each bio is paired with a classifier ──────────────────────

interface BioTemplate {
  bio: string;
  kind: ProfileKind;
  tags?: string[];
  ageRange?: [number, number];
}

const BIOS: BioTemplate[] = [
  // ─── RED FLAGS (the bulk of dating-app reality) ────────────────────────
  { kind: 'red', bio: 'Looking for someone to fund my startup idea ✨',                tags: ['🪙 hustler', '💡 visionary'] },
  { kind: 'red', bio: 'Just broke up YESTERDAY. Totally over it.',                     tags: ['💔 fresh', '🧨 unstable'] },
  { kind: 'red', bio: 'I have 3 kids by 2 different exes. Cool with that?',            tags: ['👨‍👧‍👦 dad', '🚩 baggage'], ageRange: [28, 50] },
  { kind: 'red', bio: 'Crypto is the future. Ask me about my memecoin.',               tags: ['🪙 crypto', '🚩 evangelist'] },
  { kind: 'red', bio: 'Living with my mom temporarily (5 years).',                     tags: ['🏠 mama\'s', '🚩 stable'], ageRange: [25, 40] },
  { kind: 'red', bio: 'I won\'t text first. Trust me, save us both time.',             tags: ['📵 anti-comms', '🚩 detached'] },
  { kind: 'red', bio: 'Looking for FWB. Or marriage. Whatever, idk.',                  tags: ['🤷 vague', '🚩 commitment'] },
  { kind: 'red', bio: 'Don\'t swipe right if you can\'t afford me.',                   tags: ['💎 high-maintenance'] },
  { kind: 'red', bio: 'I have a podcast. We should discuss male loneliness.',          tags: ['🎙 podcaster', '🚩 manosphere'], ageRange: [22, 40] },
  { kind: 'red', bio: 'My ex still lives with me. We\'re cool though.',                tags: ['🚩 ex-roommate'] },
  { kind: 'red', bio: 'Just got out of prison! Looking for a fresh start ❤️',          tags: ['🚩 fresh out'] },
  { kind: 'red', bio: 'I\'m a vegan but my dog is too.',                               tags: ['🌱 vegan', '🚩 zealot'] },
  { kind: 'red', bio: 'Recently divorced. She took everything. Including my joy.',     tags: ['💔 bitter'] },
  { kind: 'red', bio: 'CEO of my own life. Also Etsy store.',                          tags: ['👑 self-made', '🚩 LinkedIn'] },
  { kind: 'red', bio: 'I\'m here for a good time, not a long time.',                   tags: ['⏳ short-term'] },
  { kind: 'red', bio: 'Spiritual but not religious. Reiki master. ✨',                 tags: ['🔮 woo-woo'] },
  { kind: 'red', bio: 'My astrologer said I shouldn\'t date Geminis. But here we are.', tags: ['🔮 astrology'] },
  { kind: 'red', bio: 'I sell life insurance. DM me first.',                           tags: ['🚩 MLM', '💼 sales'] },
  { kind: 'red', bio: 'Wife passed away. Looking for a stepmom for my 4 kids.',        tags: ['👨‍👧‍👦 widower'], ageRange: [38, 55] },
  { kind: 'red', bio: 'Looking for someone to convert. To my MLM, I mean.',            tags: ['🚩 MLM', '💸 pyramid'] },
  { kind: 'red', bio: 'I drink. A lot. Best friends with bourbon.',                    tags: ['🥃 alcoholic'] },
  { kind: 'red', bio: '🚭 No smokers. 🍺 No drinkers. 🐱 No cats. 👶 No kids ever.',   tags: ['🚩 picky'] },
  { kind: 'red', bio: 'I\'m a Scorpio so be afraid 😈',                                tags: ['🔮 astrology'] },
  { kind: 'red', bio: 'Stay-at-home boyfriend looking for sugar mama 💅',              tags: ['🚩 looking for funding'] },
  { kind: 'red', bio: 'NO HOOKUPS. unless ur cute.',                                   tags: ['🤷 hypocrite'] },

  // ─── CATFISH (instant game-over on right swipe) ────────────────────────
  { kind: 'catfish', bio: 'My pics are real. Click here for more 🔥 http://bit.ly/...', tags: ['⚠️ CATFISH', '🐟 scam'] },
  { kind: 'catfish', bio: 'I\'m here to share investment opportunities with you.',     tags: ['⚠️ CATFISH', '🪙 scam'] },
  { kind: 'catfish', bio: 'I will give crypto tips on Telegram. DM @SuccessGuru99',    tags: ['⚠️ CATFISH', '📱 sus'] },
  { kind: 'catfish', bio: 'Pretty girl, age 23, model in city. Send pic plz.',         tags: ['⚠️ CATFISH'] },
  { kind: 'catfish', bio: 'CEO of Apple, Google, Tesla. Net worth: $10B. Lonely.',     tags: ['⚠️ CATFISH', '🚩 lol'], ageRange: [25, 40] },
  { kind: 'catfish', bio: 'Following all profiles for friendship. Send WhatsApp.',     tags: ['⚠️ CATFISH'] },
  { kind: 'catfish', bio: 'I trust you with my heart. And my bank account.',           tags: ['⚠️ CATFISH'] },
  { kind: 'catfish', bio: 'AI-generated profile #4729. Beep boop.',                    tags: ['⚠️ CATFISH', '🤖 bot'] },

  // ─── GREEN FLAGS (rare gems — swipe right) ─────────────────────────────
  { kind: 'green',  bio: 'Software engineer, into hiking and books. Loves dogs.',      tags: ['💚 normal', '📚 reader'] },
  { kind: 'green',  bio: 'Teacher. Pays rent on time. Owns furniture.',                tags: ['💚 stable'] },
  { kind: 'green',  bio: 'Looking for a partner to cook bad meals with.',              tags: ['💚 honest'] },
  { kind: 'green',  bio: 'I have a 9-5 and emotional regulation.',                     tags: ['💚 boring'] },
  { kind: 'green',  bio: 'Therapist (in therapy). Reads emails.',                      tags: ['💚 communicates'] },
  { kind: 'green',  bio: 'Nurse. Knows CPR. Knows when to say no.',                    tags: ['💚 grown-up'] },
  { kind: 'green',  bio: 'Plant dad. Apartment-trained myself.',                       tags: ['💚 wholesome'] },
  { kind: 'green',  bio: 'Has hobbies AND friends. Wild, I know.',                     tags: ['💚 normal'] },

  // ─── SOULMATES (rare unicorn — +100 on right) ──────────────────────────
  { kind: 'soulmate', bio: 'Wants kids, owns a home, communicates clearly.',           tags: ['👑 unicorn'] },
  { kind: 'soulmate', bio: 'Soulmate energy. Funny, kind, financially literate.',      tags: ['👑 unicorn'] },
  { kind: 'soulmate', bio: 'Loves your mother. Has therapy on Wednesdays.',            tags: ['👑 unicorn'] },
  { kind: 'soulmate', bio: 'Tall, employed, replies within 6 hours.',                  tags: ['👑 unicorn'] },
  { kind: 'soulmate', bio: 'Reads. Cooks. Cleans. Listens. Real.',                     tags: ['👑 unicorn'] },
];

// Spawn weights — most spawns are red flags (matches Tinder reality)
const KIND_WEIGHTS: Record<ProfileKind, number> = {
  red: 0.62,
  catfish: 0.12,
  green: 0.18,
  soulmate: 0.08,
};

function weightedKind(rng: () => number): ProfileKind {
  let r = rng();
  for (const k of ['red', 'catfish', 'green', 'soulmate'] as ProfileKind[]) {
    r -= KIND_WEIGHTS[k];
    if (r <= 0) return k;
  }
  return 'red';
}

let nextUid = 1;

/** Generate a fresh random profile. */
export function makeProfile(): Profile {
  const kind = weightedKind(Math.random);
  // Pick from bios matching the kind
  const pool = BIOS.filter(b => b.kind === kind);
  const template = pool[Math.floor(Math.random() * pool.length)];
  const ageRange = template.ageRange ?? [22, 42];
  const age = ageRange[0] + Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1));
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  return {
    uid: nextUid++,
    kind,
    name,
    age,
    bio: template.bio,
    tags: template.tags?.slice() ?? [],
    avatar: randomAvatar(),
  };
}
