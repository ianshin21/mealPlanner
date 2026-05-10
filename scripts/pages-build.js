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

// Copy public/ assets (og-image, robots.txt, ads.txt 등) to assets/ root.
// Next.js는 public/를 정적 서빙하지만 opennextjs 빌드에는 포함되지 않으므로 수동 복사.
if (existsSync("public")) {
  cpSync("public", ".open-next/assets", { recursive: true });
  console.log("public/ -> assets/");
}

// _routes.json: bypass worker for static assets so Cloudflare CDN serves them directly.
writeFileSync(
  ".open-next/assets/_routes.json",
  JSON.stringify({
    version: 1,
    include: ["/*"],
    exclude: ["/_next/static/*", "/og-image.png", "/robots.txt", "/ads.txt"],
  })
);
console.log("_routes.json written");
