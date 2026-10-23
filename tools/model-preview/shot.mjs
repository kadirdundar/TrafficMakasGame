// Renders preview pages headlessly and saves PNGs (plus any window.__info the page reports).
// Needs the dev server (npm run dev) and Playwright with a Chromium build.
//   node tools/model-preview/shot.mjs <outDir> '[["name","car=bmw&preset=1","cockpit.html"], ...]'
// CHROMIUM_PATH overrides the browser binary; the GPU-less SwiftShader flags work in containers.
import { chromium } from 'playwright';

const [out, list, base = 'http://127.0.0.1:5173/tools/model-preview/'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1300, height: 1300 } });
page.on('pageerror', (e) => console.log('pageerror', e.message));
for (const [name, qs, file = 'car.html'] of JSON.parse(list)) {
  await page.goto(`${base}${file}?${qs}`);
  await page.waitForFunction(() => window.__done, null, { timeout: 180000 });
  const info = await page.evaluate(() => window.__info);
  for (const [k, v] of Object.entries(info || {})) console.log(name, k, JSON.stringify(v));
  await page.locator('canvas').first().screenshot({ path: `${out}/${name}.png` });
}
await browser.close();
