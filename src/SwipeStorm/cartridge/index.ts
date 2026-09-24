import type { ProfileKind } from '../types';
import { isCrazyGamesBuild } from '@shared/runtime/deployTarget';
import { guestCartridges } from './themes.guest';
import { hostCartridges, resolveHostThemeId } from './themes.host';

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

// Crazy Games ships one product. Host builds keep every cartridge, including
// `?theme=` previews. `isCrazyGamesBuild` is a compile-time constant, so the
// unused branch (and its module) is dropped from each bundle.
export const CARTRIDGES: Record<string, SwipeStormCartridge> = isCrazyGamesBuild
  ? guestCartridges
  : hostCartridges;

export const activeCartridge: SwipeStormCartridge = isCrazyGamesBuild
  ? guestCartridges.dating
  : (hostCartridges[resolveHostThemeId()] ?? hostCartridges.dating);
