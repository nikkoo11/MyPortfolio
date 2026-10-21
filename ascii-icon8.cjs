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
const getA = (x, y) => (img.colorType === 6 ? out[y * stride + x * bpp + 3] : (img.colorType === 4 ? out[y * stride + x * bpp + 1] : 255));
const getL = (x, y) => {
  if (img.colorType === 6 || img.colorType === 2) { const i = y * stride + x * bpp; return 0.299 * out[i] + 0.587 * out[i + 1] + 0.114 * out[i + 2]; }
  return out[y * stride + x * bpp];
};

const COLS = 64, ROWS = 32;
const cw = W / COLS, ch = H / ROWS;
let art = '';
for (let r = 0; r < ROWS; r++) {
  let line = '';
  for (let c = 0; c < COLS; c++) {
    let count = 0, total = 0;
    for (let y = Math.floor(r * ch); y < Math.min(H, Math.floor((r + 1) * ch)); y++) {
      for (let x = Math.floor(c * cw); x < Math.min(W, Math.floor((c + 1) * cw)); x++) {
        total++;
        if (getA(x, y) > 40 && getL(x, y) < 175) count++;
      }
    }
    const frac = total ? count / total : 0;
    line += frac > 0.6 ? '#' : frac > 0.35 ? '+' : frac > 0.12 ? '.' : ' ';
  }
  art += line + '\n';
}
console.log(art);
