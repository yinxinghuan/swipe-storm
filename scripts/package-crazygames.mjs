// Copy the Crazy Games Vite output into artifacts/ and zip it with index.html
// at the archive root (Crazy Games upload layout).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-crazygames');
const staticDir = path.join(root, 'artifacts', 'crazygames');
const zipPath = path.join(root, 'artifacts', 'swipe-storm-crazygames.zip');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('dist-crazygames/index.html is missing. Run vite build --mode crazygames first.');
  process.exit(1);
}

const posterSrc = path.join(root, 'crazygames', 'poster.png');
if (!existsSync(posterSrc)) {
  console.error('crazygames/poster.png is missing.');
  process.exit(1);
}
cpSync(posterSrc, path.join(dist, 'poster.png'));

const banned = [
  /tinder/i,
  /arcana admissions/i,
  /sort line/i,
  /wizard-academy/i,
  /recycle-sort/i,
  /apps\.apple\.com/i,
  /alteru/i,
  /ss-watermark/,
  /NOPE/,
];
const assetDir = path.join(dist, 'assets');
const bundled = readdirSync(assetDir)
  .filter((name) => name.endsWith('.js'))
  .map((name) => readFileSync(path.join(assetDir, name), 'utf8'))
  .join('\n');
const css = readdirSync(assetDir)
  .filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(path.join(assetDir, name), 'utf8'))
  .join('\n');
const cssBanned = [
  /tinder/i,
  /pacifico/i,
  /brush script/i,
  /wizard-academy/i,
  /recycle-sort/i,
  /alteru/i,
  /ss-watermark/,
];
const hit = banned.find((pattern) => pattern.test(bundled))
  || cssBanned.find((pattern) => pattern.test(css));
if (hit) {
  console.error(`Crazy Games bundle still contains banned branding: ${hit}`);
  process.exit(1);
}

rmSync(staticDir, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });
cpSync(dist, staticDir, { recursive: true });

rmSync(zipPath, { force: true });
execFileSync('zip', ['-r', '-X', zipPath, '.'], { cwd: dist, stdio: 'inherit' });

const listing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
if (!listing.split('\n').some((line) => /\sindex\.html$/.test(line) && !line.includes('/'))) {
  console.error('zip is missing index.html at the archive root');
  process.exit(1);
}

console.log(`static: ${staticDir}`);
console.log(`zip:    ${zipPath}`);
