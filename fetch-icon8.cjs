const fs = require('fs');
const https = require('https');

const id = 'YIZ59MTJsuUz';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function get(url, headers = {}) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': UA, 'Accept': '*/*', Referer: 'https://icons8.com/', ...headers } }, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => resolve({ status: res.statusCode, type: res.headers['content-type'], body: Buffer.concat(chunks) }));
    });
    req.on('error', (e) => resolve({ status: 0, type: 'err', body: Buffer.from(String(e.message)) }));
    req.setTimeout(25000, () => { req.destroy(); resolve({ status: 0, type: 'timeout', body: Buffer.alloc(0) }); });
  });
}

(async () => {
  console.log('=== 403 body for svg ===');
  const s = await get(`https://img.icons8.com/?size=100&id=${id}&format=svg&color=000000`);
  console.log(s.body.toString('utf8'));

  console.log('\n=== larger PNG sizes ===');
  for (const size of [100, 200, 400, 800]) {
    const r = await get(`https://img.icons8.com/?size=${size}&id=${id}&format=png&color=000000`);
    const isPng = r.body.slice(1, 4).toString() === 'PNG';
    const dims = isPng ? `${r.body.readUInt32BE(16)}x${r.body.readUInt32BE(20)}` : 'n/a';
    console.log(`size=${size}: ${r.status} ${r.type} len=${r.body.length} dims=${dims}`);
    if (isPng) fs.writeFileSync(`big_${size}.png`, r.body);
  }

  console.log('\n=== icon page / api attempts ===');
  const pages = [
    `https://icons8.com/icons/${id}`,
    `https://icons8.com/icons/set/${id}`,
    `https://icons8.com/api/icons/${id}`,
    `https://api.icons8.com/v2/icons/${id}`,
    `https://icons8.com/icons/${id}.json`,
  ];
  for (const u of pages) {
    const r = await get(u);
    console.log(`${r.status} ${r.type} len=${r.body.length} ${u}`);
    if (r.status === 200) console.log(r.body.toString('utf8').slice(0, 1500));
  }
})();
