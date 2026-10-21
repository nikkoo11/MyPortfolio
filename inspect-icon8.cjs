// Connected-component analysis of the Icons8 reference PNG.
// Ink components = gear bodies; enclosed background components = hub holes.
const fs = require('fs');
const zlib = require('zlib');

function decodePNG(file) {
  const buf = fs.readFileSync(file);
  let pos = 8, width = 0, height = 0, colorType = 0, bitDepth = 8, idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = colorType === 6 ? 4 : (colorType === 4 ? 2 : (colorType === 2 ? 3 : 1));
  const bpp = channels * (bitDepth / 8);
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const ft = raw[rp++];
    const line = raw.subarray(rp, rp + stride); rp += stride;
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (ft === 1) v += a; else if (ft === 2) v += b; else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      cur[x] = v & 0xff;
    }
  }
  return { width, height, out, channels, bpp, stride, colorType };
}

const file = process.argv[2] || 'icon8big.png';
const img = decodePNG(file);
const W = img.width, H = img.height, out = img.out, bpp = img.bpp, stride = img.stride;
const alpha = (x, y) => (img.colorType === 6 ? out[y * stride + x * bpp + 3] : (img.colorType === 4 ? out[y * stride + x * bpp + 1] : 255));
const ink = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) ink[y * W + x] = alpha(x, y) > 128 ? 1 : 0;

const visited = new Uint8Array(W * H);
const stack = new Int32Array(W * H);
const compX = new Int32Array(W * H);
const compY = new Int32Array(W * H);

function flood(startX, startY, wantInk) {
  let sp = 0, count = 0;
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, sumX = 0, sumY = 0;
  stack[sp++] = startY * W + startX;
  visited[startY * W + startX] = 1;
  while (sp > 0) {
    const idx = stack[--sp];
    const x = idx % W, y = (idx - x) / W;
    compX[count] = x; compY[count] = y; count++;
    sumX += x; sumY += y;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    for (let d = 0; d < 4; d++) {
      const nx = x + (d === 0 ? 1 : d === 1 ? -1 : 0);
      const ny = y + (d === 2 ? 1 : d === 3 ? -1 : 0);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const i = ny * W + nx;
      if (visited[i] || ink[i] !== wantInk) continue;
      visited[i] = 1;
      stack[sp++] = i;
    }
  }
  return { count, minX, minY, maxX, maxY, cx: sumX / count, cy: sumY / count };
}

// outside background
const outside = flood(0, 0, 0);
const holes = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (ink[i] === 0 && !visited[i]) holes.push(flood(x, y, 0));
}
holes.sort((a, b) => b.count - a.count);

let seed = -1;
for (let i = 0; i < W * H; i++) if (ink[i]) { seed = i; break; }
const body = flood(seed % W, (seed - seed % W) / W, 1);

console.log(`file=${file} ${W}x${H}`);
console.log(`BODY  area=${body.count} bbox=(${body.minX},${body.minY})-(${body.maxX},${body.maxY}) w=${body.maxX - body.minX + 1} h=${body.maxY - body.minY + 1}`);
console.log(`HOLES count=${holes.length}`);
holes.slice(0, 8).forEach((h, i) => {
  console.log(`  hole${i}: area=${h.count} bbox=(${h.minX},${h.minY})-(${h.maxX},${h.maxY}) w=${h.maxX - h.minX + 1} h=${h.maxY - h.minY + 1} centroid=(${h.cx.toFixed(1)},${h.cy.toFixed(1)})`);
});

// ---- radial profiles per gear -------------------------------------------
function radialProfile(cx, cy, label, step) {
  const prof = [];
  for (let a = 0; a < 360; a += step) {
    const rad = (a * Math.PI) / 180;
    const dx = Math.cos(rad), dy = Math.sin(rad);
    let maxR = 0, gaps = 0, prevInk = false;
    for (let r = 1; r < W; r += 0.5) {
      const x = Math.round(cx + r * dx), y = Math.round(cy + r * dy);
      if (x < 0 || y < 0 || x >= W || y >= H) break;
      const isInk = ink[y * W + x] === 1;
      if (isInk) maxR = r;
      if (!isInk && prevInk) gaps++;
      prevInk = isInk;
    }
    prof.push({ a, maxR, gaps });
  }
  const radii = prof.map((p) => p.maxR);
  const min = Math.min(...radii), max = Math.max(...radii);
  console.log(`\n[${label}] center=(${cx.toFixed(1)},${cy.toFixed(1)}) radius range ${min.toFixed(1)}..${max.toFixed(1)}`);
  // tooth counting: group consecutive samples whose radius > min + 35% of band
  const band = max - min;
  const peaks = [];
  let cur = null;
  for (const p of prof) {
    const isPeak = p.maxR > min + band * 0.35;
    if (isPeak) { if (!cur) cur = { start: p.a, end: p.a, peak: p.maxR }; else { cur.end = p.a; cur.peak = Math.max(cur.peak, p.maxR); } }
    else if (cur) { peaks.push(cur); cur = null; }
  }
  if (cur) peaks.push(cur);
  const merged = [];
  for (const p of peaks) {
    if (merged.length && p.start - merged[merged.length - 1].end <= step * 1.5) {
      merged[merged.length - 1].end = p.end;
      merged[merged.length - 1].peak = Math.max(merged[merged.length - 1].peak, p.peak);
    } else merged.push({ ...p });
  }
  console.log(`  teeth bands=${merged.length}  tipR≈${(merged.reduce((s, p) => s + p.peak, 0) / merged.length).toFixed(1)}  rootR≈${min.toFixed(1)}`);
  console.log('  ' + prof.map((p) => `${p.a}:${p.maxR.toFixed(0)}`).join(' '));
  return prof;
}

const bigHole = holes[0], smallHole = holes[1];
radialProfile(bigHole.cx, bigHole.cy, 'BIG gear', 2);
radialProfile(smallHole.cx, smallHole.cy, 'SMALL gear', 2);

// ---- all ink components -------------------------------------------------
const vis2 = new Uint8Array(W * H);
const stack2 = new Int32Array(W * H);
const comps = [];
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (!ink[i] || vis2[i]) continue;
  let sp = 0, count = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
  stack2[sp++] = i; vis2[i] = 1;
  while (sp > 0) {
    const idx = stack2[--sp];
    const px = idx % W, py = (idx - px) / W;
    count++;
    if (px < minX) minX = px; if (px > maxX) maxX = px;
    if (py < minY) minY = py; if (py > maxY) maxY = py;
    for (let d = 0; d < 4; d++) {
      const nx = px + (d === 0 ? 1 : d === 1 ? -1 : 0);
      const ny = py + (d === 2 ? 1 : d === 3 ? -1 : 0);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (vis2[j] || !ink[j]) continue;
      vis2[j] = 1; stack2[sp++] = j;
    }
  }
  comps.push({ count, minX, minY, maxX, maxY });
}
comps.sort((a, b) => b.count - a.count);
console.log(`\nINK COMPONENTS=${comps.length}`);
comps.slice(0, 10).forEach((c, i) => console.log(`  comp${i}: area=${c.count} bbox=(${c.minX},${c.minY})-(${c.maxX},${c.maxY}) w=${c.maxX - c.minX + 1} h=${c.maxY - c.minY + 1}`));

// ---- full ASCII dump ----------------------------------------------------
const COLS = 110, ROWS = 62;
const cw = W / COLS, ch = H / ROWS;
let art = '';
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    let count = 0, total = 0;
    for (let y = Math.floor(r * ch); y < Math.min(H, Math.floor((r + 1) * ch)); y++) {
      for (let x = Math.floor(c * cw); x < Math.min(W, Math.floor((c + 1) * cw)); x++) {
        total++; if (ink[y * W + x]) count++;
      }
    }
    const frac = total ? count / total : 0;
    line += frac > 0.5 ? '#' : frac > 0.25 ? '+' : frac > 0.06 ? '.' : ' ';
  }
  art += line + '\n';
}
require('fs').writeFileSync('icon8_ascii.txt', art);
console.log('\nwrote icon8_ascii.txt');

