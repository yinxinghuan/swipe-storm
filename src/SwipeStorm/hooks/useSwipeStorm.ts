import { useCallback, useEffect, useRef, useState } from 'react';
import type { Profile, Screen, Stats, SwipeOutcome } from '../types';
import { makeProfile } from '../data/profiles';
import {
  sfxCatfish, sfxDodgeRed, sfxExpire, sfxMatch, sfxRegret,
  sfxRunEnd, sfxSoulmate, sfxSwipeStart, sfxSwipeCommit,
  startAmbient, stopAmbient, unlockAudio,
} from '../utils/audio';

const BEST_KEY = 'swipe-storm:best';
const LIVES = 3;
const STACK_SIZE = 3;        // visible cards (top one is active)
const SWIPE_COMMIT_PX = 90;   // px of horizontal drag to commit
const CARD_AUTO_EXPIRE_MS = 6500; // card auto-flies off if no decision

export interface CardState {
  profile: Profile;
  /** Live drag offset & rotation. Updated by pointer move. */
  dragX: number;
  dragY: number;
  /** Velocity (px/sec) at most recent move sample, used for fling momentum. */
  velX: number;
  /** Animation phase: 'idle' = waiting, 'leaving' = flying off, 'gone'. */
  phase: 'idle' | 'leaving' | 'gone';
  /** Direction it left in (±1). 0 while idle. */
  leftDir: -1 | 0 | 1;
  /** Birth time for auto-expire countdown. */
  born: number;
}

export function useSwipeStorm() {
  // ─── Refs / mutable state ──
  const screenRef = useRef<Screen>('playing');
  const gameStartedRef = useRef<boolean>(false);

  // Card stack — top of array is the next card to enter; tail is the active card
  const stackRef = useRef<CardState[]>([]);
  const draggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragLastTRef = useRef<number>(0);
  const dragLastXRef = useRef<number>(0);

  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(LIVES);
  const comboRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);

  const totalSwipedRef = useRef<number>(0);
  const matchedRealRef = useRef<number>(0);
  const dodgedRedsRef = useRef<number>(0);
  const catfishCaughtRef = useRef<number>(0);
  const greenMissedRef = useRef<number>(0);
  const endReasonRef = useRef<'catfish' | 'lives' | null>(null);

  // ─── React state (HUD-driving) ──
  const [, forceRender] = useState(0);
  const [screen, setScreen] = useState<Screen>('playing');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [combo, setCombo] = useState(0);
  const [banner, setBanner] = useState<{ text: string; color: string; key: number } | null>(null);
  const [best, setBest] = useState<number>(() => {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(BEST_KEY) : null;
    return v ? Number(v) || 0 : 0;
  });
  const [stats, setStats] = useState<Stats>({
    finalScore: 0, totalSwiped: 0, matchedReal: 0, dodgedReds: 0, catfishCaught: 0,
    greenMissed: 0, maxCombo: 0, isNewBest: false, endReason: null,
  });
  const [hasInteracted, setHasInteracted] = useState(false);

  // ─── Helpers ──
  const refresh = () => forceRender(n => n + 1);

  // Fill the stack up to STACK_SIZE
  const topUp = useCallback(() => {
    const now = performance.now();
    while (stackRef.current.length < STACK_SIZE) {
      stackRef.current.unshift({
        profile: makeProfile(),
        dragX: 0, dragY: 0, velX: 0,
        phase: 'idle',
        leftDir: 0,
        born: now,
      });
    }
  }, []);

  // ─── Score resolution ──
  const resolveSwipe = useCallback((card: CardState, direction: -1 | 1): SwipeOutcome => {
    const { profile } = card;
    const out: SwipeOutcome = {
      delta: 0, comboInc: false, comboBreak: false, gameOver: false, loseLife: false,
    };
    if (direction === 1) {
      // RIGHT (LIKE)
      if (profile.kind === 'green') {
        out.delta = 10;
        out.comboInc = true;
        matchedRealRef.current += 1;
        sfxMatch();
        out.banner = 'MATCH!';
        out.bannerColor = '#3aa84a';
      } else if (profile.kind === 'soulmate') {
        out.delta = 100;
        out.comboInc = true;
        matchedRealRef.current += 1;
        sfxSoulmate();
        out.banner = '✨ SOULMATE ✨';
        out.bannerColor = '#ffd24a';
      } else if (profile.kind === 'red') {
        out.delta = -10;
        out.comboBreak = true;
        sfxRegret();
        out.banner = 'REGRET';
        out.bannerColor = '#b81818';
      } else if (profile.kind === 'catfish') {
        out.gameOver = true;
        sfxCatfish();
        endReasonRef.current = 'catfish';
        out.banner = 'SCAMMED!';
        out.bannerColor = '#b81818';
      }
    } else {
      // LEFT (NOPE)
      if (profile.kind === 'red') {
        out.delta = 5;
        out.comboInc = true;
        dodgedRedsRef.current += 1;
        sfxDodgeRed();
      } else if (profile.kind === 'catfish') {
        out.delta = 5;
        out.comboInc = true;
        catfishCaughtRef.current += 1;
        sfxDodgeRed();
        out.banner = 'SMART!';
        out.bannerColor = '#3aa84a';
      } else if (profile.kind === 'green' || profile.kind === 'soulmate') {
        out.delta = 0;
        out.comboBreak = true;
        greenMissedRef.current += 1;
        sfxRegret();
        out.banner = 'MISSED…';
        out.bannerColor = '#aa6633';
      }
    }
    return out;
  }, []);

  const commitSwipe = useCallback((direction: -1 | 1, withVelocity = false) => {
    const stack = stackRef.current;
    const active = stack[stack.length - 1];
    if (!active || active.phase !== 'idle') return;

    // Fly off in the swiped direction
    active.phase = 'leaving';
    active.leftDir = direction;
    if (!withVelocity) active.velX = direction * 1400;
    sfxSwipeCommit();

    const out = resolveSwipe(active, direction);
    if (out.delta !== 0) {
      scoreRef.current = Math.max(0, scoreRef.current + out.delta);
      setScore(scoreRef.current);
    }
    if (out.comboInc) {
      comboRef.current += 1;
      if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
      setCombo(comboRef.current);
    } else if (out.comboBreak) {
      comboRef.current = 0;
      setCombo(0);
    }
    if (out.banner) {
      setBanner({ text: out.banner, color: out.bannerColor || '#fff', key: performance.now() });
    }
    totalSwipedRef.current += 1;

    if (out.gameOver) {
      endRun();
      return;
    }
  }, [resolveSwipe]);

  const endRun = useCallback(() => {
    stopAmbient();
    sfxRunEnd();
    const finalScore = scoreRef.current;
    const isNewBest = finalScore > best;
    if (isNewBest) {
      try { localStorage.setItem(BEST_KEY, String(finalScore)); } catch { /* ignore */ }
      setBest(finalScore);
    }
    setStats({
      finalScore,
      totalSwiped: totalSwipedRef.current,
      matchedReal: matchedRealRef.current,
      dodgedReds: dodgedRedsRef.current,
      catfishCaught: catfishCaughtRef.current,
      greenMissed: greenMissedRef.current,
      maxCombo: maxComboRef.current,
      isNewBest,
      endReason: endReasonRef.current,
    });
    setScreen('end');
    screenRef.current = 'end';
  }, [best]);

  // ─── Start / restart ──
  const start = useCallback(() => {
    stackRef.current = [];
    draggingRef.current = false;
    gameStartedRef.current = false;
    scoreRef.current = 0;
    livesRef.current = LIVES;
    comboRef.current = 0;
    maxComboRef.current = 0;
    totalSwipedRef.current = 0;
    matchedRealRef.current = 0;
    dodgedRedsRef.current = 0;
    catfishCaughtRef.current = 0;
    greenMissedRef.current = 0;
    endReasonRef.current = null;
    setScore(0);
    setLives(LIVES);
    setCombo(0);
    setBanner(null);
    setHasInteracted(false);
    topUp();
    setScreen('playing');
    screenRef.current = 'playing';
    unlockAudio();
    startAmbient();
  }, [topUp]);

  // ─── Pointer handling ──
  const onPointerDown = useCallback((clientX: number) => {
    unlockAudio();
    if (screenRef.current !== 'playing') return;
    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      setHasInteracted(true);
    }
    const stack = stackRef.current;
    const active = stack[stack.length - 1];
    if (!active || active.phase !== 'idle') return;
    draggingRef.current = true;
    dragStartXRef.current = clientX;
    dragLastXRef.current = clientX;
    dragLastTRef.current = performance.now();
    sfxSwipeStart();
  }, []);

  const onPointerMove = useCallback((clientX: number) => {
    if (!draggingRef.current) return;
    if (screenRef.current !== 'playing') return;
    const stack = stackRef.current;
    const active = stack[stack.length - 1];
    if (!active || active.phase !== 'idle') return;
    const dx = clientX - dragStartXRef.current;
    active.dragX = dx;
    active.dragY = Math.abs(dx) * 0.08; // slight downward drift
    // Track velocity for fling
    const now = performance.now();
    const dt = now - dragLastTRef.current;
    if (dt > 0) active.velX = ((clientX - dragLastXRef.current) / dt) * 1000;
    dragLastXRef.current = clientX;
    dragLastTRef.current = now;
    refresh();
  }, []);

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const stack = stackRef.current;
    const active = stack[stack.length - 1];
    if (!active || active.phase !== 'idle') return;
    const dx = active.dragX;
    const speed = active.velX;
    // Commit if past threshold OR if fling velocity is strong enough
    const flingSpeed = 800;
    if (dx > SWIPE_COMMIT_PX || speed > flingSpeed) {
      commitSwipe(1, true);
    } else if (dx < -SWIPE_COMMIT_PX || speed < -flingSpeed) {
      commitSwipe(-1, true);
    } else {
      // Spring back — leave phase 'idle' so the snap-back animation handles itself
      active.dragX = 0;
      active.dragY = 0;
      active.velX = 0;
    }
    refresh();
  }, [commitSwipe]);

  const onPointerCancel = onPointerUp;

  // Programmatic commit (e.g. for buttons)
  const swipeRight = useCallback(() => commitSwipe(1), [commitSwipe]);
  const swipeLeft  = useCallback(() => commitSwipe(-1), [commitSwipe]);

  // ─── RAF: animate leaving cards + auto-expire idle ones ──
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  useEffect(() => {
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - (lastTickRef.current || t)) / 1000);
      lastTickRef.current = t;

      if (screenRef.current === 'playing') {
        const stack = stackRef.current;
        let mutated = false;
        for (let i = stack.length - 1; i >= 0; i--) {
          const c = stack[i];
          if (c.phase === 'leaving') {
            // Fly off with momentum + gravity
            c.dragX += c.velX * dt;
            c.dragY += 600 * dt;
            c.velX *= 0.985;
            if (Math.abs(c.dragX) > 900 || c.dragY > 800) {
              c.phase = 'gone';
            }
            mutated = true;
          } else if (c.phase === 'gone') {
            stack.splice(i, 1);
            mutated = true;
          } else if (c.phase === 'idle' && i === stack.length - 1 && !draggingRef.current && gameStartedRef.current) {
            // Auto-expire the top card if untouched for too long
            const age = t - c.born;
            if (age > CARD_AUTO_EXPIRE_MS) {
              // Treat expire as "swipe left" but soft — lose a life if green/soulmate, no penalty otherwise
              if (c.profile.kind === 'green' || c.profile.kind === 'soulmate') {
                // missed a great match — also -1 life (you couldn't decide)
                livesRef.current -= 1;
                setLives(livesRef.current);
                greenMissedRef.current += 1;
                sfxExpire();
                setBanner({ text: 'TIME OUT — 1 LIFE', color: '#b81818', key: performance.now() });
                if (livesRef.current <= 0) {
                  endReasonRef.current = 'lives';
                  endRun();
                }
              } else {
                // Red flag or catfish auto-skipped: small reward (you didn't engage)
                scoreRef.current += 2;
                setScore(scoreRef.current);
                dodgedRedsRef.current += 1;
              }
              c.phase = 'leaving';
              c.leftDir = -1;
              c.velX = -800;
              totalSwipedRef.current += 1;
              mutated = true;
            }
          }
        }
        topUp();
        if (mutated) refresh();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [endRun, topUp]);

  // Auto-start on mount
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    start();
  }, [start]);

  useEffect(() => () => { stopAmbient(); }, []);

  return {
    screen, score, lives, combo, banner, best, stats, hasInteracted,
    stack: stackRef.current,
    isDragging: draggingRef.current,
    start, swipeLeft, swipeRight,
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  };
}
