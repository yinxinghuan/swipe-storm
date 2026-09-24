import type { SwipeStormCartridge } from './index';

// Original Swipe Storm presentation for the Crazy Games guest build.
// No parody wordmark, and no alternate-mode cartridges.
const dating: SwipeStormCartridge = {
  id: 'dating',
  bestKey: 'swipe-storm:best',
  copy: {
    appLogo: 'Swipe Storm',
    title: 'SWIPE STORM',
    tagline: 'Flag the fakes. Keep the real ones.',
    leftLabel: 'FLAG',
    rightLabel: 'KEEP',
    tutorialLeft: 'SWIPE LEFT',
    tutorialRight: 'SWIPE RIGHT',
    livesAria: 'Lives',
    leaderboardName: 'Swipe Storm',
  },
  visual: {
    renderer: 'profile',
    backgroundTop: '#e4e9ff',
    backgroundBottom: '#f6f3ea',
    left: '#ff4d2e',
    right: '#0e97b5',
    danger: '#c3283c',
    rare: '#f0b429',
  },
  feedback: {
    rightSuccess: 'KEPT!',
    leftSuccess: 'FLAGGED!',
    mistake: 'MISS',
    trap: 'CATFISH!',
    rare: 'TRUE ONE',
    timeout: 'TOO SLOW',
  },
  end: {
    trapHeadlines: ['Account suspended.', "You've been catfished.", 'Fraud alert.', 'Yikes.'],
    trapSubs: [
      'Your card was just charged $4,200.',
      'The "model in Moscow" stole your data.',
      'They were a bot the whole time.',
      'You sent crypto. They sent nothing.',
    ],
    livesHeadlines: ['Deck emptied.', 'Storm passed.', 'No lives left.', 'The line went quiet.'],
    livesSubs: [
      'Real ones blew past while the timer ran down.',
      'Three lives, all spent.',
      'The deck is still out there.',
      'Shuffle back in for another pass.',
    ],
  },
  statsLabels: {
    rightGood: 'Kept',
    leftGood: 'Red flags dodged',
    trapDodged: 'Catfish dodged',
    swiped: 'Swiped',
  },
};

export const guestCartridges: Record<string, SwipeStormCartridge> = { dating };
