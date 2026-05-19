type Locale = 'zh' | 'en';

const dict: Record<Locale, Record<string, string>> = {
  zh: {
    title: 'SWIPE STORM',
    tagline: '左滑红旗，右滑真爱。',
    score: '得分',
    best: '最高',
    lives: '心',
    again: '再来一次',
    leaderboard: '排行榜',
    new_best: '新纪录！',
    final_score: '最终得分',
    matched: '匹配到',
    dodged: '避开红旗',
    catfish_dodged: '识破诈骗',
    max_combo: '最大连击',
    tut_swipe_left: '左滑 NOPE',
    tut_swipe_right: '右滑 LIKE',
  },
  en: {
    title: 'SWIPE STORM',
    tagline: 'Left for red flags. Right for love.',
    score: 'Score',
    best: 'Best',
    lives: 'Hearts',
    again: 'Play again',
    leaderboard: 'Leaderboard',
    new_best: 'New best!',
    final_score: 'Final score',
    matched: 'Matched',
    dodged: 'Red flags dodged',
    catfish_dodged: 'Catfish dodged',
    max_combo: 'Max combo',
    tut_swipe_left: 'SWIPE LEFT  NOPE',
    tut_swipe_right: 'SWIPE RIGHT  LIKE',
  },
};

function detectLocale(): Locale {
  const override = typeof localStorage !== 'undefined' ? localStorage.getItem('game_locale') : null;
  if (override === 'en' || override === 'zh') return override;
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const locale = detectLocale();

export function t(key: string, vars?: { n?: number | string }): string {
  const raw = dict[locale][key] ?? dict.en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k as keyof typeof vars] ?? ''));
}
