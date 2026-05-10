// Post-build: copy worker.js and companion dirs into assets/ for Cloudflare Pages
const { copyFileSync, cpSync, existsSync } = require("fs");
const { join } = require("path");

copyFileSync(".open-next/worker.js", ".open-next/assets/_worker.js");
console.log("worker.js -> assets/_worker.js");

for (const dir of ["cloudflare", "middleware", ".build", "server-functions"]) {
  const src = join(".open-next", dir);
  if (existsSync(src)) {
    cpSync(src, join(".open-next/assets", dir), { recursive: true });
    console.log(`${dir} -> assets/${dir}`);
  }
}
