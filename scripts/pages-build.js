// Post-build: copy worker.js and companion dirs into assets/ for Cloudflare Pages
const { copyFileSync, cpSync, existsSync, readdirSync } = require("fs");
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

// Ensure _next/static/ (client-side JS chunks) is in assets/ for ASSETS binding.
// @opennextjs/cloudflare v1.x may bundle static assets into the server function
// rather than the assets directory, causing 404s for JS chunks in Cloudflare Pages.
const nextStaticSrc = join(".next", "static");
const nextStaticDst = join(".open-next", "assets", "_next", "static");
if (existsSync(nextStaticSrc)) {
  cpSync(nextStaticSrc, nextStaticDst, { recursive: true });
  console.log("_next/static -> assets/_next/static");
}

// Debug: confirm assets top-level
console.log("assets/ contents:", readdirSync(".open-next/assets").join(", "));
