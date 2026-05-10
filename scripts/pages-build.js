// Post-build: copy worker.js and companion dirs into assets/ for Cloudflare Pages
const { copyFileSync, cpSync, existsSync, writeFileSync } = require("fs");
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

// Ensure _next/static/ (client-side JS/CSS chunks) is in assets/ for ASSETS binding.
const nextStaticSrc = join(".next", "static");
const nextStaticDst = join(".open-next", "assets", "_next", "static");
if (existsSync(nextStaticSrc)) {
  cpSync(nextStaticSrc, nextStaticDst, { recursive: true });
  console.log("_next/static -> assets/_next/static");
}

// _routes.json: bypass worker for /_next/static/* so Cloudflare CDN serves chunks directly.
// The worker does not correctly forward these requests to the ASSETS binding.
writeFileSync(
  ".open-next/assets/_routes.json",
  JSON.stringify({ version: 1, include: ["/*"], exclude: ["/_next/static/*"] })
);
console.log("_routes.json written");
