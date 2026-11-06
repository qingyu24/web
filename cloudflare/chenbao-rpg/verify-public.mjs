import assert from 'node:assert/strict';

const origins = [
  'https://qingyu24.github.io/web/mist-lantern/',
  'https://rpg.chenbao.fun/',
];
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`);
  return response;
}
async function verify(base) {
  const html = await (await get(base)).text();
  assert.match(html, /雾灯归途/);
  const manifestResponse = await get(new URL('manifest.webmanifest', base));
  const manifest = await manifestResponse.json();
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.orientation, 'landscape');
  const swResponse = await get(new URL('sw.js', base));
  assert.match(swResponse.headers.get('content-type'), /javascript/);
  assert.match(await swResponse.text(), /mist-lantern-mobile/);
  const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(x => x[1]);
  assert.ok(assets.length >= 2, 'Built JS and CSS must be linked');
  for (const path of [...assets, 'art/rework/hero-walk.webp']) {
    const response = await fetch(new URL(path, base), { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  }
  console.log(`PASS HTTPS, game HTML, manifest, Service Worker, JS/CSS and hero art: ${base}`);
}
for (const base of origins) {
  for (let attempt = 1; ; attempt++) {
    try { await verify(base); break; }
    catch (error) {
      if (attempt >= 12) throw error;
      console.log(`Waiting for publication ${base} (${attempt}/12): ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}
