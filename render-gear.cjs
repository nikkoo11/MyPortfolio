// Rasterizes the generated gear polygons to ASCII so they can be compared
// against the Icons8 reference render.
const fs = require('fs');

function polar(cx, cy, r, a) {
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function gearPoints(cx, cy, tipR, teeth, tipRatio = 0.46) {
    const rootR = tipR * 0.78;
    const step = (Math.PI * 2) / teeth;
    const half = step * tipRatio * 0.5;
    const pts = [];
    const push = (p) => pts.push(p);
    for (let i = 0; i < teeth; i++) {
        const a = i * step - Math.PI / 2;
        push(polar(cx, cy, rootR, a - half * 1.45));
        push(polar(cx, cy, tipR, a - half));
        const tip2 = polar(cx, cy, tipR, a + half);
        for (let t = 0; t <= 6; t++) {
            const ang = (a - half) + (2 * half * t) / 6;
            push(polar(cx, cy, tipR, ang));
        }
        push(tip2);
        push(polar(cx, cy, rootR, a + half * 1.45));
        const nextRoot = i === teeth - 1
            ? polar(cx, cy, rootR, -Math.PI / 2 + step - half * 1.45)
            : polar(cx, cy, rootR, a + step - half * 1.45);
        const r1 = polar(cx, cy, rootR, a + half * 1.45);
        for (let t = 1; t <= 6; t++) {
            const ang = (a + half * 1.45) + ((nextRoot[1] - r1[1] >= 0 ? 1 : -1) * 0 + 0);
            push(polar(cx, cy, rootR, ang));
        }
        push(nextRoot);
    }
    return pts;
}

// simpler: polygon for a gear using straight segments (no arcs) -> still recognizable
function gearPoly(cx, cy, tipR, teeth, tipRatio = 0.46) {
    const rootR = tipR * 0.78;
    const step = (Math.PI * 2) / teeth;
    const half = step * tipRatio * 0.5;
    const pts = [];
    for (let i = 0; i < teeth; i++) {
        const a = i * step - Math.PI / 2;
        pts.push(polar(cx, cy, rootR, a - half * 1.45));
        pts.push(polar(cx, cy, tipR, a - half));
        pts.push(polar(cx, cy, tipR, a + half));
        pts.push(polar(cx, cy, rootR, a + half * 1.45));
    }
    return pts;
}

function inPoly(poly, x, y) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
}

const COLS = 100, ROWS = 50, SIZE = 24;
const big = gearPoly(9.7, 9.5, 6.5, 8);
const small = gearPoly(17.1, 16.4, 4.5, 7);
const hubs = [
    { c: [9.7, 9.5], r: 2.6 },
    { c: [17.1, 16.4], r: 1.7 }
];

let art = '';
for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
        const x = ((c + 0.5) / COLS) * SIZE;
        const y = ((r + 0.5) / ROWS) * SIZE;
        let hit = inPoly(big, x, y) || inPoly(small, x, y);
        if (!hit) {
            for (const h of hubs) {
                const d = Math.hypot(x - h.c[0], y - h.c[1]);
                if (d <= h.r && d >= h.r - 1.0) hit = true;
            }
        }
        line += hit ? '#' : ' ';
    }
    art += line + '|\n';
}
fs.writeFileSync('gear_ascii.txt', art);
console.log(art);
