const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../Writing part 1 pictures');
const files = fs.readdirSync(dir);

console.log(`Found ${files.length} files in Writing part 1 pictures.`);

const baseUrl = 'https://pub-f88da22cc9ae4937a6641b7ee1702c05.r2.dev/Writing%20part%201%20pictures/';

async function testFiles() {
  let okCount = 0;
  let failed = [];

  for (const f of files) {
    const encodedName = encodeURIComponent(f);
    const url = baseUrl + encodedName;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.status === 200) {
        okCount++;
        // console.log(`[OK] ${f}`);
      } else {
        failed.push({ file: f, url, status: res.status });
      }
    } catch (e) {
      failed.push({ file: f, url, error: e.message });
    }
  }

  console.log(`\nResults: ${okCount} / ${files.length} verified on Cloudflare R2!`);
  if (failed.length > 0) {
    console.log("Failed files:", failed);
  } else {
    console.log("ALL 40 image files exist and are publicly accessible on Cloudflare R2!");
  }
}

testFiles();
