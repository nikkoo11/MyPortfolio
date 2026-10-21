// Generates stroke-ready gear outline paths for a 24x24 nav icon.
const r2 = (n) => Math.round(n * 1000) / 1000;

function polar(cx, cy, r, a) {
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function gear(cx, cy, tipR, teeth, tipRatio = 0.46) {
    const rootR = tipR * 0.78;
    const step = (Math.PI * 2) / teeth;
    const half = step * tipRatio * 0.5;
    let d = '';
    let started = false;
    for (let i = 0; i < teeth; i++) {
        const a = i * step - Math.PI / 2;
        const root1 = polar(cx, cy, rootR, a - half * 1.45);
        const tip1 = polar(cx, cy, tipR, a - half);
        const tip2 = polar(cx, cy, tipR, a + half);
        const root2 = polar(cx, cy, rootR, a + half * 1.45);
        const nextRoot = i === teeth - 1
            ? polar(cx, cy, rootR, -Math.PI / 2 + step - half * 1.45)
            : polar(cx, cy, rootR, a + step - half * 1.45);
        d += started ? `L${r2(root1[0])} ${r2(root1[1])}` : `M${r2(root1[0])} ${r2(root1[1])}`;
        started = true;
        d += `L${r2(tip1[0])} ${r2(tip1[1])}`;
        d += `A${r2(tipR)} ${r2(tipR)} 0 0 1 ${r2(tip2[0])} ${r2(tip2[1])}`;
        d += `L${r2(root2[0])} ${r2(root2[1])}`;
        d += `A${r2(rootR)} ${r2(rootR)} 0 0 1 ${r2(nextRoot[0])} ${r2(nextRoot[1])}`;
    }
    return d + 'Z';
}

const BIG = { cx: 9.5, cy: 9.5, r: 6.3, teeth: 8 };
const SMALL = { cx: 17.1, cy: 17.1, r: 4.3, teeth: 7 };
const HUB_BIG = 2.5;
const HUB_SMALL = 1.65;

const bigD = gear(BIG.cx, BIG.cy, BIG.r, BIG.teeth);
const smallD = gear(SMALL.cx, SMALL.cy, SMALL.r, SMALL.teeth);

const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <mask id="gearMask">
      <rect width="24" height="24" fill="#fff" />
      <circle cx="${SMALL.cx}" cy="${SMALL.cy}" r="${SMALL.r + 1.1}" fill="#000" />
    </mask>
  </defs>
  <g mask="url(#gearMask)">
    <path d="${bigD}" />
  </g>
  <path d="${smallD}" />
  <circle cx="${BIG.cx}" cy="${BIG.cy}" r="${HUB_BIG}" />
  <circle cx="${SMALL.cx}" cy="${SMALL.cy}" r="${HUB_SMALL}" />
</svg>`;

require('fs').writeFileSync('gear-icon.svg', markup);
console.log(markup);

