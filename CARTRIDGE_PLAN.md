# Swipe Storm Cartridge Plan

This is the next newer 2D candidate for the "one sentence to game" template line.

## Why This Template

Swipe Storm has a reusable locked loop:

1. Show one card from a small stack.
2. Player drags left or right.
3. Resolve the card kind against the chosen direction.
4. Update score, combo, lives, banner, and stack.
5. Submit final score to leaderboard.

That loop can cover sorting, approval, moderation, triage, real/fake judgment,
keep/toss inventory, and similar one-sentence games. It fills a gap that Block
Party, Quick Draw, Sky Leap, and Corporate Climb do not cover.

## Engine Locked

Do not expose these as raw generated values:

- Swipe threshold and fling velocity.
- Card stack size and animation feel.
- Auto-expire timing and life loss behavior.
- Score/combo/lives/end-screen loop.
- Leaderboard submit and game UUID plumbing.

If the theme needs a different feel, add a named preset first.

## Cartridge Layer

Extract theme data into a cartridge object shaped roughly like this:

```ts
export interface SwipeStormCartridge {
  id: string;
  copy: {
    title: string;
    tagline: string;
    leftLabel: string;
    rightLabel: string;
    scoreLabel?: string;
    bestLabel?: string;
    againLabel?: string;
    leaderboardLabel?: string;
  };
  visuals: {
    renderer: 'profile' | 'object-card' | 'document' | 'evidence' | 'inventory';
    palette: {
      backgroundTop: string;
      backgroundBottom: string;
      left: string;
      right: string;
      danger: string;
      rare: string;
    };
  };
  roles: {
    leftGood: string;
    rightGood: string;
    rareRight?: string;
    trapRight?: string;
  };
  items: Array<{
    kind: 'leftGood' | 'rightGood' | 'rareRight' | 'trapRight';
    title: string;
    subtitle?: string;
    body: string;
    tags?: string[];
    visual?: string;
  }>;
  feedback: {
    leftSuccess: string;
    rightSuccess: string;
    mistake: string;
    trap: string;
    rare?: string;
    timeout?: string;
  };
}
```

## Required Refactor

Current dating-specific names should become generic:

- `Profile` -> `DecisionCard`
- `ProfileKind` -> `CardKind`
- `makeProfile()` -> `makeCard(cartridge)`
- `ProfileCard` -> renderer switch, with `profile` kept only as one renderer
- `LIKE / NOPE` stamps -> `cartridge.copy.rightLabel / leftLabel`
- Dating-specific stats labels -> cartridge or renderer-specific labels
- `swipe-storm:best` remains for mother template, but independent published games must use their own best key.

## First Proof Cartridge

Recommended proof: **wizard school applications**.

Sentence:

```text
审核魔法学院的入学申请，左滑拒绝，右滑通过
```

Expected screen at first glance:

- Card looks like a parchment application or student file, not a dating profile.
- Left action reads `REJECT`, right action reads `ADMIT`.
- Good admits, good rejects, rare admits, and trap admits are visually distinct.
- Mistakes explain why the player was wrong.

Status: implemented locally as `?theme=wizard-academy`.

Verification:

- `npm run build` passes.
- Default `/` still renders the original dating-card mother template.
- `/?theme=wizard-academy` renders document/application cards, `REJECT` /
  `ADMIT` labels, seal lives, and non-dating buttons.
- Playwright screenshots are stored with the external QA artifacts rather than
  referenced through machine-specific paths.

Alternative proof: **trash sorting**.

Sentence:

```text
垃圾分类，把干净材料送去回收，把脏污或危险物分流
```

Expected screen at first glance:

- Card looks like an object/material card.
- Left/right labels read like bins or categories.
- The visual design uses bins, labels, material icons, and sorting feedback.

Status: implemented locally as `?theme=recycle-sort`.

Verification:

- `npm run build` passes.
- `/?theme=recycle-sort` renders object/material cards, `DIVERT` / `RECYCLE`
  labels, check-token lives, and non-dating buttons.
- Playwright screenshot: keep the latest QA capture in the review artifact folder,
  outside the template repository.

## Lightweight Generator

Status: implemented and ready to run from the repository root.

Command:

```bash
node scripts/gen-cartridge.mjs --sentence "真假魔法药水鉴定，左滑假货，右滑真品"
npm run build
```

Preview:

```text
http://127.0.0.1:5190/?theme=generated
```

The generator writes `src/SwipeStorm/cartridge/generated.ts` and registers it
through `src/SwipeStorm/cartridge/index.ts`. It is deterministic and
conservative, not an AI generator yet.

Current families:

- `wizard-academy`: document/application approval.
- `recycle-sort`: object/material sorting.
- `potion-check`: real/fake evidence-style cards using the current
  `object-card` renderer.
- `generic-review`: fallback review/keep/pass cards.

Rules:

- Generated cartridge id stays `generated` for local preview.
- Each generated cartridge must use its own `bestKey`, derived from the
  sentence hash, so it does not reuse the mother template score.
- Do not expose raw balance: swipe threshold, timeout, combo, lives, and score
  math remain locked in the engine.
- If published, migrate to a separate game repo and create a new UUID / zipurl /
  poster / best key. Never publish by overwriting the mother template.

## QA

- `npm run build`
- Route examples hit `swipe-storm`.
- Mother `Swipe Storm` still looks like the original dating-card game.
- Proof cartridge no longer looks like dating profiles with renamed text.
- Independent publish, if created, must have its own repo, UUID, zipurl, poster,
  and best/localStorage key.
