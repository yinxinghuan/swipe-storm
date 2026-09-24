# Crazy Games build

Swipe Storm ships two static builds:

| | GitHub Pages / other hosts | Crazy Games |
| --- | --- | --- |
| Command | `npm run build` | `npm run build:crazygames` |
| Output | `dist/` | `dist-crazygames/`, copied to `artifacts/crazygames/` |
| Upload zip | — | `artifacts/swipe-storm-crazygames.zip` (`index.html` at the zip root) |
| Asset paths | relative (`./`) | relative (`./`), safe for iframe hosting |
| AlterU / Aigram | optional; active only when the host passes `api_origin` and `telegram_id` | **off**. Guests play immediately. No login wall and no App Store link |

## Guest play

Crazy Games requires that guests can play and that the game does not add its own login (including AlterU / Aigram) before play. This build:

- Starts a run on load. There is no account screen.
- Saves the best score in `localStorage` on the device.
- Opens the leaderboard as a local note (“best score stays on this device”) instead of “Open in AlterU” / the App Store.
- Does not treat Crazy Games query parameters as an Aigram session.

The default `npm run build` path is unchanged for GitHub Pages and any AlterU/Aigram embed.

## Guest presentation

The Crazy Games bundle is a single Swipe Storm game:

- Header wordmark is **Swipe Storm** (Inter, with a storm mark). It does not use a script dating-app logo.
- Play controls are two labeled keys, **FLAG** and **KEEP**. Swipe left and swipe right still play the same way.
- The AlterU footer mark is not rendered, and that asset is not included in the guest JavaScript.
- `?theme=` does not switch to Arcana Admissions, Sort Line, or a generated skin. Those cartridges are omitted from this bundle.
- `crazygames/poster.png` is the upload poster. `npm run build:crazygames` copies it into the zip.

The Pages workflow publishes this guest build next to the root site, without replacing it:

https://yinxinghuan.github.io/swipe-storm/crazygames/

Progress sync through the Crazy Games SDK Data module is not wired up. Local best score is enough for this version.

## Build the upload package

```bash
npm ci
npm run build:crazygames
```

Upload `artifacts/swipe-storm-crazygames.zip` in the Crazy Games developer portal. Do not submit from this repository’s automation.

`artifacts/crazygames/` is the same unpacked folder (`index.html` plus `./assets/...`) if you need to preview it:

```bash
npx --yes serve artifacts/crazygames
```
